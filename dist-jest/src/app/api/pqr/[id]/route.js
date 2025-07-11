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
import { getPrisma } from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth';
import { z } from 'zod';
import { ServerLogger } from '@/lib/logging/server-logger';
const PQRUpdateSchema = z.object({
    subject: z.string().min(1, "El asunto es requerido.").optional(),
    description: z.string().min(1, "La descripción es requerida.").optional(),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED', 'REJECTED']).default('OPEN').optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM').optional(),
    category: z.string().min(1, "La categoría es requerida.").optional(),
    assignedToId: z.number().int().positive("ID de asignado inválido.").optional(),
});
export function GET(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        var _b, _c;
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN', 'STAFF', 'RESIDENT']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const pqrId = parseInt(params.id);
            const tenantPrisma = getPrisma(payload.schemaName);
            const pqr = yield tenantPrisma.pQR.findUnique({
                where: { id: pqrId, complexId: payload.complexId },
                include: {
                    reportedBy: { select: { name: true } },
                    assignedTo: { select: { name: true } },
                    comments: { include: { author: { select: { name: true } } } },
                },
            });
            if (!pqr) {
                return NextResponse.json({ message: 'PQR no encontrada' }, { status: 404 });
            }
            // Si es residente, asegurar que solo puede ver sus propios PQRs
            if (payload.role === 'RESIDENT' && pqr.reportedById !== payload.id) {
                return NextResponse.json({ message: 'Permisos insuficientes' }, { status: 403 });
            }
            const formattedPQR = Object.assign(Object.assign({}, pqr), { reportedByName: ((_b = pqr.reportedBy) === null || _b === void 0 ? void 0 : _b.name) || 'N/A', assignedToName: ((_c = pqr.assignedTo) === null || _c === void 0 ? void 0 : _c.name) || 'N/A', comments: pqr.comments.map(comment => {
                    var _a;
                    return (Object.assign(Object.assign({}, comment), { authorName: ((_a = comment.author) === null || _a === void 0 ? void 0 : _a.name) || 'N/A' }));
                }) });
            ServerLogger.info(`PQR ${pqrId} obtenida para el complejo ${payload.complexId}`);
            return NextResponse.json(formattedPQR, { status: 200 });
        }
        catch (error) {
            ServerLogger.error(`Error al obtener PQR ${params.id}:`, error);
            return NextResponse.json({ message: 'Error al obtener PQR' }, { status: 500 });
        }
    });
}
export function PUT(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN', 'STAFF']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const pqrId = parseInt(params.id);
            const body = yield request.json();
            const validatedData = PQRUpdateSchema.parse(body);
            const tenantPrisma = getPrisma(payload.schemaName);
            const updatedPQR = yield tenantPrisma.pQR.update({
                where: { id: pqrId, complexId: payload.complexId },
                data: validatedData,
            });
            ServerLogger.info(`PQR ${pqrId} actualizada en complejo ${payload.complexId}`);
            return NextResponse.json(updatedPQR, { status: 200 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error(`Error al actualizar PQR ${params.id}:`, error);
            return NextResponse.json({ message: 'Error al actualizar PQR' }, { status: 500 });
        }
    });
}
export function DELETE(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const pqrId = parseInt(params.id);
            const tenantPrisma = getPrisma(payload.schemaName);
            yield tenantPrisma.pQR.delete({
                where: { id: pqrId, complexId: payload.complexId },
            });
            ServerLogger.info(`PQR ${pqrId} eliminada del complejo ${payload.complexId}`);
            return NextResponse.json({ message: 'PQR eliminada exitosamente' }, { status: 200 });
        }
        catch (error) {
            ServerLogger.error(`Error al eliminar PQR ${params.id}:`, error);
            return NextResponse.json({ message: 'Error al eliminar PQR' }, { status: 500 });
        }
    });
}
