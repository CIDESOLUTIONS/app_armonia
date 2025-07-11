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
const PQRCommentSchema = z.object({
    comment: z.string().min(1, "El comentario no puede estar vacío."),
});
export function POST(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN', 'STAFF', 'RESIDENT']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const pqrId = parseInt(params.id);
            const body = yield request.json();
            const validatedData = PQRCommentSchema.parse(body);
            const tenantPrisma = getPrisma(payload.schemaName);
            const newComment = yield tenantPrisma.pQRComment.create({
                data: {
                    pqrId: pqrId,
                    comment: validatedData.comment,
                    authorId: payload.id,
                },
            });
            ServerLogger.info(`Comentario añadido a PQR ${pqrId} por ${payload.email}`);
            return NextResponse.json(newComment, { status: 201 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error(`Error al añadir comentario a PQR ${params.id}:`, error);
            return NextResponse.json({ message: 'Error al añadir comentario' }, { status: 500 });
        }
    });
}
