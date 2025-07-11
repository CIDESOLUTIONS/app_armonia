var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// C:\Users\meciz\Documents\armonia\frontend\src\app\api\inventory\units\route.ts
import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
const prisma = getPrisma();
export function GET() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const units = yield prisma.property.findMany({
                where: { complexId: 1 }, // Ajustar con autenticación real
            });
            return NextResponse.json(units);
        }
        catch (error) {
            console.error('Error fetching units:', error);
            return NextResponse.json({ error: 'Error al cargar unidades' }, { status: 500 });
        }
    });
}
export function POST(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const _data = yield request.json();
            const complex = yield prisma.residentialComplex.findUnique({ where: { id: data.complexId } });
            if (!complex)
                throw new Error('Conjunto residencial no encontrado');
            const unit = yield prisma.property.create({
                data: {
                    number: data.number,
                    type: data.type,
                    area: data.area,
                    status: data.status,
                    complexId: data.complexId,
                },
            });
            return NextResponse.json(unit);
        }
        catch (error) {
            console.error('Error creating unit:', error);
            return NextResponse.json({ error: error.message || 'Error al crear unidad' }, { status: 500 });
        }
    });
}
export function PUT(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const _data = yield request.json();
            const { id } = data;
            const complex = yield prisma.residentialComplex.findUnique({ where: { id: data.complexId } });
            if (!complex)
                throw new Error('Conjunto residencial no encontrado');
            const unit = yield prisma.property.update({
                where: { id: parseInt(id) },
                data: {
                    number: data.number,
                    type: data.type,
                    area: data.area,
                    status: data.status,
                    complexId: data.complexId,
                },
            });
            return NextResponse.json(unit);
        }
        catch (error) {
            console.error('Error updating unit:', error);
            return NextResponse.json({ error: error.message || 'Error al actualizar unidad' }, { status: 500 });
        }
    });
}
