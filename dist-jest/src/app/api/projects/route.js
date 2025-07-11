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
const ProjectSchema = z.object({
    name: z.string().min(1, "El nombre del proyecto es requerido."),
    description: z.string().optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).default('PENDING'),
    startDate: z.string().datetime("Fecha de inicio inválida."),
    endDate: z.string().datetime("Fecha de fin inválida.").optional().nullable(),
    assignedToId: z.number().int().positive("ID de asignado inválido.").optional().nullable(),
});
export function GET(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const tenantPrisma = getPrisma(payload.schemaName);
            let where = { complexId: payload.complexId };
            const searchParams = request.nextUrl.searchParams;
            const status = searchParams.get('status');
            const search = searchParams.get('search');
            const projectId = searchParams.get('id');
            if (status)
                where.status = status;
            if (projectId)
                where.id = parseInt(projectId);
            if (search) {
                where.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ];
            }
            const projects = yield tenantPrisma.project.findMany({
                where,
                include: {
                    assignedTo: { select: { name: true } },
                    createdBy: { select: { name: true } },
                },
                orderBy: { startDate: 'desc' },
            });
            const formattedProjects = projects.map(project => {
                var _a, _b;
                return (Object.assign(Object.assign({}, project), { assignedToName: ((_a = project.assignedTo) === null || _a === void 0 ? void 0 : _a.name) || 'N/A', createdByName: ((_b = project.createdBy) === null || _b === void 0 ? void 0 : _b.name) || 'N/A' }));
            });
            ServerLogger.info(`Proyectos listados para el complejo ${payload.complexId}`);
            return NextResponse.json(formattedProjects, { status: 200 });
        }
        catch (error) {
            ServerLogger.error('Error al obtener proyectos:', error);
            return NextResponse.json({ message: 'Error al obtener proyectos' }, { status: 500 });
        }
    });
}
export function POST(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const body = yield request.json();
            const validatedData = ProjectSchema.parse(body);
            const tenantPrisma = getPrisma(payload.schemaName);
            const newProject = yield tenantPrisma.project.create({
                data: Object.assign(Object.assign({}, validatedData), { complexId: payload.complexId, createdBy: payload.id }),
            });
            ServerLogger.info(`Proyecto creado: ${newProject.name} por ${payload.email} en complejo ${payload.complexId}`);
            return NextResponse.json(newProject, { status: 201 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error('Error al crear proyecto:', error);
            return NextResponse.json({ message: 'Error al crear proyecto' }, { status: 500 });
        }
    });
}
export function PUT(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const _a = yield request.json(), { id } = _a, updateData = __rest(_a, ["id"]);
            const validatedData = ProjectSchema.partial().parse(updateData); // Partial para actualizaciones
            if (!id) {
                return NextResponse.json({ message: 'ID de proyecto requerido para actualizar' }, { status: 400 });
            }
            const tenantPrisma = getPrisma(payload.schemaName);
            const updatedProject = yield tenantPrisma.project.update({
                where: { id: parseInt(id) },
                data: validatedData,
            });
            ServerLogger.info(`Proyecto actualizado: ${updatedProject.name} en complejo ${payload.complexId}`);
            return NextResponse.json(updatedProject, { status: 200 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error('Error al actualizar proyecto:', error);
            return NextResponse.json({ message: 'Error al actualizar proyecto' }, { status: 500 });
        }
    });
}
export function DELETE(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const { id } = yield request.json();
            if (!id) {
                return NextResponse.json({ message: 'ID de proyecto requerido para eliminar' }, { status: 400 });
            }
            const tenantPrisma = getPrisma(payload.schemaName);
            yield tenantPrisma.project.delete({ where: { id: parseInt(id) } });
            ServerLogger.info(`Proyecto eliminado: ID ${id} en complejo ${payload.complexId}`);
            return NextResponse.json({ message: 'Proyecto eliminado exitosamente' }, { status: 200 });
        }
        catch (error) {
            ServerLogger.error('Error al eliminar proyecto:', error);
            return NextResponse.json({ message: 'Error al eliminar proyecto' }, { status: 500 });
        }
    });
}
