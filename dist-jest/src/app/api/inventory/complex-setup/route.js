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
const ComplexInfoSchema = z.object({
    name: z.string().min(1, "El nombre es requerido."),
    totalUnits: z.number().int().min(0, "El total de unidades debe ser un número positivo."),
    adminEmail: z.string().email("Email de administrador inválido."),
    adminName: z.string().min(1, "El nombre del administrador es requerido."),
    adminPhone: z.string().optional(),
    address: z.string().min(1, "La dirección es requerida."),
    city: z.string().min(1, "La ciudad es requerida."),
    state: z.string().min(1, "El estado es requerido."),
    country: z.string().min(1, "El país es requerido."),
    propertyTypes: z.array(z.string()).optional(),
});
export function GET(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const armoniaPrisma = getPrisma('armonia');
            const complexInfo = yield armoniaPrisma.residentialComplex.findUnique({
                where: { id: payload.complexId },
            });
            if (!complexInfo) {
                return NextResponse.json({ message: 'Información del complejo no encontrada' }, { status: 404 });
            }
            ServerLogger.info(`Información del complejo ${payload.complexId} obtenida.`);
            return NextResponse.json(complexInfo, { status: 200 });
        }
        catch (error) {
            ServerLogger.error('Error al obtener información del complejo:', error);
            return NextResponse.json({ message: 'Error al obtener información del complejo' }, { status: 500 });
        }
    });
}
export function PUT(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const body = yield request.json();
            const validatedData = ComplexInfoSchema.partial().parse(body); // Partial para actualizaciones
            if (!payload.complexId) {
                return NextResponse.json({ message: 'ID de complejo no encontrado en la sesión' }, { status: 400 });
            }
            const armoniaPrisma = getPrisma('armonia');
            const updatedComplex = yield armoniaPrisma.residentialComplex.update({
                where: { id: payload.complexId },
                data: validatedData,
            });
            ServerLogger.info(`Información del complejo ${payload.complexId} actualizada.`);
            return NextResponse.json(updatedComplex, { status: 200 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error('Error al actualizar información del complejo:', error);
            return NextResponse.json({ message: 'Error al actualizar información del complejo' }, { status: 500 });
        }
    });
}
