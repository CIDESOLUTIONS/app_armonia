var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { generateToken } from '@/lib/auth';
import { withValidation } from '@/lib/validation';
import { LoginSchema } from '@/validators/auth/login.validator';
import * as bcrypt from "bcrypt";
function loginHandler(validatedData, req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password, complexId, schemaName } = validatedData;
            console.log(`[LOGIN] Intento de login para: ${email} en complejo: ${complexId || schemaName}`);
            const prisma = getPrisma();
            // Construir la consulta con filtro multi-tenant
            const whereClause = {
                email: email,
                active: true
            };
            // Si se proporciona complexId, usarlo directamente
            if (complexId) {
                whereClause.complexId = complexId;
            }
            else if (schemaName) {
                // Si se proporciona schemaName, primero buscar el complex
                const complex = yield prisma.residentialComplex.findUnique({
                    where: { schemaName: schemaName }
                });
                if (!complex) {
                    console.log(`[LOGIN] Complejo no encontrado: ${schemaName}`);
                    return NextResponse.json({ message: "Complejo residencial no encontrado" }, { status: 404 });
                }
                whereClause.complexId = complex.id;
            }
            // Si no se proporciona complexId ni schemaName, buscar usuario sin filtro de complejo
            const user = yield prisma.user.findFirst({
                where: whereClause
            });
            console.log(`[LOGIN] Usuario encontrado:`, !!user);
            if (!user) {
                console.log(`[LOGIN] Usuario no encontrado: ${email}`);
                return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
            }
            const passwordMatch = yield bcrypt.compare(password, user.password);
            console.log(`[LOGIN] Contraseña válida:`, passwordMatch);
            if (!passwordMatch) {
                console.log(`[LOGIN] Contraseña incorrecta para: ${email}`);
                return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
            }
            console.log(`[LOGIN] Login exitoso para: ${email}, rol: ${user.role}`);
            const payload = {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
                complexId: user.complexId,
                isGlobalAdmin: user.role === 'ADMIN',
                isReception: user.role === 'RECEPTION',
                isComplexAdmin: user.role === 'COMPLEX_ADMIN',
                isResident: user.role === 'RESIDENT'
            };
            const token = yield generateToken(payload);
            console.log(`[LOGIN] Token generado para: ${email}`);
            const response = NextResponse.json({ user: payload });
            response.cookies.set('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24, // 1 day
            });
            return response;
        }
        catch (error) {
            ServerLogger.error('[LOGIN] Error en API:', error);
            return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
        }
    });
}
// Exportar el handler con validación
export const POST = withValidation(LoginSchema, loginHandler);
