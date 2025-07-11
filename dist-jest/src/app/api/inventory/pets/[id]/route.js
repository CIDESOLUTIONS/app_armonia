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
const PetUpdateSchema = z.object({
    name: z.string().min(1, "El nombre es requerido.").optional(),
    species: z.string().min(1, "La especie es requerida.").optional(),
    breed: z.string().min(1, "La raza es requerida.").optional(),
    ownerName: z.string().min(1, "El nombre del propietario es requerido.").optional(),
    propertyId: z.number().int().positive("ID de propiedad inválido.").optional(),
    isActive: z.boolean().optional(),
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
            const validatedData = PetUpdateSchema.parse(updateData);
            const tenantPrisma = getPrisma(payload.schemaName);
            const updatedPet = yield tenantPrisma.pet.update({
                where: { id },
                data: validatedData,
            });
            ServerLogger.info(`Mascota actualizada: ${updatedPet.name} en complejo ${payload.complexId}`);
            return NextResponse.json(updatedPet, { status: 200 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error('Error al actualizar mascota:', error);
            return NextResponse.json({ message: 'Error al actualizar mascota' }, { status: 500 });
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
            yield tenantPrisma.pet.delete({ where: { id } });
            ServerLogger.info(`Mascota eliminada: ID ${id} en complejo ${payload.complexId}`);
            return NextResponse.json({ message: 'Mascota eliminada exitosamente' }, { status: 200 });
        }
        catch (error) {
            ServerLogger.error('Error al eliminar mascota:', error);
            return NextResponse.json({ message: 'Error al eliminar mascota' }, { status: 500 });
        }
    });
}
