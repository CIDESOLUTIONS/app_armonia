var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth';
import { z } from 'zod';
import { ServerLogger } from '@/lib/logging/server-logger';
const DigitalLogSchema = z.object({
    title: z.string().min(1, "El título es requerido."),
    content: z.string().min(1, "El contenido es requerido."),
    logDate: z.string().datetime("Fecha y hora inválidas."),
});
export function GET(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN', 'STAFF']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const tenantPrisma = getPrisma(payload.schemaName);
            const logs = yield tenantPrisma.digitalLog.findMany({
                where: { complexId: payload.complexId },
                include: {
                    createdBy: { select: { name: true } },
                },
                orderBy: { logDate: 'desc' },
            });
            const logsWithCreatedByName = logs.map(log => {
                var _a;
                return (Object.assign(Object.assign({}, log), { createdByName: ((_a = log.createdBy) === null || _a === void 0 ? void 0 : _a.name) || 'N/A' }));
            });
            ServerLogger.info(`Minutas digitales listadas para el complejo ${payload.complexId}`);
            return NextResponse.json(logsWithCreatedByName, { status: 200 });
        }
        catch (error) {
            ServerLogger.error('Error al obtener minutas digitales:', error);
            return NextResponse.json({ message: 'Error al obtener minutas digitales' }, { status: 500 });
        }
    });
}
export function POST(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN', 'STAFF']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const body = yield request.json();
            const validatedData = DigitalLogSchema.parse(body);
            const tenantPrisma = getPrisma(payload.schemaName);
            const newLog = yield tenantPrisma.digitalLog.create({
                data: Object.assign(Object.assign({}, validatedData), { complexId: payload.complexId, createdBy: payload.id }),
            });
            ServerLogger.info(`Minuta digital creada: ${newLog.title} por ${payload.email} en complejo ${payload.complexId}`);
            return NextResponse.json(newLog, { status: 201 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error('Error al crear minuta digital:', error);
            return NextResponse.json({ message: 'Error al crear minuta digital' }, { status: 500 });
        }
    });
}
export function PUT(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN', 'STAFF']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const _a = yield request.json(), { id } = _a, updateData = __rest(_a, ["id"]);
            const validatedData = DigitalLogSchema.partial().parse(updateData); // Partial para actualizaciones
            if (!id) {
                return NextResponse.json({ message: 'ID de minuta digital requerido para actualizar' }, { status: 400 });
            }
            const tenantPrisma = getPrisma(payload.schemaName);
            const updatedLog = yield tenantPrisma.digitalLog.update({
                where: { id: parseInt(id) },
                data: validatedData,
            });
            ServerLogger.info(`Minuta digital actualizada: ${updatedLog.title} en complejo ${payload.complexId}`);
            return NextResponse.json(updatedLog, { status: 200 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error('Error al actualizar minuta digital:', error);
            return NextResponse.json({ message: 'Error al actualizar minuta digital' }, { status: 500 });
        }
    });
}
export function DELETE(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN', 'STAFF']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const { id } = yield request.json();
            if (!id) {
                return NextResponse.json({ message: 'ID de minuta digital requerido para eliminar' }, { status: 400 });
            }
            const tenantPrisma = getPrisma(payload.schemaName);
            yield tenantPrisma.digitalLog.delete({ where: { id: parseInt(id) } });
            ServerLogger.info(`Minuta digital eliminada: ID ${id} en complejo ${payload.complexId}`);
            return NextResponse.json({ message: 'Minuta digital eliminada exitosamente' }, { status: 200 });
        }
        catch (error) {
            ServerLogger.error('Error al eliminar minuta digital:', error);
            return NextResponse.json({ message: 'Error al eliminar minuta digital' }, { status: 500 });
        }
    });
}
