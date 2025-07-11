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
 * API para marcar un anuncio como leído
 *
 * POST: Marca un anuncio específico como leído por el usuario actual
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
            // Verificar si el anuncio existe
            const announcement = yield prisma.announcement.findUnique({
                where: { id }
            });
            if (!announcement) {
                return NextResponse.json({ error: 'Anuncio no encontrado' }, { status: 404 });
            }
            // Verificar si ya está marcado como leído
            const existingRead = yield prisma.announcementRead.findFirst({
                where: {
                    announcementId: id,
                    userId
                }
            });
            if (existingRead) {
                return NextResponse.json({ message: 'Anuncio ya marcado como leído' }, { status: 200 });
            }
            // Marcar como leído
            const read = yield prisma.announcementRead.create({
                data: {
                    announcementId: id,
                    userId,
                    readAt: new Date()
                }
            });
            return NextResponse.json({
                id: read.id,
                announcementId: read.announcementId,
                userId: read.userId,
                readAt: read.readAt
            }, { status: 200 });
        }
        catch (error) {
            console.error('Error al marcar anuncio como leído:', error);
            return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
        }
    });
}
