var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/app/api/verify-session/route.ts
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { ServerLogger } from '@/lib/logging/server-logger';
export function GET(_req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            ServerLogger.info(`Verificando sesión`);
            // Verificar autenticación
            const { auth, payload } = yield verifyAuth(req);
            if (!auth || !payload) {
                ServerLogger.warn('Verificación de sesión fallida: Token inválido o expirado');
                return NextResponse.json({
                    valid: false,
                    message: "Sesión no válida o expirada"
                }, { status: 401 });
            }
            // Sesión válida
            ServerLogger.info(`Sesión verificada para usuario ID: ${payload.id}`);
            return NextResponse.json({
                valid: true,
                user: {
                    id: payload.id,
                    email: payload.email,
                    role: payload.role
                }
            });
        }
        catch (error) {
            ServerLogger.error(`Error verificando sesión:`, error);
            return NextResponse.json({
                valid: false,
                message: "Error al verificar la sesión"
            }, { status: 500 });
        }
    });
}
