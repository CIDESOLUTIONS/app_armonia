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
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { ServerLogger } from '@/lib/logging/server-logger';
const prisma = new PrismaClient();
export function POST(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const session = yield getServerSession(authOptions);
            if (!session || !session.user || !session.user.isGlobalAdmin) {
                return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
            }
            const { newRole, targetUserId } = yield request.json();
            if (!newRole || !targetUserId) {
                return NextResponse.json({ message: 'Rol o ID de usuario no proporcionado' }, { status: 400 });
            }
            // Validar que el nuevo rol sea uno de los roles permitidos
            const allowedRoles = ['ADMIN', 'RESIDENT', 'STAFF', 'APP_ADMIN', 'COMPLEX_ADMIN'];
            if (!allowedRoles.includes(newRole)) {
                return NextResponse.json({ message: 'Rol inválido' }, { status: 400 });
            }
            // Actualizar el rol del usuario en la base de datos
            const updatedUser = yield prisma.user.update({
                where: { id: parseInt(targetUserId) },
                data: { role: newRole },
            });
            ServerLogger.info(`Rol del usuario ${targetUserId} cambiado a ${newRole} por ${session.user.email}`);
            // Aquí podrías necesitar invalidar la sesión actual del usuario objetivo
            // o forzar un re-login para que el cambio de rol surta efecto inmediatamente.
            // Para NextAuth, esto a menudo implica un `signOut()` y `signIn()` en el cliente.
            return NextResponse.json({ message: 'Rol actualizado exitosamente', user: updatedUser }, { status: 200 });
        }
        catch (error) {
            ServerLogger.error('Error al cambiar el rol del usuario:', error);
            return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
        }
    });
}
