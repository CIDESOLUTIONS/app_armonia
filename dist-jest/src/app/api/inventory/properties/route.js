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
const PropertySchema = z.object({
    unitNumber: z.string().min(1, "El número de unidad es requerido."),
    address: z.string().min(1, "La dirección es requerida."),
    type: z.string().min(1, "El tipo es requerido."),
    area: z.number().min(0, "El área debe ser un número positivo."),
    bedrooms: z.number().int().min(0, "El número de habitaciones debe ser un entero positivo."),
    bathrooms: z.number().min(0, "El número de baños debe ser un número positivo."),
    parkingSpaces: z.number().int().min(0, "El número de parqueaderos debe ser un entero positivo."),
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
            const properties = yield tenantPrisma.property.findMany();
            ServerLogger.info(`Propiedades listadas para el complejo ${payload.complexId}`);
            return NextResponse.json(properties, { status: 200 });
        }
        catch (error) {
            ServerLogger.error('Error al obtener propiedades:', error);
            return NextResponse.json({ message: 'Error al obtener propiedades' }, { status: 500 });
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
            const validatedData = PropertySchema.parse(body);
            const tenantPrisma = getPrisma(payload.schemaName);
            const newProperty = yield tenantPrisma.property.create({ data: validatedData });
            ServerLogger.info(`Propiedad creada: ${newProperty.unitNumber} en complejo ${payload.complexId}`);
            return NextResponse.json(newProperty, { status: 201 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error('Error al crear propiedad:', error);
            return NextResponse.json({ message: 'Error al crear propiedad' }, { status: 500 });
        }
    });
}
