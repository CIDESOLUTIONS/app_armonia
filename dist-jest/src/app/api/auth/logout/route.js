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
import { ServerLogger } from '@/lib/logging/server-logger';
export function POST(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = NextResponse.json({ message: 'Sesión cerrada exitosamente' });
            response.cookies.set('token', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                sameSite: 'lax',
                maxAge: 0, // Expira la cookie inmediatamente
            });
            ServerLogger.info('Usuario ha cerrado sesión');
            return response;
        }
        catch (error) {
            ServerLogger.error('Error al cerrar sesión:', error);
            return NextResponse.json({ message: 'Error al cerrar sesión' }, { status: 500 });
        }
    });
}
