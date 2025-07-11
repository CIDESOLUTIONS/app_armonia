var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/app/api/security/digital-logs/[id]/route.ts
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { getPrisma } from '@/lib/prisma';
import { z } from 'zod';
const UpdateLogSchema = z.object({
    status: z.enum(['OPEN', 'IN_REVIEW', 'RESOLVED', 'CLOSED', 'CANCELLED']).optional(),
    supervisorReview: z.boolean().optional(),
    reviewNotes: z.string().optional(),
    followUpDate: z.string().datetime().optional(),
    requiresFollowUp: z.boolean().optional()
});
// GET: Obtener minuta específica
export function GET(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        try {
            const { auth, payload } = yield verifyAuth(request);
            if (!auth || !payload) {
                return NextResponse.json({ message: 'Token requerido' }, { status: 401 });
            }
            const logId = parseInt(params.id);
            if (isNaN(logId)) {
                return NextResponse.json({ message: 'ID inválido' }, { status: 400 });
            }
            const prisma = getPrisma();
            const digitalLog = yield prisma.digitalLog.findUnique({
                where: { id: logId },
                include: {
                    guard: { select: { id: true, name: true, email: true } },
                    reliever: { select: { id: true, name: true, email: true } },
                    creator: { select: { id: true, name: true, email: true } },
                    reviewer: { select: { id: true, name: true, email: true } }
                }
            });
            if (!digitalLog) {
                return NextResponse.json({ message: 'Minuta no encontrada' }, { status: 404 });
            }
            // Verificar acceso al complejo
            if (digitalLog.complexId !== payload.complexId) {
                return NextResponse.json({ message: 'Sin acceso a esta minuta' }, { status: 403 });
            }
            return NextResponse.json({ success: true, digitalLog });
        }
        catch (error) {
            console.error('[DIGITAL LOG GET] Error:', error);
            return NextResponse.json({ message: 'Error obteniendo minuta' }, { status: 500 });
        }
    });
}
// PUT: Actualizar minuta
export function PUT(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        try {
            const { auth, payload } = yield verifyAuth(request);
            if (!auth || !payload) {
                return NextResponse.json({ message: 'Token requerido' }, { status: 401 });
            }
            const logId = parseInt(params.id);
            if (isNaN(logId)) {
                return NextResponse.json({ message: 'ID inválido' }, { status: 400 });
            }
            const body = yield request.json();
            const validation = UpdateLogSchema.safeParse(body);
            if (!validation.success) {
                return NextResponse.json({ message: 'Datos inválidos' }, { status: 400 });
            }
            const data = validation.data;
            const prisma = getPrisma();
            // Verificar que existe y pertenece al complejo
            const existingLog = yield prisma.digitalLog.findUnique({
                where: { id: logId }
            });
            if (!existingLog || existingLog.complexId !== payload.complexId) {
                return NextResponse.json({ message: 'Minuta no encontrada' }, { status: 404 });
            }
            // Preparar datos de actualización
            const updateData = {
                updatedBy: payload.userId
            };
            if (data.status)
                updateData.status = data.status;
            if (data.requiresFollowUp !== undefined)
                updateData.requiresFollowUp = data.requiresFollowUp;
            if (data.followUpDate)
                updateData.followUpDate = new Date(data.followUpDate);
            // Solo supervisores pueden revisar
            if (data.supervisorReview && ['ADMIN', 'COMPLEX_ADMIN'].includes(payload.role)) {
                updateData.supervisorReview = true;
                updateData.reviewedBy = payload.userId;
                updateData.reviewedAt = new Date();
                if (data.reviewNotes)
                    updateData.reviewNotes = data.reviewNotes;
            }
            const updatedLog = yield prisma.digitalLog.update({
                where: { id: logId },
                data: updateData,
                include: {
                    guard: { select: { id: true, name: true, email: true } },
                    reviewer: { select: { id: true, name: true, email: true } }
                }
            });
            return NextResponse.json({
                success: true,
                message: 'Minuta actualizada exitosamente',
                digitalLog: updatedLog
            });
        }
        catch (error) {
            console.error('[DIGITAL LOG UPDATE] Error:', error);
            return NextResponse.json({ message: 'Error actualizando minuta' }, { status: 500 });
        }
    });
}
// DELETE: Eliminar minuta (solo admins)
export function DELETE(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        try {
            const { auth, payload } = yield verifyAuth(request);
            if (!auth || !payload) {
                return NextResponse.json({ message: 'Token requerido' }, { status: 401 });
            }
            if (!['ADMIN', 'COMPLEX_ADMIN'].includes(payload.role)) {
                return NextResponse.json({ message: 'Solo administradores pueden eliminar minutas' }, { status: 403 });
            }
            const logId = parseInt(params.id);
            if (isNaN(logId)) {
                return NextResponse.json({ message: 'ID inválido' }, { status: 400 });
            }
            const prisma = getPrisma();
            // Verificar que existe y pertenece al complejo
            const existingLog = yield prisma.digitalLog.findUnique({
                where: { id: logId }
            });
            if (!existingLog || existingLog.complexId !== payload.complexId) {
                return NextResponse.json({ message: 'Minuta no encontrada' }, { status: 404 });
            }
            yield prisma.digitalLog.delete({
                where: { id: logId }
            });
            console.log(`[DIGITAL LOG DELETE] Minuta ${logId} eliminada por ${payload.email}`);
            return NextResponse.json({
                success: true,
                message: 'Minuta eliminada exitosamente'
            });
        }
        catch (error) {
            console.error('[DIGITAL LOG DELETE] Error:', error);
            return NextResponse.json({ message: 'Error eliminando minuta' }, { status: 500 });
        }
    });
}
