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
const ServiceUpdateSchema = z.object({
    name: z.string().min(1, "El nombre del servicio es requerido.").optional(),
    description: z.string().optional(),
    capacity: z.number().int().min(0, "La capacidad debe ser un número positivo.").optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    status: z.enum(['active', 'inactive', 'maintenance']).default('active').optional(),
    cost: z.number().min(0, "El costo debe ser un número positivo.").optional(),
    rules: z.string().optional(),
});
export function GET(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN', 'RESIDENT', 'RECEPTION']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const serviceId = parseInt(params.id);
            if (!payload.complexId) {
                return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
            }
            const prisma = getPrisma(payload.schemaName);
            const service = yield prisma.service.findUnique({
                where: { id: serviceId, complexId: payload.complexId },
            });
            if (!service) {
                return NextResponse.json({ message: 'Servicio no encontrado' }, { status: 404 });
            }
            ServerLogger.info(`Servicio ${serviceId} obtenido para el complejo ${payload.complexId}`);
            return NextResponse.json(service, { status: 200 });
        }
        catch (error) {
            ServerLogger.error(`Error al obtener servicio ${params.id}:`, error);
            return NextResponse.json({ message: 'Error al obtener el servicio' }, { status: 500 });
        }
    });
}
export function PUT(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const serviceId = parseInt(params.id);
            const body = yield request.json();
            const validatedData = ServiceUpdateSchema.parse(body);
            if (!payload.complexId) {
                return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
            }
            const prisma = getPrisma(payload.schemaName);
            const updatedService = yield prisma.service.update({
                where: { id: serviceId, complexId: payload.complexId },
                data: validatedData,
            });
            ServerLogger.info(`Servicio ${serviceId} actualizado en complejo ${payload.complexId}`);
            return NextResponse.json(updatedService, { status: 200 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error(`Error al actualizar servicio ${params.id}:`, error);
            return NextResponse.json({ message: 'Error al actualizar servicio' }, { status: 500 });
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
            const serviceId = parseInt(params.id);
            if (!payload.complexId) {
                return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
            }
            const prisma = getPrisma(payload.schemaName);
            yield prisma.service.delete({
                where: { id: serviceId, complexId: payload.complexId },
            });
            ServerLogger.info(`Servicio ${serviceId} eliminado del complejo ${payload.complexId}`);
            return NextResponse.json({ message: 'Servicio eliminado exitosamente' }, { status: 200 });
        }
        catch (error) {
            ServerLogger.error(`Error al eliminar servicio ${params.id}:`, error);
            return NextResponse.json({ message: 'Error al eliminar servicio' }, { status: 500 });
        }
    });
}
