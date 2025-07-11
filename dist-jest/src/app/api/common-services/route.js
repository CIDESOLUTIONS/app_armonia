var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// C:\Users\meciz\Documents\armonia\frontend\src\app\api\common-services\route.ts
import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
const prisma = getPrisma();
export function GET() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const services = yield prisma.service.findMany({
                where: { complexId: 1 },
            });
            return NextResponse.json(services);
        }
        catch (error) {
            console.error('Error fetching services:', error);
            return NextResponse.json({ error: 'Error al cargar servicios' }, { status: 500 });
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
            const service = yield prisma.service.create({
                data: {
                    name: data.name,
                    description: data.description,
                    capacity: data.capacity,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    rules: data.rules,
                    status: data.status,
                    complexId: data.complexId,
                },
            });
            return NextResponse.json(service);
        }
        catch (error) {
            console.error('Error creating service:', error);
            return NextResponse.json({ error: error.message || 'Error al crear servicio' }, { status: 500 });
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
            const service = yield prisma.service.update({
                where: { id: parseInt(id) },
                data: {
                    name: data.name,
                    description: data.description,
                    capacity: data.capacity,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    rules: data.rules,
                    status: data.status,
                    complexId: data.complexId,
                },
            });
            return NextResponse.json(service);
        }
        catch (error) {
            console.error('Error updating service:', error);
            return NextResponse.json({ error: error.message || 'Error al actualizar servicio' }, { status: 500 });
        }
    });
}
