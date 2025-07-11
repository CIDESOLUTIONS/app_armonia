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
export function PUT(_req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const _token = (_a = req.headers.get('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token)
            return NextResponse.json({ message: 'No token provided' }, { status: 401 });
        try {
            // Variable decoded eliminada por lint complexId: number; role: string; schemaName?: string };
            console.log('[API Assemblies Update] Token decodificado:', decoded);
            if (decoded.role !== 'COMPLEX_ADMIN') {
                return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 });
            }
            const { searchParams } = new URL(req.url);
            const id = parseInt(searchParams.get('id') || '0');
            if (!id)
                return NextResponse.json({ message: 'ID requerido' }, { status: 400 });
            const { title, type, date, description, agenda } = yield req.json();
            if (!title || !type || !date || !agenda || !Array.isArray(agenda)) {
                return NextResponse.json({ message: 'Faltan campos requeridos' }, { status: 400 });
            }
            const _schemaName = ((_b = decoded.schemaName) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || 'armonia';
            const assemblyResult = yield prisma.$queryRawUnsafe(`SELECT * FROM "${schemaName}"."Assembly" WHERE id = $1 AND "complexId" = $2`, id, decoded.complexId);
            if (!assemblyResult.length) {
                return NextResponse.json({ message: 'Asamblea no encontrada o no autorizada' }, { status: 404 });
            }
            const updatedAssembly = yield prisma.$queryRawUnsafe(`UPDATE "${schemaName}"."Assembly" 
       SET title = $1, type = $2, date = $3::timestamp, description = $4, agenda = $5::jsonb
       WHERE id = $6 AND "complexId" = $7
       RETURNING *`, title, type, date, description || null, JSON.stringify(agenda), id, decoded.complexId);
            console.log('[API Assemblies Update] Asamblea actualizada:', updatedAssembly[0]);
            return NextResponse.json({ message: 'Asamblea actualizada con éxito', assembly: updatedAssembly[0] }, { status: 200 });
        }
        catch (error) {
            console.error('[API Assemblies Update] Error:', error);
            return NextResponse.json({ message: 'Error al actualizar', error: String(error) }, { status: 500 });
        }
    });
}
