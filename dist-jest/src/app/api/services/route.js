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
import { ServerLogger } from '@/lib/logging/server-logger';
import { z } from 'zod';
const ServiceSchema = z.object({
    name: z.string().min(1, "El nombre del servicio es requerido."),
    description: z.string().optional(),
    capacity: z.number().int().min(0, "La capacidad debe ser un número positivo.").optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    status: z.enum(['active', 'inactive', 'maintenance']).default('active'),
    cost: z.number().min(0, "El costo debe ser un número positivo.").optional(),
    rules: z.string().optional(),
});
export function GET(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN', 'RESIDENT', 'RECEPTION']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            if (!payload.complexId) {
                return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
            }
            const prisma = getPrisma(payload.schemaName);
            const services = yield prisma.service.findMany({
                where: { complexId: payload.complexId },
            });
            ServerLogger.info(`Servicios listados para el complejo ${payload.complexId}`);
            return NextResponse.json(services, { status: 200 });
        }
        catch (error) {
            ServerLogger.error('Error al obtener servicios:', error);
            return NextResponse.json({ message: 'Error al obtener servicios' }, { status: 500 });
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
            if (!payload.complexId) {
                return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
            }
            const body = yield request.json();
            const validatedData = ServiceSchema.parse(body);
            const prisma = getPrisma(payload.schemaName);
            const newService = yield prisma.service.create({
                data: Object.assign(Object.assign({}, validatedData), { complexId: payload.complexId }),
            });
            ServerLogger.info(`Servicio creado: ${newService.name} en complejo ${payload.complexId}`);
            return NextResponse.json(newService, { status: 201 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error('Error al crear servicio:', error);
            return NextResponse.json({ message: 'Error al crear servicio' }, { status: 500 });
        }
    });
}
