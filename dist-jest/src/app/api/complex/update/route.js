var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// C:\Users\meciz\Documents\armonia\frontend\src\app\api\complex\update\route.ts
import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
const prisma = getPrisma();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Asegúrate de que esta variable de entorno esté configurada
export function POST(req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.headers.get('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ message: 'No token provided' }, { status: 401 });
        }
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            console.log('[API Complex Update] Token decodificado:', decoded);
            const { name, address } = yield req.json();
            if (!name && !address) {
                return NextResponse.json({ message: 'Se requiere al menos un campo para actualizar' }, { status: 400 });
            }
            const updatedComplex = yield prisma.ResidentialComplex.update({
                where: { id: decoded.complexId },
                data: {
                    name: name || undefined,
                    address: address || undefined,
                },
            });
            console.log('[API Complex Update] Conjunto actualizado:', updatedComplex);
            return NextResponse.json({ message: 'Conjunto actualizado con éxito', complex: updatedComplex }, { status: 200 });
        }
        catch (error) {
            console.error('[API Complex Update] Error:', error);
            if (error instanceof jwt.JsonWebTokenError) {
                return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
            }
            return NextResponse.json({ message: 'Error al actualizar el conjunto', error: error.message }, { status: 500 });
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
