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
const AmenityUpdateSchema = z.object({
    name: z.string().min(1, "El nombre es requerido.").optional(),
    description: z.string().optional(),
    location: z.string().min(1, "La ubicación es requerida.").optional(),
    capacity: z.number().int().min(0, "La capacidad debe ser un número positivo.").optional(),
    requiresApproval: z.boolean().optional(),
    hasFee: z.boolean().optional(),
    feeAmount: z.number().optional(),
    isActive: z.boolean().optional(),
}).refine(data => !data.hasFee || (data.hasFee && data.feeAmount !== undefined && data.feeAmount >= 0), {
    message: "El monto de la tarifa es requerido si tiene costo.",
    path: ["feeAmount"],
});
export function PUT(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const id = parseInt(params.id);
            const updateData = yield request.json();
            const validatedData = AmenityUpdateSchema.parse(updateData);
            const tenantPrisma = getPrisma(payload.schemaName);
            const updatedAmenity = yield tenantPrisma.commonArea.update({
                where: { id },
                data: validatedData,
            });
            ServerLogger.info(`Amenidad actualizada: ${updatedAmenity.name} en complejo ${payload.complexId}`);
            return NextResponse.json(updatedAmenity, { status: 200 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error('Error al actualizar amenidad:', error);
            return NextResponse.json({ message: 'Error al actualizar amenidad' }, { status: 500 });
        }
    });
}
export function DELETE(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const id = parseInt(params.id);
            const tenantPrisma = getPrisma(payload.schemaName);
            yield tenantPrisma.commonArea.delete({ where: { id } });
            ServerLogger.info(`Amenidad eliminada: ID ${id} en complejo ${payload.complexId}`);
            return NextResponse.json({ message: 'Amenidad eliminada exitosamente' }, { status: 200 });
        }
        catch (error) {
            ServerLogger.error('Error al eliminar amenidad:', error);
            return NextResponse.json({ message: 'Error al eliminar amenidad' }, { status: 500 });
        }
    });
}
