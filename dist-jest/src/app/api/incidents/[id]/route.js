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
import { withValidation, validateRequest } from '@/lib/validation';
import { IncidentIdSchema, UpdateIncidentSchema, CancelIncidentSchema } from '@/validators/incidents/incident-id.validator';
/**
 * GET /api/incidents/[id]
 * Obtiene un incidente por su ID
 */
export function GET(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        try {
            // Obtener sesión del usuario
            const session = yield getServerSession();
            if (!session || !session.user) {
                return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
            }
            // Validar parámetros de ruta
            const validation = validateRequest(IncidentIdSchema, params);
            if (!validation.success) {
                return validation.response;
            }
            const validatedParams = validation.data;
            const id = parseInt(validatedParams.id);
            // Determinar si se deben incluir datos internos según el rol
            const includeInternal = session.user.role === 'ADMIN' ||
                session.user.role === 'COMPLEX_ADMIN' ||
                session.user.role === 'STAFF';
            // Obtener incidente
            const incident = yield incidentService.getIncidentById(id, includeInternal);
            // Verificar permisos de acceso
            const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'COMPLEX_ADMIN';
            const isStaff = session.user.role === 'STAFF';
            const isResident = session.user.role === 'RESIDENT';
            const isOwner = incident.reportedById === session.user.id;
            const isAssigned = incident.assignedToId === session.user.id;
            const isPublic = incident.isPublic;
            // Residentes solo pueden ver sus propios incidentes o los públicos
            if (isResident && !isOwner && !isPublic) {
                return NextResponse.json({ error: 'No autorizado para ver este incidente' }, { status: 403 });
            }
            // Registrar evento de auditoría
            yield logAuditEvent({
                userId: session.user.id,
                entityType: 'INCIDENT',
                entityId: incident.id.toString(),
                action: 'INCIDENT_VIEWED',
                details: JSON.stringify({
                    title: incident.title,
                    category: incident.category,
                    status: incident.status
                })
            });
            return NextResponse.json(incident);
        }
        catch (error) {
            console.error('Error al obtener incidente:', error);
            if (error.message === 'Incidente no encontrado') {
                return NextResponse.json({ error: 'Incidente no encontrado' }, { status: 404 });
            }
            return NextResponse.json({ error: error.message || 'Error al obtener incidente' }, { status: 500 });
        }
    });
}
/**
 * PUT /api/incidents/[id]
 * Actualiza la información de un incidente
 */
function updateIncidentHandler(validatedData_1, request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (validatedData, request, { params }) {
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
            // Validar parámetros de ruta
            const routeValidation = validateRequest(IncidentIdSchema, params);
            if (!routeValidation.success) {
                return routeValidation.response;
            }
            const validatedParams = routeValidation.data;
            const id = parseInt(validatedParams.id);
            // Obtener incidente actual para verificar permisos
            const currentIncident = yield incidentService.getIncidentById(id, true);
            // Verificar permisos de actualización
            const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'COMPLEX_ADMIN';
            const isStaff = session.user.role === 'STAFF';
            const isOwner = currentIncident.reportedById === session.user.id;
            const isAssigned = currentIncident.assignedToId === session.user.id;
            // Solo admins, staff asignado o el propietario pueden actualizar
            if (!isAdmin && !isAssigned && !(isStaff && currentIncident.status === 'REPORTED') && !isOwner) {
                return NextResponse.json({ error: 'No autorizado para actualizar este incidente' }, { status: 403 });
            }
            // Sanitizar datos de entrada
            const sanitizedData = {};
            // Residentes solo pueden actualizar campos limitados
            if (isOwner && !isAdmin && !isStaff) {
                if (validatedData.title !== undefined)
                    sanitizedData.title = sanitizeInput(validatedData.title);
                if (validatedData.description !== undefined)
                    sanitizedData.description = sanitizeInput(validatedData.description);
                if (validatedData.location !== undefined)
                    sanitizedData.location = sanitizeInput(validatedData.location);
                if (validatedData.mainPhotoUrl !== undefined)
                    sanitizedData.mainPhotoUrl = sanitizeInput(validatedData.mainPhotoUrl);
                if (validatedData.attachments !== undefined)
                    sanitizedData.attachments = validatedData.attachments;
            }
            else {
                // Staff y admins pueden actualizar todos los campos
                if (validatedData.title !== undefined)
                    sanitizedData.title = sanitizeInput(validatedData.title);
                if (validatedData.description !== undefined)
                    sanitizedData.description = sanitizeInput(validatedData.description);
                if (validatedData.category !== undefined)
                    sanitizedData.category = sanitizeInput(validatedData.category);
                if (validatedData.subcategory !== undefined)
                    sanitizedData.subcategory = sanitizeInput(validatedData.subcategory);
                if (validatedData.priority !== undefined)
                    sanitizedData.priority = validatedData.priority;
                if (validatedData.impact !== undefined)
                    sanitizedData.impact = sanitizeInput(validatedData.impact);
                if (validatedData.location !== undefined)
                    sanitizedData.location = sanitizeInput(validatedData.location);
                if (validatedData.unitId !== undefined)
                    sanitizedData.unitId = validatedData.unitId;
                if (validatedData.unitNumber !== undefined)
                    sanitizedData.unitNumber = sanitizeInput(validatedData.unitNumber);
                if (validatedData.area !== undefined)
                    sanitizedData.area = sanitizeInput(validatedData.area);
                if (validatedData.isPublic !== undefined)
                    sanitizedData.isPublic = validatedData.isPublic;
                if (validatedData.isEmergency !== undefined)
                    sanitizedData.isEmergency = validatedData.isEmergency;
                if (validatedData.requiresFollowUp !== undefined)
                    sanitizedData.requiresFollowUp = validatedData.requiresFollowUp;
                if (validatedData.tags !== undefined)
                    sanitizedData.tags = validatedData.tags.map((tag) => sanitizeInput(tag));
                if (validatedData.mainPhotoUrl !== undefined)
                    sanitizedData.mainPhotoUrl = sanitizeInput(validatedData.mainPhotoUrl);
                if (validatedData.attachments !== undefined)
                    sanitizedData.attachments = validatedData.attachments;
                if (validatedData.relatedIncidentIds !== undefined)
                    sanitizedData.relatedIncidentIds = validatedData.relatedIncidentIds;
                if (validatedData.visitorId !== undefined)
                    sanitizedData.visitorId = validatedData.visitorId;
                if (validatedData.packageId !== undefined)
                    sanitizedData.packageId = validatedData.packageId;
            }
            // Agregar información del usuario que actualiza
            sanitizedData.updatedById = session.user.id;
            sanitizedData.updatedByName = session.user.name || 'Usuario';
            sanitizedData.updatedByRole = session.user.role;
            // Actualizar incidente
            const updatedIncident = yield incidentService.updateIncident(id, sanitizedData);
            // Registrar evento de auditoría
            yield logAuditEvent({
                userId: session.user.id,
                entityType: 'INCIDENT',
                entityId: updatedIncident.id.toString(),
                action: 'INCIDENT_UPDATED',
                details: JSON.stringify({
                    updatedFields: Object.keys(sanitizedData),
                    title: updatedIncident.title,
                    category: updatedIncident.category,
                    status: updatedIncident.status
                })
            });
            return NextResponse.json(updatedIncident);
        }
        catch (error) {
            console.error('Error al actualizar incidente:', error);
            if (error.message === 'Incidente no encontrado') {
                return NextResponse.json({ error: 'Incidente no encontrado' }, { status: 404 });
            }
            return NextResponse.json({ error: error.message || 'Error al actualizar incidente' }, { status: 500 });
        }
    });
}
/**
 * DELETE /api/incidents/[id]
 * Cancela un incidente (no lo elimina físicamente)
 */
function cancelIncidentHandler(validatedData_1, request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (validatedData, request, { params }) {
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
            // Validar parámetros de ruta
            const routeValidation = validateRequest(IncidentIdSchema, params);
            if (!routeValidation.success) {
                return routeValidation.response;
            }
            const validatedParams = routeValidation.data;
            const id = parseInt(validatedParams.id);
            // Obtener incidente actual para verificar permisos
            const currentIncident = yield incidentService.getIncidentById(id, true);
            // Verificar permisos de cancelación
            const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'COMPLEX_ADMIN';
            const isOwner = currentIncident.reportedById === session.user.id;
            // Solo admins o el propietario pueden cancelar
            if (!isAdmin && !isOwner) {
                return NextResponse.json({ error: 'No autorizado para cancelar este incidente' }, { status: 403 });
            }
            // Verificar que el incidente esté en un estado que permita cancelación
            const cancelableStates = ['REPORTED', 'ASSIGNED', 'IN_PROGRESS', 'ON_HOLD'];
            if (!cancelableStates.includes(currentIncident.status)) {
                return NextResponse.json({ error: `No se puede cancelar un incidente en estado ${currentIncident.status}` }, { status: 400 });
            }
            const reason = validatedData.reason ? sanitizeInput(validatedData.reason) : 'Cancelado por el usuario';
            // Cambiar estado a CANCELLED
            const cancelledIncident = yield incidentService.changeIncidentStatus(id, {
                newStatus: 'CANCELLED',
                changedById: session.user.id,
                changedByName: session.user.name || 'Usuario',
                changedByRole: session.user.role,
                reason
            });
            // Registrar evento de auditoría
            yield logAuditEvent({
                userId: session.user.id,
                entityType: 'INCIDENT',
                entityId: cancelledIncident.id.toString(),
                action: 'INCIDENT_CANCELLED',
                details: JSON.stringify({
                    reason,
                    title: cancelledIncident.title,
                    previousStatus: currentIncident.status
                })
            });
            return NextResponse.json({
                message: 'Incidente cancelado correctamente',
                incident: cancelledIncident
            });
        }
        catch (error) {
            console.error('Error al cancelar incidente:', error);
            if (error.message === 'Incidente no encontrado') {
                return NextResponse.json({ error: 'Incidente no encontrado' }, { status: 404 });
            }
            return NextResponse.json({ error: error.message || 'Error al cancelar incidente' }, { status: 500 });
        }
    });
}
// Exportar PUT y DELETE con validación
export const PUT = withValidation(UpdateIncidentSchema, updateIncidentHandler);
export const DELETE = withValidation(CancelIncidentSchema, cancelIncidentHandler);
