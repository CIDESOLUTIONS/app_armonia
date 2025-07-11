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
import { verifyToken } from '@/lib/auth';
import { validateRequest } from '@/lib/validation';
import { GetAgendaSchema, UpdateAgendaSchema } from '@/validators/assemblies/agenda.validator';
export function GET(req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.headers.get('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        const { searchParams } = new URL(req.url);
        const queryParams = {
            assemblyId: searchParams.get('assemblyId')
        };
        // Validar parámetros
        const validation = validateRequest(GetAgendaSchema, queryParams);
        if (!validation.success) {
            return validation.response;
        }
        const validatedParams = validation.data;
        const assemblyId = parseInt(validatedParams.assemblyId);
        if (!token)
            return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
        try {
            const decoded = yield verifyToken(token);
            const schemaName = decoded.schemaName.toLowerCase();
            prisma.setTenantSchema(schemaName);
            const agenda = yield prisma.$queryRawUnsafe(`SELECT * FROM "${schemaName}"."AgendaItem" WHERE "assemblyId" = $1`, assemblyId);
            return NextResponse.json({ agenda }, { status: 200 });
        }
        catch (error) {
            return NextResponse.json({ message: 'Error al obtener agenda', error: String(error) }, { status: 500 });
        }
    });
}
export function PUT(req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.headers.get('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        const { searchParams } = new URL(req.url);
        const body = yield req.json();
        // Combinar parámetros de consulta y cuerpo para validación
        const dataToValidate = Object.assign({ id: searchParams.get('id') }, body);
        // Validar datos
        const validation = validateRequest(UpdateAgendaSchema, dataToValidate);
        if (!validation.success) {
            return validation.response;
        }
        const validatedData = validation.data;
        const id = parseInt(validatedData.id);
        if (!token)
            return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
        try {
            const decoded = yield verifyToken(token);
            const schemaName = decoded.schemaName.toLowerCase();
            prisma.setTenantSchema(schemaName);
            yield prisma.$queryRawUnsafe(`UPDATE "${schemaName}"."AgendaItem" SET notes = $1, completed = $2 WHERE id = $3`, validatedData.notes, validatedData.completed, id);
            return NextResponse.json({ message: 'Agenda actualizada' }, { status: 200 });
        }
        catch (error) {
            return NextResponse.json({ message: 'Error al actualizar agenda', error: String(error) }, { status: 500 });
        }
    });
}
