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
import * as reservationService from '@/services/reservationService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { validateRequest } from '@/lib/validation';
import { GetNotificationsSchema } from '@/validators/notifications/notification.validator';
/**
 * GET /api/notifications
 * Obtiene las notificaciones del usuario actual
 */
export function GET(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verificar autenticación
            const session = yield getServerSession(authOptions);
            if (!session) {
                return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
            }
            // Obtener parámetros de consulta
            const searchParams = req.nextUrl.searchParams;
            const queryParams = {
                isRead: searchParams.get('isRead'),
                type: searchParams.get('type')
            };
            // Validar parámetros
            const validation = validateRequest(GetNotificationsSchema, queryParams);
            if (!validation.success) {
                return validation.response;
            }
            const validatedParams = validation.data;
            // Obtener notificaciones del usuario
            const notifications = yield reservationService.getUserNotifications(session.user.id, validatedParams);
            return NextResponse.json(notifications);
        }
        catch (error) {
            serverLogger.error('Error al obtener notificaciones', { error });
            return NextResponse.json({ error: 'Error al obtener notificaciones' }, { status: 500 });
        }
    });
}
