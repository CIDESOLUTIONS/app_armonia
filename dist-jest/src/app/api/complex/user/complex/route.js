var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/app/api/user/complex/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
;
export function GET(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authHeader = request.headers.get('Authorization');
            if (!authHeader)
                throw new Error('No autorizado');
            const _token = authHeader.replace('Bearer ', '');
            // Variable decoded eliminada por lint
            prisma.setTenantSchema('public');
            const _user = yield prisma.$queryRawUnsafe(`SELECT name FROM "public"."User" WHERE id = $1 LIMIT 1`, decoded.id);
            const complex = yield prisma.$queryRawUnsafe(`SELECT name FROM "public"."ResidentialComplex" WHERE id = $1 LIMIT 1`, decoded.complexId);
            if (!Array.isArray(user) || !Array.isArray(complex) || user.length === 0 || complex.length === 0) {
                throw new Error('Usuario o conjunto no encontrado');
            }
            return NextResponse.json({ userName: user[0].name, complexName: complex[0].name });
        }
        catch (error) {
            console.error('[API User/Complex] Error:', error);
            return NextResponse.json({ message: 'Error al obtener datos' }, { status: 401 });
        }
    });
}
