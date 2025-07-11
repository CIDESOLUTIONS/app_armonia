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
import bcrypt from 'bcrypt';
export function POST(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = yield req.json();
            const { name, email, password, role, complexId } = body;
            if (!name || !email || !password || !role) {
                return NextResponse.json({ message: "Todos los campos son requeridos" }, { status: 400 });
            }
            const prisma = getPrisma();
            // Verificar si el usuario ya existe
            const existingUser = yield prisma.$queryRawUnsafe(`SELECT id FROM "armonia"."User" WHERE email = $1`, email);
            if (existingUser && existingUser.length > 0) {
                return NextResponse.json({ message: "El usuario ya existe" }, { status: 400 });
            }
            // Hashear contraseña
            const hashedPassword = yield bcrypt.hash(password, 10);
            // Crear usuario
            const result = yield prisma.$queryRawUnsafe(`INSERT INTO "armonia"."User" (name, email, password, role, "complexId", active, "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW()) RETURNING id, name, email, role`, name, email, hashedPassword, role, complexId);
            return NextResponse.json({
                message: "Usuario creado exitosamente",
                user: result[0]
            });
        }
        catch (error) {
            console.error('[CREATE USER] Error:', error);
            return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
        }
    });
}
