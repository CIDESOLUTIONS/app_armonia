var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth';
import { z } from 'zod';
import { ServerLogger } from '@/lib/logging/server-logger';
const PQRAssignSchema = z.object({
    assignedToId: z.number().int().positive("ID de asignado inválido."),
});
export function PUT(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const pqrId = parseInt(params.id);
            const body = yield request.json();
            const validatedData = PQRAssignSchema.parse(body);
            const tenantPrisma = getPrisma(payload.schemaName);
            const updatedPQR = yield tenantPrisma.pQR.update({
                where: { id: pqrId, complexId: payload.complexId },
                data: { assignedToId: validatedData.assignedToId },
            });
            ServerLogger.info(`PQR ${pqrId} asignada a ${validatedData.assignedToId} por ${payload.email}`);
            return NextResponse.json(updatedPQR, { status: 200 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error(`Error al asignar PQR ${params.id}:`, error);
            return NextResponse.json({ message: 'Error al asignar PQR' }, { status: 500 });
        }
    });
}
