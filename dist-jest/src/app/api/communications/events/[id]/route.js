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
import { authMiddleware } from '@/lib/auth';
import { ServerLogger } from '@/lib/logging/server-logger';
import { CommunityEventService } from '@/services/communityEventService';
import { z } from 'zod';
const EventUpdateSchema = z.object({
    title: z.string().min(1, "El título es requerido.").optional(),
    description: z.string().optional(),
    startDate: z.string().datetime("Fecha de inicio inválida.").optional(),
    endDate: z.string().datetime("Fecha de fin inválida.").optional(),
    location: z.string().min(1, "La ubicación es requerida.").optional(),
    type: z.string().optional(),
    visibility: z.enum(['public', 'private', 'roles']).optional(),
    targetRoles: z.array(z.string()).optional(),
    maxAttendees: z.number().int().min(0, "El número máximo de asistentes debe ser un número positivo.").optional().nullable(),
}).refine(data => {
    if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
}, {
    message: "La fecha de inicio debe ser anterior o igual a la fecha de fin.",
    path: ["startDate"],
});
export function GET(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN', 'RESIDENT', 'STAFF']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const eventId = parseInt(params.id);
            if (!payload.complexId || !payload.schemaName) {
                return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
            }
            const communityEventService = new CommunityEventService(payload.schemaName);
            const event = yield communityEventService.getEventById(eventId, payload.complexId);
            if (!event) {
                return NextResponse.json({ message: 'Evento no encontrado' }, { status: 404 });
            }
            ServerLogger.info(`Evento ${eventId} obtenido para el complejo ${payload.complexId}`);
            return NextResponse.json(event, { status: 200 });
        }
        catch (error) {
            ServerLogger.error(`Error al obtener evento ${params.id}:`, error);
            return NextResponse.json({ message: 'Error al obtener evento' }, { status: 500 });
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
            const eventId = parseInt(params.id);
            const body = yield request.json();
            const validatedData = EventUpdateSchema.parse(body);
            if (!payload.complexId || !payload.schemaName) {
                return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
            }
            const communityEventService = new CommunityEventService(payload.schemaName);
            const updatedEvent = yield communityEventService.updateEvent(eventId, payload.complexId, Object.assign(Object.assign({}, validatedData), { startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined, endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined }));
            ServerLogger.info(`Evento ${eventId} actualizado en complejo ${payload.complexId}`);
            return NextResponse.json(updatedEvent, { status: 200 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error(`Error al actualizar evento ${params.id}:`, error);
            return NextResponse.json({ message: 'Error al actualizar evento' }, { status: 500 });
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
            const eventId = parseInt(params.id);
            if (!payload.complexId || !payload.schemaName) {
                return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
            }
            const communityEventService = new CommunityEventService(payload.schemaName);
            yield communityEventService.deleteEvent(eventId, payload.complexId);
            ServerLogger.info(`Evento ${eventId} eliminado del complejo ${payload.complexId}`);
            return NextResponse.json({ message: 'Evento eliminado exitosamente' }, { status: 200 });
        }
        catch (error) {
            ServerLogger.error(`Error al eliminar evento ${params.id}:`, error);
            return NextResponse.json({ message: 'Error al eliminar evento' }, { status: 500 });
        }
    });
}
