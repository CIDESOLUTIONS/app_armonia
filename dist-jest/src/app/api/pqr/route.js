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
const PQRSchema = z.object({
    subject: z.string().min(1, "El asunto es requerido."),
    description: z.string().min(1, "La descripción es requerida."),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED', 'REJECTED']).default('OPEN'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
    category: z.string().min(1, "La categoría es requerida."),
    reportedById: z.number().int().positive("ID de reportante inválido."),
    assignedToId: z.number().int().positive("ID de asignado inválido.").optional(),
});
export function GET(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN', 'STAFF', 'RESIDENT']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const tenantPrisma = getPrisma(payload.schemaName);
            let where = { complexId: payload.complexId };
            const searchParams = request.nextUrl.searchParams;
            const status = searchParams.get('status');
            const priority = searchParams.get('priority');
            const search = searchParams.get('search');
            if (status)
                where.status = status;
            if (priority)
                where.priority = priority;
            if (search) {
                where.OR = [
                    { subject: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ];
            }
            // Si es residente, solo mostrar sus PQRs
            if (payload.role === 'RESIDENT') {
                where.reportedById = payload.id;
            }
            const pqrs = yield tenantPrisma.pQR.findMany({
                where,
                include: {
                    reportedBy: { select: { name: true } },
                    assignedTo: { select: { name: true } },
                    comments: { include: { author: { select: { name: true } } } },
                },
                orderBy: { createdAt: 'desc' },
            });
            const formattedPQRs = pqrs.map(pqr => {
                var _a, _b;
                return (Object.assign(Object.assign({}, pqr), { reportedByName: ((_a = pqr.reportedBy) === null || _a === void 0 ? void 0 : _a.name) || 'N/A', assignedToName: ((_b = pqr.assignedTo) === null || _b === void 0 ? void 0 : _b.name) || 'N/A', comments: pqr.comments.map(comment => {
                        var _a;
                        return (Object.assign(Object.assign({}, comment), { authorName: ((_a = comment.author) === null || _a === void 0 ? void 0 : _a.name) || 'N/A' }));
                    }) }));
            });
            ServerLogger.info(`PQRs listadas para el complejo ${payload.complexId}`);
            return NextResponse.json(formattedPQRs, { status: 200 });
        }
        catch (error) {
            ServerLogger.error('Error al obtener PQRs:', error);
            return NextResponse.json({ message: 'Error al obtener PQRs' }, { status: 500 });
        }
    });
}
export function POST(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN', 'RESIDENT']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const body = yield request.json();
            const validatedData = PQRSchema.parse(Object.assign(Object.assign({}, body), { reportedById: payload.id }));
            const tenantPrisma = getPrisma(payload.schemaName);
            const newPQR = yield tenantPrisma.pQR.create({ data: validatedData });
            ServerLogger.info(`PQR creada: ${newPQR.subject} por ${payload.email} en complejo ${payload.complexId}`);
            return NextResponse.json(newPQR, { status: 201 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error('Error al crear PQR:', error);
            return NextResponse.json({ message: 'Error al crear PQR' }, { status: 500 });
        }
    });
}
