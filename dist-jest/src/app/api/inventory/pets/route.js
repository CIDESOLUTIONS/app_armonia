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
const PetSchema = z.object({
    name: z.string().min(1, "El nombre es requerido."),
    species: z.string().min(1, "La especie es requerida."),
    breed: z.string().min(1, "La raza es requerida."),
    ownerName: z.string().min(1, "El nombre del propietario es requerido."),
    propertyId: z.number().int().positive("ID de propiedad inválido."),
    isActive: z.boolean().default(true),
});
export function GET(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const tenantPrisma = getPrisma(payload.schemaName);
            const pets = yield tenantPrisma.pet.findMany({
                include: {
                    property: { select: { unitNumber: true } },
                },
            });
            const petsWithUnitNumber = pets.map(pet => {
                var _a;
                return (Object.assign(Object.assign({}, pet), { unitNumber: ((_a = pet.property) === null || _a === void 0 ? void 0 : _a.unitNumber) || 'N/A' }));
            });
            ServerLogger.info(`Mascotas listadas para el complejo ${payload.complexId}`);
            return NextResponse.json(petsWithUnitNumber, { status: 200 });
        }
        catch (error) {
            ServerLogger.error('Error al obtener mascotas:', error);
            return NextResponse.json({ message: 'Error al obtener mascotas' }, { status: 500 });
        }
    });
}
export function POST(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const body = yield request.json();
            const validatedData = PetSchema.parse(body);
            const tenantPrisma = getPrisma(payload.schemaName);
            const newPet = yield tenantPrisma.pet.create({ data: validatedData });
            ServerLogger.info(`Mascota creada: ${newPet.name} en complejo ${payload.complexId}`);
            return NextResponse.json(newPet, { status: 201 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error('Error al crear mascota:', error);
            return NextResponse.json({ message: 'Error al crear mascota' }, { status: 500 });
        }
    });
}
