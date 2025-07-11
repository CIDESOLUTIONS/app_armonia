var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getPrisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { addDays, differenceInMinutes } from 'date-fns';
// Inicializar cliente Prisma
const prisma = getPrisma();
/**
 * Servicio para la gestión de incidentes
 */
export class IncidentService {
    /**
     * Obtiene todos los incidentes con paginación y filtros opcionales
     */
    getAllIncidents(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10, status, category, priority, search, startDate, endDate, unitNumber, reportedById, assignedToId, isPublic, isEmergency, tags } = params;
            const skip = (page - 1) * limit;
            // Construir filtros
            const where = {};
            if (status) {
                where.status = status;
            }
            if (category) {
                where.category = category;
            }
            if (priority) {
                where.priority = priority;
            }
            if (unitNumber) {
                where.unitNumber = unitNumber;
            }
            if (reportedById) {
                where.reportedById = reportedById;
            }
            if (assignedToId) {
                where.assignedToId = assignedToId;
            }
            if (isPublic !== undefined) {
                where.isPublic = isPublic;
            }
            if (isEmergency !== undefined) {
                where.isEmergency = isEmergency;
            }
            if (tags && tags.length > 0) {
                where.tags = {
                    hasSome: tags
                };
            }
            if (search) {
                where.OR = [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { incidentNumber: { contains: search, mode: 'insensitive' } },
                    { location: { contains: search, mode: 'insensitive' } },
                    { reportedByName: { contains: search, mode: 'insensitive' } },
                    { assignedToName: { contains: search, mode: 'insensitive' } }
                ];
            }
            if (startDate && endDate) {
                where.reportedAt = {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                };
            }
            else if (startDate) {
                where.reportedAt = {
                    gte: new Date(startDate)
                };
            }
            else if (endDate) {
                where.reportedAt = {
                    lte: new Date(endDate)
                };
            }
            // Ejecutar consulta con conteo total
            const [incidents, total] = yield Promise.all([
                prisma.incident.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { reportedAt: 'desc' },
                    include: {
                        statusHistory: {
                            orderBy: { changedAt: 'desc' },
                            take: 1
                        },
                        updates: {
                            orderBy: { timestamp: 'desc' },
                            take: 3
                        },
                        comments: {
                            where: { isInternal: false },
                            orderBy: { timestamp: 'desc' },
                            take: 3
                        }
                    }
                }),
                prisma.incident.count({ where })
            ]);
            return {
                data: incidents,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            };
        });
    }
    /**
     * Obtiene un incidente por su ID
     */
    getIncidentById(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, includeInternal = false) {
            const incident = yield prisma.incident.findUnique({
                where: { id },
                include: {
                    statusHistory: {
                        orderBy: { changedAt: 'desc' }
                    },
                    updates: {
                        orderBy: { timestamp: 'desc' }
                    },
                    comments: {
                        where: includeInternal ? {} : { isInternal: false },
                        orderBy: { timestamp: 'desc' }
                    },
                    notifications: {
                        orderBy: { sentAt: 'desc' },
                        take: 10
                    }
                }
            });
            if (!incident) {
                throw new Error('Incidente no encontrado');
            }
            return incident;
        });
    }
    /**
     * Obtiene un incidente por su número único
     */
    getIncidentByNumber(incidentNumber_1) {
        return __awaiter(this, arguments, void 0, function* (incidentNumber, includeInternal = false) {
            const incident = yield prisma.incident.findFirst({
                where: { incidentNumber },
                include: {
                    statusHistory: {
                        orderBy: { changedAt: 'desc' }
                    },
                    updates: {
                        orderBy: { timestamp: 'desc' }
                    },
                    comments: {
                        where: includeInternal ? {} : { isInternal: false },
                        orderBy: { timestamp: 'desc' }
                    },
                    notifications: {
                        orderBy: { sentAt: 'desc' },
                        take: 10
                    }
                }
            });
            if (!incident) {
                throw new Error('Incidente no encontrado');
            }
            return incident;
        });
    }
    /**
     * Crea un nuevo incidente
     */
    createIncident(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validar datos requeridos
            if (!data.title || !data.description || !data.category || !data.priority || !data.location || !data.reportedById) {
                throw new Error('Faltan campos requeridos');
            }
            // Generar número único de incidente
            const incidentNumber = this.generateIncidentNumber();
            // Obtener configuración de incidentes
            const settings = yield this.getIncidentSettings();
            // Calcular fecha límite según SLA
            const sla = yield this.getApplicableSLA(data.category, data.priority);
            const dueDate = sla ? addDays(new Date(), Math.ceil(sla.resolutionTime / (24 * 60))) : undefined;
            // Crear el incidente
            const incident = yield prisma.incident.create({
                data: {
                    incidentNumber,
                    title: data.title,
                    description: data.description,
                    category: data.category,
                    subcategory: data.subcategory,
                    priority: data.priority,
                    impact: data.impact,
                    location: data.location,
                    unitId: data.unitId,
                    unitNumber: data.unitNumber,
                    area: data.area,
                    reportedAt: new Date(),
                    reportedById: data.reportedById,
                    reportedByName: data.reportedByName,
                    reportedByRole: data.reportedByRole,
                    status: 'REPORTED',
                    isPublic: data.isPublic || false,
                    isEmergency: data.isEmergency || false,
                    requiresFollowUp: data.requiresFollowUp || false,
                    tags: data.tags || [],
                    mainPhotoUrl: data.mainPhotoUrl,
                    attachments: data.attachments,
                    relatedIncidentIds: data.relatedIncidentIds || [],
                    visitorId: data.visitorId,
                    packageId: data.packageId,
                    dueDate,
                    slaId: sla === null || sla === void 0 ? void 0 : sla.id
                }
            });
            // Crear registro en historial de estados
            yield this.createStatusHistoryEntry({
                incidentId: incident.id,
                newStatus: 'REPORTED',
                changedById: data.reportedById,
                changedByName: data.reportedByName,
                changedByRole: data.reportedByRole,
                reason: 'Incidente reportado'
            });
            // Crear actualización inicial
            yield this.createIncidentUpdate({
                incidentId: incident.id,
                content: 'Incidente reportado',
                type: 'creation',
                authorId: data.reportedById,
                authorName: data.reportedByName,
                authorRole: data.reportedByRole,
                isInternal: false
            });
            // Asignación automática si está configurada
            if (settings.autoAssignEnabled) {
                try {
                    yield this.autoAssignIncident(incident.id);
                }
                catch (error) {
                    console.error('Error en asignación automática:', error);
                    // No fallamos la operación completa si falla la asignación automática
                }
            }
            // Notificaciones automáticas
            if (settings.autoNotifyStaff) {
                try {
                    yield this.notifyStaff(incident.id);
                }
                catch (error) {
                    console.error('Error al notificar al personal:', error);
                }
            }
            return incident;
        });
    }
    /**
     * Actualiza la información de un incidente
     */
    updateIncident(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar que el incidente exista
            const incident = yield prisma.incident.findUnique({
                where: { id }
            });
            if (!incident) {
                throw new Error('Incidente no encontrado');
            }
            // Preparar datos para actualización
            const updateData = {};
            if (data.title !== undefined)
                updateData.title = data.title;
            if (data.description !== undefined)
                updateData.description = data.description;
            if (data.category !== undefined)
                updateData.category = data.category;
            if (data.subcategory !== undefined)
                updateData.subcategory = data.subcategory;
            if (data.priority !== undefined)
                updateData.priority = data.priority;
            if (data.impact !== undefined)
                updateData.impact = data.impact;
            if (data.location !== undefined)
                updateData.location = data.location;
            if (data.unitId !== undefined)
                updateData.unitId = data.unitId;
            if (data.unitNumber !== undefined)
                updateData.unitNumber = data.unitNumber;
            if (data.area !== undefined)
                updateData.area = data.area;
            if (data.isPublic !== undefined)
                updateData.isPublic = data.isPublic;
            if (data.isEmergency !== undefined)
                updateData.isEmergency = data.isEmergency;
            if (data.requiresFollowUp !== undefined)
                updateData.requiresFollowUp = data.requiresFollowUp;
            if (data.tags !== undefined)
                updateData.tags = data.tags;
            if (data.mainPhotoUrl !== undefined)
                updateData.mainPhotoUrl = data.mainPhotoUrl;
            if (data.attachments !== undefined)
                updateData.attachments = data.attachments;
            if (data.relatedIncidentIds !== undefined)
                updateData.relatedIncidentIds = data.relatedIncidentIds;
            if (data.visitorId !== undefined)
                updateData.visitorId = data.visitorId;
            if (data.packageId !== undefined)
                updateData.packageId = data.packageId;
            // Si cambia la categoría o prioridad, recalcular SLA
            if (data.category !== undefined || data.priority !== undefined) {
                const category = data.category !== undefined ? data.category : incident.category;
                const priority = data.priority !== undefined ? data.priority : incident.priority;
                const sla = yield this.getApplicableSLA(category, priority);
                if (sla) {
                    updateData.slaId = sla.id;
                    updateData.dueDate = addDays(incident.reportedAt, Math.ceil(sla.resolutionTime / (24 * 60)));
                }
            }
            // Actualizar el incidente
            const updatedIncident = yield prisma.incident.update({
                where: { id },
                data: updateData
            });
            // Crear actualización
            yield this.createIncidentUpdate({
                incidentId: id,
                content: 'Información del incidente actualizada',
                type: 'update',
                authorId: data.updatedById,
                authorName: data.updatedByName,
                authorRole: data.updatedByRole,
                isInternal: false,
                attachments: {
                    updatedFields: Object.keys(updateData)
                }
            });
            return updatedIncident;
        });
    }
    /**
     * Cambia el estado de un incidente
     */
    changeIncidentStatus(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar que el incidente exista
            const incident = yield prisma.incident.findUnique({
                where: { id }
            });
            if (!incident) {
                throw new Error('Incidente no encontrado');
            }
            // Validar transición de estado
            if (!this.isValidStatusTransition(incident.status, data.newStatus)) {
                throw new Error(`Transición de estado inválida: ${incident.status} -> ${data.newStatus}`);
            }
            // Preparar datos para actualización
            const updateData = {
                status: data.newStatus
            };
            // Calcular tiempo en el estado anterior
            const timeInStatus = incident.statusHistory.length > 0
                ? differenceInMinutes(new Date(), incident.statusHistory[0].changedAt)
                : differenceInMinutes(new Date(), incident.reportedAt);
            // Si el estado es ASSIGNED, registrar fecha de asignación
            if (data.newStatus === 'ASSIGNED' && !incident.assignedAt) {
                updateData.assignedAt = new Date();
            }
            // Si el estado es IN_PROGRESS, registrar fecha de inicio
            if (data.newStatus === 'IN_PROGRESS' && !incident.startedAt) {
                updateData.startedAt = new Date();
            }
            // Si el estado es RESOLVED, registrar fecha de resolución y datos adicionales
            if (data.newStatus === 'RESOLVED') {
                updateData.resolvedAt = new Date();
                if (data.resolution)
                    updateData.resolution = data.resolution;
                if (data.rootCause)
                    updateData.rootCause = data.rootCause;
                if (data.preventiveActions)
                    updateData.preventiveActions = data.preventiveActions;
                // Calcular tiempo de resolución si hay SLA
                if (incident.slaId) {
                    updateData.resolutionTime = differenceInMinutes(new Date(), incident.reportedAt);
                    // Verificar si se incumplió el SLA
                    const sla = yield prisma.incidentSLA.findUnique({
                        where: { id: incident.slaId }
                    });
                    if (sla) {
                        updateData.slaBreached = updateData.resolutionTime > sla.resolutionTime;
                    }
                }
            }
            // Si el estado es CLOSED, registrar fecha de cierre
            if (data.newStatus === 'CLOSED') {
                updateData.closedAt = new Date();
            }
            // Actualizar el incidente
            const updatedIncident = yield prisma.incident.update({
                where: { id },
                data: updateData
            });
            // Crear registro en historial de estados
            yield this.createStatusHistoryEntry({
                incidentId: id,
                previousStatus: incident.status,
                newStatus: data.newStatus,
                changedById: data.changedById,
                changedByName: data.changedByName,
                changedByRole: data.changedByRole,
                reason: data.reason,
                timeInStatus
            });
            // Crear actualización
            yield this.createIncidentUpdate({
                incidentId: id,
                content: `Estado cambiado a ${data.newStatus}${data.reason ? `: ${data.reason}` : ''}`,
                type: 'status_change',
                authorId: data.changedById,
                authorName: data.changedByName,
                authorRole: data.changedByRole,
                isInternal: false
            });
            // Notificar cambio de estado
            try {
                yield this.notifyStatusChange(id, data.newStatus);
            }
            catch (error) {
                console.error('Error al notificar cambio de estado:', error);
            }
            return updatedIncident;
        });
    }
    /**
     * Asigna un incidente a un responsable
     */
    assignIncident(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar que el incidente exista
            const incident = yield prisma.incident.findUnique({
                where: { id }
            });
            if (!incident) {
                throw new Error('Incidente no encontrado');
            }
            // Actualizar el incidente
            const updatedIncident = yield prisma.incident.update({
                where: { id },
                data: {
                    assignedToId: data.assignedToId,
                    assignedToName: data.assignedToName,
                    assignedToRole: data.assignedToRole,
                    assignedAt: new Date()
                }
            });
            // Si el estado es REPORTED, cambiarlo a ASSIGNED
            if (incident.status === 'REPORTED') {
                yield this.changeIncidentStatus(id, {
                    newStatus: 'ASSIGNED',
                    changedById: data.assignedById,
                    changedByName: data.assignedByName,
                    changedByRole: data.assignedByRole,
                    reason: `Asignado a ${data.assignedToName}`
                });
            }
            else {
                // Crear actualización
                yield this.createIncidentUpdate({
                    incidentId: id,
                    content: `Incidente asignado a ${data.assignedToName}${data.notes ? `: ${data.notes}` : ''}`,
                    type: 'assignment',
                    authorId: data.assignedById,
                    authorName: data.assignedByName,
                    authorRole: data.assignedByRole,
                    isInternal: false
                });
            }
            // Notificar al asignado
            try {
                yield this.notifyAssignment(id);
            }
            catch (error) {
                console.error('Error al notificar asignación:', error);
            }
            return updatedIncident;
        });
    }
    /**
     * Resuelve un incidente
     */
    resolveIncident(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.changeIncidentStatus(id, {
                newStatus: 'RESOLVED',
                changedById: data.resolvedById,
                changedByName: data.resolvedByName,
                changedByRole: data.resolvedByRole,
                reason: 'Incidente resuelto',
                resolution: data.resolution,
                rootCause: data.rootCause,
                preventiveActions: data.preventiveActions
            });
        });
    }
    /**
     * Cierra un incidente
     */
    closeIncident(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.changeIncidentStatus(id, {
                newStatus: 'CLOSED',
                changedById: data.closedById,
                changedByName: data.closedByName,
                changedByRole: data.closedByRole,
                reason: data.reason || 'Incidente cerrado'
            });
        });
    }
    /**
     * Reabre un incidente
     */
    reopenIncident(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.changeIncidentStatus(id, {
                newStatus: 'REOPENED',
                changedById: data.reopenedById,
                changedByName: data.reopenedByName,
                changedByRole: data.reopenedByRole,
                reason: data.reason
            });
        });
    }
    /**
     * Crea una actualización para un incidente
     */
    createIncidentUpdate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.incidentUpdate.create({
                data: {
                    incidentId: data.incidentId,
                    content: data.content,
                    type: data.type,
                    authorId: data.authorId,
                    authorName: data.authorName,
                    authorRole: data.authorRole,
                    isInternal: data.isInternal || false,
                    attachments: data.attachments
                }
            });
        });
    }
    /**
     * Crea un comentario para un incidente
     */
    createIncidentComment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar que el incidente exista
            const incident = yield prisma.incident.findUnique({
                where: { id: data.incidentId }
            });
            if (!incident) {
                throw new Error('Incidente no encontrado');
            }
            // Si hay parentId, verificar que exista
            if (data.parentId) {
                const parentComment = yield prisma.incidentComment.findUnique({
                    where: { id: data.parentId }
                });
                if (!parentComment) {
                    throw new Error('Comentario padre no encontrado');
                }
            }
            // Crear el comentario
            const comment = yield prisma.incidentComment.create({
                data: {
                    incidentId: data.incidentId,
                    content: data.content,
                    authorId: data.authorId,
                    authorName: data.authorName,
                    authorRole: data.authorRole,
                    isInternal: data.isInternal || false,
                    parentId: data.parentId,
                    attachments: data.attachments
                }
            });
            // Crear actualización
            yield this.createIncidentUpdate({
                incidentId: data.incidentId,
                content: `Nuevo comentario: ${data.content.substring(0, 50)}${data.content.length > 50 ? '...' : ''}`,
                type: 'comment',
                authorId: data.authorId,
                authorName: data.authorName,
                authorRole: data.authorRole,
                isInternal: data.isInternal || false
            });
            // Notificar nuevo comentario si no es interno
            if (!data.isInternal) {
                try {
                    yield this.notifyNewComment(data.incidentId, comment.id);
                }
                catch (error) {
                    console.error('Error al notificar nuevo comentario:', error);
                }
            }
            return comment;
        });
    }
    /**
     * Crea una entrada en el historial de estados
     */
    createStatusHistoryEntry(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.incidentStatusHistory.create({
                data: {
                    incidentId: data.incidentId,
                    previousStatus: data.previousStatus,
                    newStatus: data.newStatus,
                    changedById: data.changedById,
                    changedByName: data.changedByName,
                    changedByRole: data.changedByRole,
                    reason: data.reason,
                    timeInStatus: data.timeInStatus
                }
            });
        });
    }
    /**
     * Notifica al personal sobre un nuevo incidente
     */
    notifyStaff(incidentId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtener datos del incidente
            const incident = yield this.getIncidentById(incidentId, true);
            // Obtener configuración de incidentes
            const settings = yield this.getIncidentSettings();
            // Obtener equipos aplicables según categoría
            const teams = yield prisma.incidentTeam.findMany({
                where: {
                    categories: {
                        has: incident.category
                    },
                    isActive: true
                }
            });
            // Obtener plantilla de notificación
            const template = yield this.getNotificationTemplate('EMAIL', 'incident_created');
            // Notificar a cada miembro del equipo
            for (const team of teams) {
                for (const memberId of team.memberIds) {
                    // Simular envío de notificación (aquí iría la lógica real de envío)
                    const notificationContent = this.generateNotificationContent(template, incident);
                    // Registrar notificación
                    yield prisma.incidentNotification.create({
                        data: {
                            incidentId,
                            type: 'EMAIL',
                            recipient: `staff_${memberId}@example.com`, // Simulado
                            recipientId: memberId,
                            recipientRole: 'STAFF',
                            subject: `Nuevo incidente: ${incident.title}`,
                            content: notificationContent,
                            status: 'sent'
                        }
                    });
                }
            }
            return true;
        });
    }
    /**
     * Notifica sobre un cambio de estado
     */
    notifyStatusChange(incidentId, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtener datos del incidente
            const incident = yield this.getIncidentById(incidentId, true);
            // Obtener configuración de incidentes
            const settings = yield this.getIncidentSettings();
            // Obtener plantilla de notificación
            const template = yield this.getNotificationTemplate('EMAIL', `incident_${newStatus.toLowerCase()}`);
            // Notificar al reportante
            const notificationContent = this.generateNotificationContent(template, incident);
            // Registrar notificación
            yield prisma.incidentNotification.create({
                data: {
                    incidentId,
                    type: 'EMAIL',
                    recipient: `resident_${incident.reportedById}@example.com`, // Simulado
                    recipientId: incident.reportedById,
                    recipientRole: incident.reportedByRole,
                    subject: `Actualización de incidente: ${incident.title}`,
                    content: notificationContent,
                    status: 'sent'
                }
            });
            // Si hay asignado, notificar también
            if (incident.assignedToId) {
                yield prisma.incidentNotification.create({
                    data: {
                        incidentId,
                        type: 'EMAIL',
                        recipient: `staff_${incident.assignedToId}@example.com`, // Simulado
                        recipientId: incident.assignedToId,
                        recipientRole: incident.assignedToRole || 'STAFF',
                        subject: `Actualización de incidente: ${incident.title}`,
                        content: notificationContent,
                        status: 'sent'
                    }
                });
            }
            return true;
        });
    }
    /**
     * Notifica sobre una asignación
     */
    notifyAssignment(incidentId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtener datos del incidente
            const incident = yield this.getIncidentById(incidentId, true);
            if (!incident.assignedToId) {
                throw new Error('Incidente no tiene asignado');
            }
            // Obtener plantilla de notificación
            const template = yield this.getNotificationTemplate('EMAIL', 'incident_assigned');
            // Notificar al asignado
            const notificationContent = this.generateNotificationContent(template, incident);
            // Registrar notificación
            yield prisma.incidentNotification.create({
                data: {
                    incidentId,
                    type: 'EMAIL',
                    recipient: `staff_${incident.assignedToId}@example.com`, // Simulado
                    recipientId: incident.assignedToId,
                    recipientRole: incident.assignedToRole || 'STAFF',
                    subject: `Incidente asignado: ${incident.title}`,
                    content: notificationContent,
                    status: 'sent'
                }
            });
            return true;
        });
    }
    /**
     * Notifica sobre un nuevo comentario
     */
    notifyNewComment(incidentId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtener datos del incidente
            const incident = yield this.getIncidentById(incidentId, true);
            // Obtener datos del comentario
            const comment = yield prisma.incidentComment.findUnique({
                where: { id: commentId }
            });
            if (!comment) {
                throw new Error('Comentario no encontrado');
            }
            // Obtener plantilla de notificación
            const template = yield this.getNotificationTemplate('EMAIL', 'incident_comment');
            // Determinar destinatarios
            const recipients = [];
            // Siempre notificar al reportante (si no es el autor del comentario)
            if (incident.reportedById !== comment.authorId) {
                recipients.push({
                    id: incident.reportedById,
                    role: incident.reportedByRole,
                    email: `resident_${incident.reportedById}@example.com` // Simulado
                });
            }
            // Si hay asignado, notificar también (si no es el autor del comentario)
            if (incident.assignedToId && incident.assignedToId !== comment.authorId) {
                recipients.push({
                    id: incident.assignedToId,
                    role: incident.assignedToRole || 'STAFF',
                    email: `staff_${incident.assignedToId}@example.com` // Simulado
                });
            }
            // Notificar a cada destinatario
            for (const recipient of recipients) {
                // Generar contenido personalizado
                const notificationContent = this.generateNotificationContent(template, incident, {
                    commentAuthor: comment.authorName,
                    commentContent: comment.content
                });
                // Registrar notificación
                yield prisma.incidentNotification.create({
                    data: {
                        incidentId,
                        type: 'EMAIL',
                        recipient: recipient.email,
                        recipientId: recipient.id,
                        recipientRole: recipient.role,
                        subject: `Nuevo comentario en incidente: ${incident.title}`,
                        content: notificationContent,
                        status: 'sent'
                    }
                });
            }
            return true;
        });
    }
    /**
     * Asigna automáticamente un incidente según reglas
     */
    autoAssignIncident(incidentId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtener datos del incidente
            const incident = yield this.getIncidentById(incidentId, true);
            // Obtener equipos aplicables según categoría
            const teams = yield prisma.incidentTeam.findMany({
                where: {
                    categories: {
                        has: incident.category
                    },
                    isActive: true
                }
            });
            if (teams.length === 0) {
                throw new Error('No hay equipos disponibles para esta categoría');
            }
            // Seleccionar equipo (por ahora el primero)
            const team = teams[0];
            if (team.memberIds.length === 0) {
                throw new Error('El equipo no tiene miembros');
            }
            // Seleccionar miembro con menos incidentes asignados
            const memberCounts = yield Promise.all(team.memberIds.map((memberId) => __awaiter(this, void 0, void 0, function* () {
                const count = yield prisma.incident.count({
                    where: {
                        assignedToId: memberId,
                        status: {
                            in: ['ASSIGNED', 'IN_PROGRESS', 'ON_HOLD']
                        }
                    }
                });
                return { memberId, count };
            })));
            // Ordenar por cantidad de incidentes
            memberCounts.sort((a, b) => a.count - b.count);
            // Seleccionar el miembro con menos incidentes
            const selectedMember = memberCounts[0];
            // Obtener datos del miembro (simulado)
            const memberName = `Staff ${selectedMember.memberId}`;
            const memberRole = 'STAFF';
            // Asignar el incidente
            yield this.assignIncident(incidentId, {
                assignedToId: selectedMember.memberId,
                assignedToName: memberName,
                assignedToRole: memberRole,
                assignedById: 0, // Sistema
                assignedByName: 'Sistema',
                assignedByRole: 'SYSTEM',
                notes: 'Asignación automática'
            });
            return true;
        });
    }
    /**
     * Obtiene estadísticas de incidentes
     */
    getIncidentStats(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const { startDate, endDate } = params;
            // Construir filtros de fecha
            const dateFilter = {};
            if (startDate && endDate) {
                dateFilter.reportedAt = {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                };
            }
            else if (startDate) {
                dateFilter.reportedAt = {
                    gte: new Date(startDate)
                };
            }
            else if (endDate) {
                dateFilter.reportedAt = {
                    lte: new Date(endDate)
                };
            }
            // Obtener estadísticas
            const [totalIncidents, openIncidents, resolvedIncidents, closedIncidents, todayCount, incidentsByCategory, incidentsByStatus, incidentsByPriority, avgResolutionTime, slaBreachedCount] = yield Promise.all([
                prisma.incident.count({ where: dateFilter }),
                prisma.incident.count({ where: Object.assign(Object.assign({}, dateFilter), { status: { in: ['REPORTED', 'ASSIGNED', 'IN_PROGRESS', 'ON_HOLD', 'REOPENED'] } }) }),
                prisma.incident.count({ where: Object.assign(Object.assign({}, dateFilter), { status: 'RESOLVED' }) }),
                prisma.incident.count({ where: Object.assign(Object.assign({}, dateFilter), { status: 'CLOSED' }) }),
                prisma.incident.count({
                    where: {
                        reportedAt: {
                            gte: new Date(new Date().setHours(0, 0, 0, 0))
                        }
                    }
                }),
                prisma.$queryRaw `
        SELECT "category", COUNT(*) as count
        FROM "tenant"."Incident"
        WHERE ${dateFilter.reportedAt ? `"reportedAt" >= '${dateFilter.reportedAt.gte.toISOString()}'::timestamp 
              AND "reportedAt" <= '${((_a = dateFilter.reportedAt.lte) === null || _a === void 0 ? void 0 : _a.toISOString()) || new Date().toISOString()}'::timestamp` : '1=1'}
        GROUP BY "category"
      `,
                prisma.$queryRaw `
        SELECT "status", COUNT(*) as count
        FROM "tenant"."Incident"
        WHERE ${dateFilter.reportedAt ? `"reportedAt" >= '${dateFilter.reportedAt.gte.toISOString()}'::timestamp 
              AND "reportedAt" <= '${((_b = dateFilter.reportedAt.lte) === null || _b === void 0 ? void 0 : _b.toISOString()) || new Date().toISOString()}'::timestamp` : '1=1'}
        GROUP BY "status"
      `,
                prisma.$queryRaw `
        SELECT "priority", COUNT(*) as count
        FROM "tenant"."Incident"
        WHERE ${dateFilter.reportedAt ? `"reportedAt" >= '${dateFilter.reportedAt.gte.toISOString()}'::timestamp 
              AND "reportedAt" <= '${((_c = dateFilter.reportedAt.lte) === null || _c === void 0 ? void 0 : _c.toISOString()) || new Date().toISOString()}'::timestamp` : '1=1'}
        GROUP BY "priority"
      `,
                prisma.$queryRaw `
        SELECT AVG("resolutionTime") as avg_time
        FROM "tenant"."Incident"
        WHERE "resolutionTime" IS NOT NULL
        AND ${dateFilter.reportedAt ? `"reportedAt" >= '${dateFilter.reportedAt.gte.toISOString()}'::timestamp 
            AND "reportedAt" <= '${((_d = dateFilter.reportedAt.lte) === null || _d === void 0 ? void 0 : _d.toISOString()) || new Date().toISOString()}'::timestamp` : '1=1'}
      `,
                prisma.incident.count({ where: Object.assign(Object.assign({}, dateFilter), { slaBreached: true }) })
            ]);
            return {
                totalIncidents,
                openIncidents,
                resolvedIncidents,
                closedIncidents,
                todayCount,
                incidentsByCategory,
                incidentsByStatus,
                incidentsByPriority,
                avgResolutionTime: ((_e = avgResolutionTime[0]) === null || _e === void 0 ? void 0 : _e.avg_time) || 0,
                slaBreachedCount
            };
        });
    }
    /**
     * Obtiene la configuración de incidentes
     */
    getIncidentSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            // Buscar configuración existente
            let settings = yield prisma.incidentSettings.findFirst();
            // Si no existe, crear configuración por defecto
            if (!settings) {
                settings = yield prisma.incidentSettings.create({
                    data: {
                        autoAssignEnabled: false,
                        autoNotifyResident: true,
                        autoNotifyStaff: true,
                        notificationMethods: ['EMAIL'],
                        requirePhoto: false,
                        allowAnonymousReports: false,
                        publicIncidentsEnabled: true,
                        residentCanClose: false
                    }
                });
            }
            return settings;
        });
    }
    /**
     * Actualiza la configuración de incidentes
     */
    updateIncidentSettings(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtener configuración actual
            const currentSettings = yield this.getIncidentSettings();
            // Actualizar configuración
            return prisma.incidentSettings.update({
                where: { id: currentSettings.id },
                data
            });
        });
    }
    /**
     * Obtiene una plantilla de notificación
     */
    getNotificationTemplate(type, eventType) {
        return __awaiter(this, void 0, void 0, function* () {
            // Buscar plantilla por defecto para el tipo y evento especificados
            let template = yield prisma.incidentNotificationTemplate.findFirst({
                where: {
                    type: type,
                    eventType,
                    isDefault: true,
                    isActive: true
                }
            });
            // Si no existe, crear plantilla por defecto
            if (!template) {
                let subject = 'Notificación de incidente';
                let templateContent = 'Incidente {{incidentNumber}}: {{title}}';
                switch (eventType) {
                    case 'incident_created':
                        subject = 'Nuevo incidente reportado';
                        templateContent = 'Se ha reportado un nuevo incidente {{incidentNumber}}: {{title}}. Categoría: {{category}}, Prioridad: {{priority}}.';
                        break;
                    case 'incident_assigned':
                        subject = 'Incidente asignado';
                        templateContent = 'Se le ha asignado el incidente {{incidentNumber}}: {{title}}. Por favor, revise los detalles y comience a trabajar en él.';
                        break;
                    case 'incident_in_progress':
                        subject = 'Incidente en progreso';
                        templateContent = 'El incidente {{incidentNumber}}: {{title}} está siendo atendido.';
                        break;
                    case 'incident_resolved':
                        subject = 'Incidente resuelto';
                        templateContent = 'El incidente {{incidentNumber}}: {{title}} ha sido resuelto. Resolución: {{resolution}}.';
                        break;
                    case 'incident_closed':
                        subject = 'Incidente cerrado';
                        templateContent = 'El incidente {{incidentNumber}}: {{title}} ha sido cerrado.';
                        break;
                    case 'incident_comment':
                        subject = 'Nuevo comentario en incidente';
                        templateContent = '{{commentAuthor}} ha comentado en el incidente {{incidentNumber}}: {{title}}. Comentario: {{commentContent}}.';
                        break;
                }
                template = yield prisma.incidentNotificationTemplate.create({
                    data: {
                        name: `Plantilla por defecto (${type} - ${eventType})`,
                        type: type,
                        eventType,
                        subject,
                        template: templateContent,
                        isDefault: true,
                        isActive: true
                    }
                });
            }
            return template;
        });
    }
    /**
     * Obtiene el SLA aplicable para una categoría y prioridad
     */
    getApplicableSLA(category, priority) {
        return __awaiter(this, void 0, void 0, function* () {
            // Buscar SLA específico para categoría y prioridad
            let sla = yield prisma.incidentSLA.findFirst({
                where: {
                    category,
                    priority,
                    isActive: true
                }
            });
            // Si no existe, buscar SLA para la categoría (cualquier prioridad)
            if (!sla) {
                sla = yield prisma.incidentSLA.findFirst({
                    where: {
                        category,
                        priority: null,
                        isActive: true
                    }
                });
            }
            // Si no existe, buscar SLA para la prioridad (cualquier categoría)
            if (!sla) {
                sla = yield prisma.incidentSLA.findFirst({
                    where: {
                        category: null,
                        priority,
                        isActive: true
                    }
                });
            }
            // Si no existe, buscar SLA por defecto
            if (!sla) {
                sla = yield prisma.incidentSLA.findFirst({
                    where: {
                        category: null,
                        priority: null,
                        isActive: true
                    }
                });
            }
            // Si no existe ningún SLA, crear uno por defecto
            if (!sla) {
                sla = yield prisma.incidentSLA.create({
                    data: {
                        name: 'SLA por defecto',
                        responseTime: 60, // 1 hora
                        resolutionTime: 1440, // 24 horas
                        businessHoursOnly: true,
                        isActive: true
                    }
                });
            }
            return sla;
        });
    }
    /**
     * Genera un número único de incidente
     */
    generateIncidentNumber() {
        // Formato: INC-YYYYMMDD-XXXX (donde XXXX son caracteres alfanuméricos aleatorios)
        const date = new Date();
        const dateStr = date.getFullYear().toString() +
            (date.getMonth() + 1).toString().padStart(2, '0') +
            date.getDate().toString().padStart(2, '0');
        const randomStr = uuidv4().substring(0, 4).toUpperCase();
        return `INC-${dateStr}-${randomStr}`;
    }
    /**
     * Genera el contenido de una notificación
     */
    generateNotificationContent(template, incident, extraData = {}) {
        let content = template.template;
        // Reemplazar variables en la plantilla
        content = content.replace(/{{incidentNumber}}/g, incident.incidentNumber);
        content = content.replace(/{{title}}/g, incident.title);
        content = content.replace(/{{category}}/g, incident.category);
        content = content.replace(/{{priority}}/g, incident.priority);
        content = content.replace(/{{location}}/g, incident.location);
        content = content.replace(/{{reportedAt}}/g, incident.reportedAt.toLocaleString());
        content = content.replace(/{{reportedBy}}/g, incident.reportedByName);
        if (incident.assignedToName) {
            content = content.replace(/{{assignedTo}}/g, incident.assignedToName);
        }
        if (incident.resolution) {
            content = content.replace(/{{resolution}}/g, incident.resolution);
        }
        // Reemplazar variables adicionales
        for (const [key, value] of Object.entries(extraData)) {
            content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
        }
        return content;
    }
    /**
     * Valida si una transición de estado es válida
     */
    isValidStatusTransition(currentStatus, newStatus) {
        var _a;
        // Definir transiciones válidas
        const validTransitions = {
            'REPORTED': ['ASSIGNED', 'IN_PROGRESS', 'CANCELLED'],
            'ASSIGNED': ['IN_PROGRESS', 'ON_HOLD', 'CANCELLED'],
            'IN_PROGRESS': ['ON_HOLD', 'RESOLVED', 'CANCELLED'],
            'ON_HOLD': ['IN_PROGRESS', 'RESOLVED', 'CANCELLED'],
            'RESOLVED': ['CLOSED', 'REOPENED'],
            'CLOSED': ['REOPENED'],
            'CANCELLED': ['REOPENED'],
            'REOPENED': ['ASSIGNED', 'IN_PROGRESS', 'ON_HOLD']
        };
        // Verificar si la transición es válida
        return ((_a = validTransitions[currentStatus]) === null || _a === void 0 ? void 0 : _a.includes(newStatus)) || false;
    }
}
// Exportar una instancia del servicio
export const incidentService = new IncidentService();
