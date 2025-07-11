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
import { verifyToken } from '@/lib/auth'; // Asumiendo que verifyToken es adecuado para rutas de API
import { markNotificationAsRead } from '@/lib/communications/notification-service';
const prisma = getPrisma();
/**
 * API para marcar una notificación como leída
 *
 * PUT: Marca una notificación específica como leída por el usuario actual
 */
export function PUT(req_1, _a) {
    return __awaiter(this, arguments, void 0, function* (req, { params }) {
        var _b;
        try {
            // Verificar autenticación
            const token = (_b = req.headers.get('authorization')) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
            if (!token) {
                return NextResponse.json({ error: 'No autorizado: Token no proporcionado' }, { status: 401 });
            }
            const decoded = yield verifyToken(token); // Decodificar y verificar el token
            if (!decoded || !decoded.userId) {
                return NextResponse.json({ error: 'No autorizado: Token inválido o usuario no encontrado' }, { status: 401 });
            }
            const userId = decoded.userId;
            const { id } = params; // Obtener el ID de la notificación de los parámetros de la URL
            if (!id || typeof id !== 'string') {
                return NextResponse.json({ error: 'ID de notificación no válido' }, { status: 400 });
            }
            // Marcar notificación como leída
            const notification = yield markNotificationAsRead(id, userId);
            return NextResponse.json({
                id: notification.id,
                read: notification.read,
                readAt: notification.readAt
            }, { status: 200 });
        }
        catch (error) {
            console.error('Error al marcar notificación como leída:', error);
            return NextResponse.json({ error: 'Error al marcar notificación como leída' }, { status: 500 });
        }
    });
}
