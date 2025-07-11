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
import { NotificationService } from '@/services/notificationService';
import { z } from 'zod';
const NotificationSchema = z.object({
    title: z.string().min(1, "El título es requerido."),
    message: z.string().min(1, "El mensaje es requerido."),
    recipientType: z.enum(['ALL', 'RESIDENT', 'PROPERTY', 'USER']).default('ALL'),
    recipientId: z.string().optional(), // ID of specific recipient if type is not ALL
});
const NotificationFilterSchema = z.object({
    type: z.string().optional(),
    read: z.boolean().optional(),
});
export function GET(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN', 'RESIDENT', 'STAFF']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            if (!payload.complexId || !payload.schemaName || !payload.id) {
                return NextResponse.json({ message: 'Usuario sin complejo asociado o ID de usuario faltante' }, { status: 400 });
            }
            const { searchParams } = new URL(request.url);
            const filters = {
                type: searchParams.get('type') || undefined,
                read: searchParams.has('read') ? searchParams.get('read') === 'true' : undefined,
            };
            const validatedFilters = NotificationFilterSchema.parse(filters);
            const notificationService = new NotificationService(payload.schemaName);
            const notifications = yield notificationService.getNotifications(payload.id, payload.complexId, validatedFilters);
            ServerLogger.info(`Notificaciones listadas para el usuario ${payload.id} en complejo ${payload.complexId}`);
            return NextResponse.json(notifications, { status: 200 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error('Error al obtener notificaciones:', error);
            return NextResponse.json({ message: 'Error al obtener notificaciones' }, { status: 500 });
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
            if (!payload.complexId || !payload.schemaName || !payload.id) {
                return NextResponse.json({ message: 'Usuario sin complejo asociado o ID de usuario faltante' }, { status: 400 });
            }
            const body = yield request.json();
            const validatedData = NotificationSchema.parse(body);
            const notificationService = new NotificationService(payload.schemaName);
            yield notificationService.sendNotificationToRecipients(payload.complexId, payload.schemaName, validatedData.title, validatedData.message, validatedData.recipientType, validatedData.recipientId, payload.id);
            ServerLogger.info(`Notificación enviada a ${validatedData.recipientType} por ${payload.email} en complejo ${payload.complexId}`);
            return NextResponse.json({ message: 'Notificación enviada exitosamente' }, { status: 200 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error('Error al enviar notificación:', error);
            return NextResponse.json({ message: 'Error al enviar notificación' }, { status: 500 });
        }
    });
}
