var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// C:\Users\meciz\Documents\armonia\frontend\src\app\api\assemblies\clean-dependencies\route.ts
import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
;
const prisma = getPrisma();
// Variable JWT_SECRET eliminada por lint
export function DELETE(_req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const _token = (_a = req.headers.get('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token)
            return NextResponse.json({ message: 'No token provided' }, { status: 401 });
        try {
            // Variable decoded eliminada por lint complexId: number; role: string };
            console.log('[API Clean Dependencies] Token decodificado:', decoded);
            if (decoded.role !== 'COMPLEX_ADMIN') {
                return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 });
            }
            // Variable url eliminada por lint
            const id = parseInt(url.searchParams.get('id') || '0', 10);
            if (!id)
                return NextResponse.json({ message: 'ID de asamblea requerido' }, { status: 400 });
            yield prisma.$transaction([
                prisma.attendance.deleteMany({ where: { assemblyId: id } }),
                prisma.votingQuestion.deleteMany({ where: { assemblyId: id } }),
                prisma.document.deleteMany({ where: { assemblyId: id } }),
            ]);
            console.log('[API Clean Dependencies] Dependencias eliminadas para asamblea:', id);
            return NextResponse.json({ message: 'Dependencias eliminadas' }, { status: 200 });
        }
        catch (error) {
            console.error('[API Clean Dependencies] Error:', error);
            return NextResponse.json({ message: 'Error al eliminar dependencias', error: error.message }, { status: 500 });
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
