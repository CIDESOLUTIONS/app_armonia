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
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { verifyPasswordResetToken } from '@/lib/auth';
import { ServerLogger } from '@/lib/logging/server-logger';
const prisma = new PrismaClient();
const ResetPasswordSchema = z.object({
    token: z.string().min(1, { message: "Token requerido." }),
    newPassword: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
});
export function POST(request) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const body = yield request.json();
            const validatedData = ResetPasswordSchema.parse(body);
            const { token, newPassword } = validatedData;
            const decodedToken = yield verifyPasswordResetToken(token);
            if (!decodedToken) {
                ServerLogger.warn('Intento de restablecimiento de contraseña con token inválido o expirado.');
                return NextResponse.json({ message: "Token inválido o expirado." }, { status: 400 });
            }
            const { id: userId, email, schemaName } = decodedToken;
            let user;
            let targetPrisma = prisma;
            if (schemaName) {
                targetPrisma = new PrismaClient({
                    datasources: {
                        db: { url: (_a = process.env.DATABASE_URL) === null || _a === void 0 ? void 0 : _a.replace('armonia', schemaName) },
                    },
                });
            }
            user = yield targetPrisma.user.findUnique({ where: { id: userId, email } });
            if (!user) {
                ServerLogger.warn(`Usuario no encontrado para restablecimiento de contraseña: ${email} en esquema ${schemaName || 'principal'}`);
                return NextResponse.json({ message: "Usuario no encontrado." }, { status: 404 });
            }
            const hashedPassword = yield bcrypt.hash(newPassword, 10);
            yield targetPrisma.user.update({
                where: { id: userId },
                data: { password: hashedPassword },
            });
            if (schemaName) {
                yield targetPrisma.$disconnect();
            }
            ServerLogger.info(`Contraseña restablecida exitosamente para el usuario: ${email}`);
            return NextResponse.json({ message: "Contraseña restablecida exitosamente." }, { status: 200 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: "Error de validación", errors: error.errors }, { status: 400 });
            }
            ServerLogger.error('Error en la solicitud de restablecimiento de contraseña:', error);
            return NextResponse.json({ message: "Error interno del servidor." }, { status: 500 });
        }
    });
}
