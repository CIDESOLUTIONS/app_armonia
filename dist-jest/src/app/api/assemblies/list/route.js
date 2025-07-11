var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/app/api/assemblies/list/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
;
// Variable JWT_SECRET eliminada por lint
export function GET(_req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const _token = (_a = req.headers.get('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ message: 'No token provided' }, { status: 401 });
        }
        try {
            // Variable decoded eliminada por lint complexId: number; schemaName: string; role: string };
            console.log('[API Assemblies List] Token decodificado:', decoded);
            const _schemaName = decoded.schemaName.toLowerCase();
            yield prisma.$disconnect();
            yield prisma.$connect();
            prisma.setTenantSchema(schemaName);
            const assemblies = yield prisma.$queryRawUnsafe(`SELECT * FROM "${schemaName}"."Assembly" WHERE "complexId" = $1 ORDER BY "createdAt" DESC`, decoded.complexId);
            console.log('[API Assemblies List] Asambleas encontradas:', assemblies);
            return NextResponse.json({ assemblies }, { status: 200 });
        }
        catch (error) {
            console.error('[API Assemblies List] Error detallado:', error);
            if (error instanceof jwt.JsonWebTokenError) {
                return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
            }
            return NextResponse.json({ message: 'Error al obtener las asambleas', error: String(error) }, { status: 500 });
        }
    });
}
