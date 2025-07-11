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
const AmenitySchema = z.object({
    name: z.string().min(1, "El nombre es requerido."),
    description: z.string().optional(),
    location: z.string().min(1, "La ubicación es requerida."),
    capacity: z.number().int().min(0, "La capacidad debe ser un número positivo."),
    requiresApproval: z.boolean().default(false),
    hasFee: z.boolean().default(false),
    feeAmount: z.number().optional(),
    isActive: z.boolean().default(true),
}).refine(data => !data.hasFee || (data.hasFee && data.feeAmount !== undefined && data.feeAmount >= 0), {
    message: "El monto de la tarifa es requerido si tiene costo.",
    path: ["feeAmount"],
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
            const amenities = yield tenantPrisma.commonArea.findMany();
            ServerLogger.info(`Amenidades listadas para el complejo ${payload.complexId}`);
            return NextResponse.json(amenities, { status: 200 });
        }
        catch (error) {
            ServerLogger.error('Error al obtener amenidades:', error);
            return NextResponse.json({ message: 'Error al obtener amenidades' }, { status: 500 });
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
            const validatedData = AmenitySchema.parse(body);
            const tenantPrisma = getPrisma(payload.schemaName);
            const newAmenity = yield tenantPrisma.commonArea.create({ data: validatedData });
            ServerLogger.info(`Amenidad creada: ${newAmenity.name} en complejo ${payload.complexId}`);
            return NextResponse.json(newAmenity, { status: 201 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error('Error al crear amenidad:', error);
            return NextResponse.json({ message: 'Error al crear amenidad' }, { status: 500 });
        }
    });
}
