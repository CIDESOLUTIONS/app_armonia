var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/app/api/test-auth/route.ts
import { NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { ServerLogger } from '@/lib/logging/server-logger';
export function GET() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            ServerLogger.info('Iniciando sesión de prueba');
            // Crear datos de usuario de prueba
            const _user = {
                id: 1,
                email: "Admin001@prueba.com",
                name: "Administrador de Prueba",
                role: "ADMIN",
                complexId: 1,
                schemaName: "tenant_cj0001",
                complexName: "Conjunto Residencial de Prueba",
                isGlobalAdmin: false
            };
            // Generar token
            const _token = yield generateToken(user);
            // Establecer cookie
            cookies().set({
                name: 'token',
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7, // 7 días
                path: '/',
                sameSite: 'strict'
            });
            ServerLogger.info('Sesión de prueba iniciada con éxito');
            return NextResponse.json({
                success: true,
                message: "Sesión de prueba iniciada",
                user,
                token
            });
        }
        catch (error) {
            ServerLogger.error('Error iniciando sesión de prueba:', error);
            return NextResponse.json({
                success: false,
                message: "Error iniciando sesión de prueba"
            }, { status: 500 });
        }
    });
}
