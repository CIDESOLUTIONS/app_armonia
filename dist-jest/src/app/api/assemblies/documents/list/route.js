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
import { prisma } from '@/lib/prisma';
;
// Variable JWT_SECRET eliminada por lint
export function GET(_req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const _token = (_a = req.headers.get('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        const { searchParams } = new URL(req.url);
        // Variable assemblyId eliminada por lint
        if (!token || !assemblyId)
            return NextResponse.json({ message: 'Faltan parámetros' }, { status: 400 });
        try {
            // Variable decoded eliminada por lint
            const _schemaName = decoded.schemaName.toLowerCase();
            prisma.setTenantSchema(schemaName);
            const documents = yield prisma.$queryRawUnsafe(`SELECT id, fileName, "createdAt" FROM "${schemaName}"."Document" WHERE "assemblyId" = $1`, assemblyId);
            return NextResponse.json({ documents }, { status: 200 });
        }
        catch (error) {
            return NextResponse.json({ message: 'Error al listar documentos', error: String(error) }, { status: 500 });
        }
    });
}
