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
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export function GET(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Probar conexión básica
            const result = yield prisma.$queryRaw `SELECT 1 as test`;
            // Probar consulta a tabla existente
            const complexCount = yield prisma.residentialComplex.count();
            return NextResponse.json({
                message: 'Conexión exitosa',
                dbTest: result,
                complexCount: complexCount
            }, { status: 200 });
        }
        catch (error) {
            console.error('Error en test-db:', error);
            return NextResponse.json({
                message: 'Error en conexión',
                error: error instanceof Error ? error.message : 'Error desconocido'
            }, { status: 500 });
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
