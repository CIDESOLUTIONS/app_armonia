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
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
export function GET(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { searchParams } = new URL(request.url);
            const _schemaName = searchParams.get('schemaName') || 'armonia';
            prisma.setTenantSchema(schemaName);
            const tenants = yield prisma.manualTenant.findMany();
            return NextResponse.json(tenants);
        }
        catch (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    });
}
export function POST(request) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { name, schemaName } = yield request.json();
            prisma.setTenantSchema('armonia'); // Crear en armonia
            const newTenant = yield prisma.manualTenant.create({
                data: { name, schemaName },
            });
            return NextResponse.json(newTenant, { status: 201 });
        }
        catch (error) {
            if (error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2010' &&
                ((_a = error.meta) === null || _a === void 0 ? void 0 : _a.code) === '23505') {
                return NextResponse.json({ error: 'El nombre o schemaName ya existe' }, { status: 400 });
            }
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    });
}
