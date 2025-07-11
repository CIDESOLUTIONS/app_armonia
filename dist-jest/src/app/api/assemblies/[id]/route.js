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
import { UpdateAssemblySchema } from '@/validators/assemblies/assemblies.validator';
export function PUT(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const id = parseInt(params.id);
            const body = yield request.json();
            const validatedData = UpdateAssemblySchema.parse(body);
            const prisma = getPrisma();
            const updatedAssembly = yield prisma.assembly.update({
                where: { id: id, complexId: payload.complexId },
                data: {
                    title: validatedData.title,
                    description: validatedData.description,
                    scheduledDate: validatedData.scheduledDate ? new Date(validatedData.scheduledDate) : undefined,
                    location: validatedData.location,
                    type: validatedData.type,
                    agenda: validatedData.agenda,
                    status: validatedData.status,
                },
            });
            ServerLogger.info(`[ASSEMBLIES] Asamblea actualizada: ${updatedAssembly.id} por ${payload.email}`);
            return NextResponse.json(updatedAssembly, { status: 200 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error('[ASSEMBLIES PUT] Error:', error);
            return NextResponse.json({ message: 'Error interno' }, { status: 500 });
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
            const id = parseInt(params.id);
            const prisma = getPrisma();
            yield prisma.assembly.delete({
                where: { id: id, complexId: payload.complexId },
            });
            ServerLogger.info(`[ASSEMBLIES] Asamblea eliminada: ${id} por ${payload.email}`);
            return NextResponse.json({ message: 'Asamblea eliminada exitosamente' }, { status: 200 });
        }
        catch (error) {
            ServerLogger.error('[ASSEMBLIES DELETE] Error:', error);
            return NextResponse.json({ message: 'Error interno' }, { status: 500 });
        }
    });
}
