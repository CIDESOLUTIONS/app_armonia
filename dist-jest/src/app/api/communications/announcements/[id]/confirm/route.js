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
const prisma = getPrisma();
/**
 * API para confirmar la lectura de un anuncio que requiere confirmación
 *
 * POST: Confirma la lectura de un anuncio específico por el usuario actual
 */
export function POST(req_1, _a) {
    return __awaiter(this, arguments, void 0, function* (req, { params }) {
        var _b;
        try {
            // Verificar autenticación usando el token del encabezado
            const token = (_b = req.headers.get('authorization')) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
            if (!token) {
                return NextResponse.json({ error: 'No autorizado: Token no proporcionado' }, { status: 401 });
            }
            const decoded = yield verifyToken(token); // Decodificar y verificar el token
            if (!decoded || !decoded.userId) {
                return NextResponse.json({ error: 'No autorizado: Token inválido o usuario no encontrado' }, { status: 401 });
            }
            const userId = decoded.userId;
            const { id } = params; // Obtener el ID del anuncio de los parámetros de la URL
            if (!id || typeof id !== 'string') {
                return NextResponse.json({ error: 'ID de anuncio no válido' }, { status: 400 });
            }
            // Verificar si el anuncio existe y requiere confirmación
            const announcement = yield prisma.announcement.findUnique({
                where: { id }
            });
            if (!announcement) {
                return NextResponse.json({ error: 'Anuncio no encontrado' }, { status: 404 });
            }
            if (!announcement.requiresConfirmation) {
                return NextResponse.json({ error: 'Este anuncio no requiere confirmación' }, { status: 400 });
            }
            // Verificar si ya está confirmado
            const existingConfirmation = yield prisma.announcementConfirmation.findFirst({
                where: {
                    announcementId: id,
                    userId
                }
            });
            if (existingConfirmation) {
                return NextResponse.json({ message: 'Anuncio ya confirmado' }, { status: 200 });
            }
            // Registrar confirmación
            const confirmation = yield prisma.announcementConfirmation.create({
                data: {
                    announcementId: id,
                    userId,
                    confirmedAt: new Date()
                }
            });
            // También marcar como leído
            yield prisma.announcementRead.upsert({
                where: {
                    announcementId_userId: {
                        announcementId: id,
                        userId
                    }
                },
                update: {},
                create: {
                    announcementId: id,
                    userId,
                    readAt: new Date()
                }
            });
            return NextResponse.json({
                id: confirmation.id,
                announcementId: confirmation.announcementId,
                userId: confirmation.userId,
                confirmedAt: confirmation.confirmedAt
            }, { status: 200 });
        }
        catch (error) {
            console.error('Error al confirmar lectura de anuncio:', error);
            return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
        }
    });
}
