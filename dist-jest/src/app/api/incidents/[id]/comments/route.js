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
import { incidentService } from '@/services/incidentService';
import { validateCsrfToken } from '@/lib/security/csrf-protection';
import { getServerSession } from 'next-auth';
/**
 * POST /api/incidents/[id]/comments
 * Crea un comentario para un incidente
 */
export function POST(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        try {
            // Obtener sesión del usuario
            const session = yield getServerSession();
            if (!session || !session.user) {
                return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
            }
            // Validar token CSRF
            const csrfValidation = yield validateCsrfToken(request);
            if (!csrfValidation.valid) {
                return NextResponse.json({ error: 'Token CSRF inválido' }, { status: 403 });
            }
            const id = parseInt(params.id);
            if (isNaN(id)) {
                return NextResponse.json({ error: 'ID de incidente inválido' }, { status: 400 });
            }
            // Obtener incidente actual para verificar permisos
            const currentIncident = yield incidentService.getIncidentById(id, true);
            // Verificar permisos de comentario
            const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'COMPLEX_ADMIN';
            const isStaff = session.user.role === 'STAFF';
            const isOwner = currentIncident.reportedById === session.user.id;
            const isAssigned = currentIncident.assignedToId === session.user.id;
            const isPublic = currentIncident.isPublic;
            // Residentes solo pueden comentar en sus propios incidentes o en los públicos
            if (!isAdmin && !isStaff && !isOwner && !isPublic) {
                return NextResponse.json({ error: 'No autorizado para comentar en este incidente' }, { status: 403 });
            }
            // Obtener datos del cuerpo de la solicitud
            const requestData = yield request.json();
            // Sanitizar datos de entrada
            const content = sanitizeInput(requestData.content);
            const isInternal = requestData.isInternal === true && (isAdmin || isStaff);
            const parentId = requestData.parentId ? parseInt(requestData.parentId) : undefined;
            const attachments = requestData.attachments || undefined;
            if (!content) {
                return NextResponse.json({ error: 'El contenido del comentario es requerido' }, { status: 400 });
            }
            // Crear comentario
            const comment = yield incidentService.createIncidentComment({
                incidentId: id,
                content,
                authorId: session.user.id,
                authorName: session.user.name || 'Usuario',
                authorRole: session.user.role,
                isInternal,
                parentId,
                attachments
            });
            // Registrar evento de auditoría
            yield logAuditEvent({
                userId: session.user.id,
                entityType: 'INCIDENT',
                entityId: currentIncident.id.toString(),
                action: 'INCIDENT_COMMENT_CREATED',
                details: JSON.stringify({
                    commentId: comment.id,
                    isInternal,
                    hasParent: parentId !== undefined,
                    title: currentIncident.title
                })
            });
            return NextResponse.json(comment, { status: 201 });
        }
        catch (error) {
            console.error('Error al crear comentario:', error);
            if (error.message === 'Incidente no encontrado') {
                return NextResponse.json({ error: 'Incidente no encontrado' }, { status: 404 });
            }
            if (error.message === 'Comentario padre no encontrado') {
                return NextResponse.json({ error: 'Comentario padre no encontrado' }, { status: 404 });
            }
            return NextResponse.json({ error: error.message || 'Error al crear comentario' }, { status: 500 });
        }
    });
}
/**
 * GET /api/incidents/[id]/comments
 * Obtiene los comentarios de un incidente
 */
export function GET(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        try {
            // Obtener sesión del usuario
            const session = yield getServerSession();
            if (!session || !session.user) {
                return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
            }
            const id = parseInt(params.id);
            if (isNaN(id)) {
                return NextResponse.json({ error: 'ID de incidente inválido' }, { status: 400 });
            }
            // Obtener incidente actual para verificar permisos
            const currentIncident = yield incidentService.getIncidentById(id, false);
            // Verificar permisos de acceso
            const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'COMPLEX_ADMIN';
            const isStaff = session.user.role === 'STAFF';
            const isOwner = currentIncident.reportedById === session.user.id;
            const isAssigned = currentIncident.assignedToId === session.user.id;
            const isPublic = currentIncident.isPublic;
            // Residentes solo pueden ver comentarios de sus propios incidentes o de los públicos
            if (!isAdmin && !isStaff && !isOwner && !isPublic) {
                return NextResponse.json({ error: 'No autorizado para ver comentarios de este incidente' }, { status: 403 });
            }
            // Determinar si se deben incluir comentarios internos
            const includeInternal = isAdmin || isStaff || isAssigned;
            // Obtener comentarios
            const comments = currentIncident.comments.filter(comment => includeInternal || !comment.isInternal);
            return NextResponse.json(comments);
        }
        catch (error) {
            console.error('Error al obtener comentarios:', error);
            if (error.message === 'Incidente no encontrado') {
                return NextResponse.json({ error: 'Incidente no encontrado' }, { status: 404 });
            }
            return NextResponse.json({ error: error.message || 'Error al obtener comentarios' }, { status: 500 });
        }
    });
}
