var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/app/api/auth/check/route.ts
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { ServerLogger } from '@/lib/logging/server-logger';
/**
 * Endpoint para verificar si un token de autenticación es válido
 * Se usa principalmente para validar si el usuario debe permanecer autenticado
 */
export function GET(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            ServerLogger.debug('[API] Verificando sesión...');
            // Verificar la autenticación
            const { auth, payload } = yield verifyAuth(request);
            if (!auth || !payload) {
                ServerLogger.debug('[API] Sesión inválida');
                return NextResponse.json({
                    valid: false,
                    message: "Sesión inválida o expirada"
                }, { status: 401 });
            }
            // Si llegamos aquí, la sesión es válida
            ServerLogger.debug('[API] Sesión válida para:', payload.email);
            return NextResponse.json({
                valid: true,
                user: {
                    id: payload.id,
                    email: payload.email,
                    role: payload.role,
                    complexId: payload.complexId,
                    name: payload.name,
                    schemaName: payload.schemaName,
                    complexName: payload.complexName,
                    isGlobalAdmin: payload.isGlobalAdmin
                }
            });
        }
        catch (error) {
            ServerLogger.error('[API] Error verificando sesión:', error);
            return NextResponse.json({
                valid: false,
                message: "Error al verificar la sesión"
            }, { status: 500 });
        }
    });
}
