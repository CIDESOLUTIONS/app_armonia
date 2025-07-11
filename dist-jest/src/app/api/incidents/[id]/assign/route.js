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
 * POST /api/incidents/[id]/assign
 * Asigna un incidente a un responsable
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
            // Verificar permisos de asignación
            const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'COMPLEX_ADMIN';
            const isStaff = session.user.role === 'STAFF';
            // Solo admins o staff pueden asignar incidentes
            if (!isAdmin && !isStaff) {
                return NextResponse.json({ error: 'No autorizado para asignar este incidente' }, { status: 403 });
            }
            // Obtener datos del cuerpo de la solicitud
            const requestData = yield request.json();
            // Sanitizar datos de entrada
            const assignedToId = parseInt(requestData.assignedToId);
            const assignedToName = sanitizeInput(requestData.assignedToName);
            const assignedToRole = sanitizeInput(requestData.assignedToRole);
            const notes = requestData.notes ? sanitizeInput(requestData.notes) : undefined;
            if (isNaN(assignedToId) || !assignedToName || !assignedToRole) {
                return NextResponse.json({ error: 'Datos de asignación incompletos o inválidos' }, { status: 400 });
            }
            // Asignar incidente
            const updatedIncident = yield incidentService.assignIncident(id, {
                assignedToId,
                assignedToName,
                assignedToRole,
                assignedById: session.user.id,
                assignedByName: session.user.name || 'Usuario',
                assignedByRole: session.user.role,
                notes
            });
            // Registrar evento de auditoría
            yield logAuditEvent({
                userId: session.user.id,
                entityType: 'INCIDENT',
                entityId: updatedIncident.id.toString(),
                action: 'INCIDENT_ASSIGNED',
                details: JSON.stringify({
                    assignedToId,
                    assignedToName,
                    title: updatedIncident.title,
                    status: updatedIncident.status
                })
            });
            return NextResponse.json(updatedIncident);
        }
        catch (error) {
            console.error('Error al asignar incidente:', error);
            if (error.message === 'Incidente no encontrado') {
                return NextResponse.json({ error: 'Incidente no encontrado' }, { status: 404 });
            }
            return NextResponse.json({ error: error.message || 'Error al asignar incidente' }, { status: 500 });
        }
    });
}
