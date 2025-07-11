// communicationService.ts
// Servicio unificado para el sistema de comunicaciones
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
import { sendNotificationToUser } from '@/lib/communications/websocket-server';
const prisma = getPrisma();
/**
 * Clase de servicio para el sistema de comunicaciones
 */
export class CommunicationService {
    /**
     * NOTIFICACIONES
     */
    /**
     * Envía una notificación a un usuario específico
     */
    notifyUser(userId, notification) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar si el usuario existe
                const user = yield prisma.user.findUnique({
                    where: { id: userId }
                });
                if (!user) {
                    throw new Error(`Usuario con ID ${userId} no encontrado`);
                }
                // Crear registro de notificación en la base de datos
                const dbNotification = yield prisma.notification.create({
                    data: {
                        recipientId: userId,
                        type: notification.type,
                        title: notification.title,
                        message: notification.message,
                        link: notification.link,
                        data: notification.data,
                        sourceType: notification.sourceType,
                        sourceId: notification.sourceId,
                        priority: notification.priority || 'medium',
                        requireConfirmation: notification.requireConfirmation || false,
                        expiresAt: notification.expiresAt,
                        read: false
                    }
                });
                // Enviar notificación en tiempo real
                yield sendNotificationToUser(userId, {
                    id: dbNotification.id,
                    type: notification.type,
                    title: notification.title,
                    message: notification.message,
                    link: notification.link,
                    data: Object.assign(Object.assign({}, notification.data), { notificationId: dbNotification.id, requireConfirmation: notification.requireConfirmation, priority: notification.priority, expiresAt: notification.expiresAt })
                });
                return dbNotification;
            }
            catch (error) {
                console.error('Error al enviar notificación al usuario:', error);
                throw new Error('No se pudo enviar la notificación');
            }
        });
    }
    /**
     * Envía una notificación a múltiples usuarios
     */
    notifyUsers(userIds, notification) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = [];
                for (const userId of userIds) {
                    try {
                        const result = yield this.notifyUser(userId, notification);
                        results.push(result);
                    }
                    catch (error) {
                        console.error(`Error al enviar notificación al usuario ${userId}:`, error);
                    }
                }
                return results;
            }
            catch (error) {
                console.error('Error al enviar notificación a usuarios:', error);
                throw new Error('No se pudo enviar la notificación a algunos usuarios');
            }
        });
    }
    /**
     * Envía una notificación a todos los usuarios con un rol específico
     */
    notifyByRole(role, notification) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Obtener usuarios con el rol especificado
                const users = yield prisma.user.findMany({
                    where: { role },
                    select: { id: true }
                });
                const userIds = users.map(user => user.id);
                return yield this.notifyUsers(userIds, notification);
            }
            catch (error) {
                console.error(`Error al enviar notificación a usuarios con rol ${role}:`, error);
                throw new Error('No se pudo enviar la notificación por rol');
            }
        });
    }
    /**
     * Obtiene las notificaciones de un usuario
     */
    getUserNotifications(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, filters = {}) {
            try {
                const { read, type, sourceType, priority, limit } = filters;
                return yield prisma.notification.findMany(Object.assign({ where: Object.assign(Object.assign(Object.assign(Object.assign({ recipientId: userId }, (read !== undefined && { read })), (type !== undefined && { type })), (sourceType !== undefined && { sourceType })), (priority !== undefined && { priority })), orderBy: {
                        createdAt: 'desc'
                    } }, (limit !== undefined && { take: limit })));
            }
            catch (error) {
                console.error('Error al obtener notificaciones del usuario:', error);
                throw new Error('No se pudieron obtener las notificaciones');
            }
        });
    }
    /**
     * Marca una notificación como leída
     */
    markNotificationAsRead(notificationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar que la notificación pertenezca al usuario
                const notification = yield prisma.notification.findFirst({
                    where: {
                        id: notificationId,
                        recipientId: userId
                    }
                });
                if (!notification) {
                    throw new Error('Notificación no encontrada o no pertenece al usuario');
                }
                // Actualizar estado de lectura
                return yield prisma.notification.update({
                    where: { id: notificationId },
                    data: {
                        read: true,
                        readAt: new Date()
                    }
                });
            }
            catch (error) {
                console.error('Error al marcar notificación como leída:', error);
                // Preservar el mensaje de error original si es uno de nuestros errores controlados
                if (error instanceof Error &&
                    (error.message === 'Notificación no encontrada o no pertenece al usuario')) {
                    throw error;
                }
                throw new Error('No se pudo marcar la notificación como leída');
            }
        });
    }
    /**
     * Marca todas las notificaciones de un usuario como leídas
     */
    markAllNotificationsAsRead(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma.notification.updateMany({
                    where: {
                        recipientId: userId,
                        read: false
                    },
                    data: {
                        read: true,
                        readAt: new Date()
                    }
                });
            }
            catch (error) {
                console.error('Error al marcar todas las notificaciones como leídas:', error);
                throw new Error('No se pudieron marcar las notificaciones como leídas');
            }
        });
    }
    /**
     * Confirma la lectura de una notificación que requiere confirmación
     */
    confirmNotificationReading(notificationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar que la notificación pertenezca al usuario y requiera confirmación
                const notification = yield prisma.notification.findFirst({
                    where: {
                        id: notificationId,
                        recipientId: userId,
                        requireConfirmation: true
                    }
                });
                if (!notification) {
                    throw new Error('Notificación no encontrada, no pertenece al usuario o no requiere confirmación');
                }
                // Registrar confirmación
                yield prisma.notificationConfirmation.create({
                    data: {
                        notificationId,
                        userId
                    }
                });
                // Actualizar estado de lectura
                return yield prisma.notification.update({
                    where: { id: notificationId },
                    data: {
                        read: true,
                        readAt: new Date()
                    }
                });
            }
            catch (error) {
                console.error('Error al confirmar lectura de notificación:', error);
                throw new Error('No se pudo confirmar la lectura de la notificación');
            }
        });
    }
    /**
     * ANUNCIOS
     */
    /**
     * Obtiene todos los anuncios disponibles para un usuario
     */
    getAnnouncements(userId_1, userRole_1) {
        return __awaiter(this, arguments, void 0, function* (userId, userRole, filters = {}) {
            try {
                const { type, read, limit } = filters;
                // Construir consulta base
                const queryOptions = {
                    where: {},
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        createdBy: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        },
                        readBy: {
                            where: {
                                userId
                            },
                            select: {
                                userId: true,
                                readAt: true
                            }
                        },
                        attachments: true
                    }
                };
                // Aplicar filtros
                if (type) {
                    queryOptions.where.type = type;
                }
                if (read === true) {
                    queryOptions.where.readBy = {
                        some: {
                            userId
                        }
                    };
                }
                else if (read === false) {
                    queryOptions.where.readBy = {
                        none: {
                            userId
                        }
                    };
                }
                // Aplicar límite si se especifica
                if (limit && !isNaN(Number(limit))) {
                    queryOptions.take = Number(limit);
                }
                // Obtener anuncios según el rol del usuario
                let announcements;
                if (userRole === 'admin' || userRole === 'super_admin') {
                    // Los administradores ven todos los anuncios
                    announcements = yield prisma.announcement.findMany(queryOptions);
                }
                else {
                    // Los demás usuarios ven anuncios públicos o dirigidos a su rol
                    queryOptions.where.OR = [
                        { visibility: 'public' },
                        { targetRoles: { has: userRole } }
                    ];
                    announcements = yield prisma.announcement.findMany(queryOptions);
                }
                // Formatear respuesta
                return announcements.map(announcement => ({
                    id: announcement.id,
                    title: announcement.title,
                    content: announcement.content,
                    type: announcement.type,
                    createdAt: announcement.createdAt,
                    expiresAt: announcement.expiresAt,
                    createdBy: announcement.createdBy,
                    attachments: announcement.attachments.map(attachment => ({
                        id: attachment.id,
                        name: attachment.name,
                        url: attachment.url,
                        type: attachment.type,
                        size: attachment.size
                    })),
                    readBy: announcement.readBy,
                    requiresConfirmation: announcement.requiresConfirmation,
                    isRead: announcement.readBy.length > 0
                }));
            }
            catch (error) {
                console.error('Error al obtener anuncios:', error);
                throw new Error('No se pudieron obtener los anuncios');
            }
        });
    }
    /**
     * Crea un nuevo anuncio
     */
    createAnnouncement(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Crear anuncio en la base de datos
                const announcement = yield prisma.announcement.create({
                    data: {
                        title: data.title,
                        content: data.content,
                        type: data.type || 'general',
                        visibility: data.visibility || 'public',
                        targetRoles: data.targetRoles || [],
                        requiresConfirmation: data.requiresConfirmation || false,
                        expiresAt: data.expiresAt,
                        createdById: userId
                    }
                });
                // Procesar archivos adjuntos si existen
                if (data.attachments && data.attachments.length > 0) {
                    const attachmentRecords = data.attachments.map(attachment => ({
                        announcementId: announcement.id,
                        name: attachment.name,
                        url: attachment.url,
                        type: attachment.type,
                        size: attachment.size
                    }));
                    yield prisma.announcementAttachment.createMany({
                        data: attachmentRecords
                    });
                }
                // Obtener anuncio completo con relaciones
                const completeAnnouncement = yield prisma.announcement.findUnique({
                    where: { id: announcement.id },
                    include: {
                        createdBy: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        },
                        attachments: true
                    }
                });
                // Notificar a usuarios según visibilidad y roles
                let targetUserIds = [];
                if (completeAnnouncement.visibility === 'public') {
                    // Obtener todos los usuarios
                    const users = yield prisma.user.findMany({
                        select: { id: true }
                    });
                    targetUserIds = users.map(user => user.id);
                }
                else if (completeAnnouncement.visibility === 'role-based' && completeAnnouncement.targetRoles.length > 0) {
                    // Obtener usuarios con los roles especificados
                    const users = yield prisma.user.findMany({
                        where: {
                            role: {
                                in: completeAnnouncement.targetRoles
                            }
                        },
                        select: { id: true }
                    });
                    targetUserIds = users.map(user => user.id);
                }
                // Enviar notificaciones
                if (targetUserIds.length > 0) {
                    yield this.notifyUsers(targetUserIds, {
                        type: completeAnnouncement.type === 'emergency' ? 'error' :
                            completeAnnouncement.type === 'important' ? 'warning' : 'info',
                        title: completeAnnouncement.title,
                        message: `Nuevo anuncio: ${completeAnnouncement.title}`,
                        link: `/announcements/${completeAnnouncement.id}`,
                        sourceType: 'system',
                        sourceId: completeAnnouncement.id,
                        priority: completeAnnouncement.type === 'emergency' ? 'urgent' :
                            completeAnnouncement.type === 'important' ? 'high' : 'medium',
                        requireConfirmation: completeAnnouncement.requiresConfirmation,
                        expiresAt: completeAnnouncement.expiresAt
                    });
                }
                return completeAnnouncement;
            }
            catch (error) {
                console.error('Error al crear anuncio:', error);
                throw new Error('No se pudo crear el anuncio');
            }
        });
    }
    /**
     * Marca un anuncio como leído por un usuario
     */
    markAnnouncementAsRead(announcementId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar si ya está marcado como leído
                const existingRead = yield prisma.announcementRead.findUnique({
                    where: {
                        announcementId_userId: {
                            announcementId,
                            userId
                        }
                    }
                });
                if (existingRead) {
                    return existingRead;
                }
                // Marcar como leído
                return yield prisma.announcementRead.create({
                    data: {
                        announcementId,
                        userId
                    }
                });
            }
            catch (error) {
                console.error('Error al marcar anuncio como leído:', error);
                throw new Error('No se pudo marcar el anuncio como leído');
            }
        });
    }
    /**
     * MENSAJES
     */
    /**
     * Obtiene o crea una conversación entre dos usuarios
     */
    getOrCreateDirectConversation(userId1, userId2) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Buscar conversación existente entre los usuarios
                const existingConversation = yield prisma.conversation.findFirst({
                    where: {
                        type: 'direct',
                        participants: {
                            every: {
                                userId: {
                                    in: [userId1, userId2]
                                }
                            }
                        },
                        AND: [
                            {
                                participants: {
                                    some: {
                                        userId: userId1
                                    }
                                }
                            },
                            {
                                participants: {
                                    some: {
                                        userId: userId2
                                    }
                                }
                            }
                        ]
                    },
                    include: {
                        participants: true
                    }
                });
                if (existingConversation) {
                    return existingConversation;
                }
                // Crear nueva conversación
                const newConversation = yield prisma.conversation.create({
                    data: {
                        type: 'direct',
                        participants: {
                            create: [
                                {
                                    userId: userId1,
                                    role: 'member'
                                },
                                {
                                    userId: userId2,
                                    role: 'member'
                                }
                            ]
                        }
                    },
                    include: {
                        participants: true
                    }
                });
                return newConversation;
            }
            catch (error) {
                console.error('Error al obtener o crear conversación:', error);
                throw new Error('No se pudo obtener o crear la conversación');
            }
        });
    }
    /**
     * Envía un mensaje en una conversación
     */
    sendMessage(conversationId, senderId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar que el remitente pertenece a la conversación
                const participant = yield prisma.conversationParticipant.findFirst({
                    where: {
                        conversationId,
                        userId: senderId
                    }
                });
                if (!participant) {
                    throw new Error('El usuario no pertenece a esta conversación');
                }
                // Crear mensaje
                const message = yield prisma.message.create({
                    data: {
                        conversationId,
                        senderId,
                        content: data.content,
                        status: 'sent'
                    },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        }
                    }
                });
                // Procesar archivos adjuntos si existen
                if (data.attachments && data.attachments.length > 0) {
                    const attachmentRecords = data.attachments.map(attachment => ({
                        messageId: message.id,
                        name: attachment.name,
                        url: attachment.url,
                        type: attachment.type,
                        size: attachment.size
                    }));
                    yield prisma.messageAttachment.createMany({
                        data: attachmentRecords
                    });
                }
                // Actualizar conversación
                yield prisma.conversation.update({
                    where: { id: conversationId },
                    data: { updatedAt: new Date() }
                });
                // Notificar a otros participantes
                const otherParticipants = yield prisma.conversationParticipant.findMany({
                    where: {
                        conversationId,
                        userId: {
                            not: senderId
                        }
                    }
                });
                for (const participant of otherParticipants) {
                    yield this.notifyUser(participant.userId, {
                        type: 'info',
                        title: 'Nuevo mensaje',
                        message: `${message.sender.name}: ${data.content.substring(0, 50)}${data.content.length > 50 ? '...' : ''}`,
                        link: `/messages/${conversationId}`,
                        sourceType: 'message',
                        sourceId: message.id,
                        priority: 'medium'
                    });
                }
                return message;
            }
            catch (error) {
                console.error('Error al enviar mensaje:', error);
                throw new Error('No se pudo enviar el mensaje');
            }
        });
    }
    /**
     * Obtiene los mensajes de una conversación
     */
    getConversationMessages(conversationId_1, userId_1) {
        return __awaiter(this, arguments, void 0, function* (conversationId, userId, options = {}) {
            try {
                // Verificar que el usuario pertenece a la conversación
                const participant = yield prisma.conversationParticipant.findFirst({
                    where: {
                        conversationId,
                        userId
                    }
                });
                if (!participant) {
                    throw new Error('El usuario no pertenece a esta conversación');
                }
                // Construir consulta
                const queryOptions = {
                    where: {
                        conversationId
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        },
                        attachments: true,
                        readBy: {
                            where: {
                                userId
                            }
                        }
                    }
                };
                // Aplicar filtros
                if (options.before) {
                    queryOptions.where.createdAt = {
                        lt: options.before
                    };
                }
                if (options.limit) {
                    queryOptions.take = options.limit;
                }
                // Obtener mensajes
                const messages = yield prisma.message.findMany(queryOptions);
                // Marcar mensajes como entregados si no son del usuario actual
                const messagesToUpdate = messages.filter(m => m.senderId !== userId && m.status === 'sent');
                if (messagesToUpdate.length > 0) {
                    yield prisma.message.updateMany({
                        where: {
                            id: {
                                in: messagesToUpdate.map(m => m.id)
                            }
                        },
                        data: {
                            status: 'delivered'
                        }
                    });
                }
                return messages;
            }
            catch (error) {
                console.error('Error al obtener mensajes de conversación:', error);
                throw new Error('No se pudieron obtener los mensajes');
            }
        });
    }
    /**
     * Marca un mensaje como leído
     */
    markMessageAsRead(messageId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar que el mensaje existe
                const message = yield prisma.message.findUnique({
                    where: { id: messageId },
                    include: {
                        conversation: {
                            include: {
                                participants: {
                                    where: {
                                        userId
                                    }
                                }
                            }
                        }
                    }
                });
                if (!message) {
                    throw new Error('Mensaje no encontrado');
                }
                // Verificar que el usuario pertenece a la conversación
                if (message.conversation.participants.length === 0) {
                    throw new Error('El usuario no pertenece a esta conversación');
                }
                // Verificar si ya está marcado como leído
                const existingRead = yield prisma.messageRead.findUnique({
                    where: {
                        messageId_userId: {
                            messageId,
                            userId
                        }
                    }
                });
                if (existingRead) {
                    return existingRead;
                }
                // Marcar como leído
                const messageRead = yield prisma.messageRead.create({
                    data: {
                        messageId,
                        userId
                    }
                });
                // Actualizar estado del mensaje si todos los participantes lo han leído
                const allParticipants = yield prisma.conversationParticipant.findMany({
                    where: {
                        conversationId: message.conversationId,
                        userId: {
                            not: message.senderId
                        }
                    }
                });
                const allReads = yield prisma.messageRead.findMany({
                    where: {
                        messageId
                    }
                });
                if (allReads.length >= allParticipants.length) {
                    yield prisma.message.update({
                        where: { id: messageId },
                        data: { status: 'read' }
                    });
                }
                return messageRead;
            }
            catch (error) {
                console.error('Error al marcar mensaje como leído:', error);
                throw new Error('No se pudo marcar el mensaje como leído');
            }
        });
    }
    /**
     * EVENTOS COMUNITARIOS
     */
    /**
     * Crea un nuevo evento comunitario
     */
    createEvent(organizerId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Crear evento en la base de datos
                const event = yield prisma.communityEvent.create({
                    data: {
                        title: data.title,
                        description: data.description,
                        location: data.location,
                        startDateTime: data.startDateTime,
                        endDateTime: data.endDateTime,
                        type: data.type || 'general',
                        visibility: data.visibility || 'public',
                        targetRoles: data.targetRoles || [],
                        maxAttendees: data.maxAttendees,
                        organizerId
                    }
                });
                // Procesar archivos adjuntos si existen
                if (data.attachments && data.attachments.length > 0) {
                    const attachmentRecords = data.attachments.map(attachment => ({
                        eventId: event.id,
                        name: attachment.name,
                        url: attachment.url,
                        type: attachment.type,
                        size: attachment.size
                    }));
                    yield prisma.eventAttachment.createMany({
                        data: attachmentRecords
                    });
                }
                // Obtener evento completo con relaciones
                const completeEvent = yield prisma.communityEvent.findUnique({
                    where: { id: event.id },
                    include: {
                        organizer: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        },
                        attachments: true
                    }
                });
                // Notificar a usuarios según visibilidad y roles
                let targetUserIds = [];
                if (completeEvent.visibility === 'public') {
                    // Obtener todos los usuarios
                    const users = yield prisma.user.findMany({
                        select: { id: true }
                    });
                    targetUserIds = users.map(user => user.id);
                }
                else if (completeEvent.visibility === 'role-based' && completeEvent.targetRoles.length > 0) {
                    // Obtener usuarios con los roles especificados
                    const users = yield prisma.user.findMany({
                        where: {
                            role: {
                                in: completeEvent.targetRoles
                            }
                        },
                        select: { id: true }
                    });
                    targetUserIds = users.map(user => user.id);
                }
                // Enviar notificaciones
                if (targetUserIds.length > 0) {
                    yield this.notifyUsers(targetUserIds, {
                        type: 'info',
                        title: 'Nuevo evento',
                        message: `${completeEvent.title} - ${new Date(completeEvent.startDateTime).toLocaleDateString()}`,
                        link: `/events/${completeEvent.id}`,
                        sourceType: 'system',
                        sourceId: completeEvent.id,
                        priority: 'medium'
                    });
                }
                return completeEvent;
            }
            catch (error) {
                console.error('Error al crear evento:', error);
                throw new Error('No se pudo crear el evento');
            }
        });
    }
    /**
     * Obtiene eventos comunitarios
     */
    getEvents(userId_1, userRole_1) {
        return __awaiter(this, arguments, void 0, function* (userId, userRole, filters = {}) {
            try {
                const { type, upcoming, limit, startDate, endDate } = filters;
                // Construir consulta base
                const queryOptions = {
                    where: {},
                    orderBy: {
                        startDateTime: upcoming ? 'asc' : 'desc'
                    },
                    include: {
                        organizer: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        },
                        attendees: {
                            where: {
                                userId
                            }
                        },
                        attachments: true
                    }
                };
                // Aplicar filtros
                if (type) {
                    queryOptions.where.type = type;
                }
                if (upcoming) {
                    queryOptions.where.startDateTime = {
                        gte: new Date()
                    };
                }
                if (startDate) {
                    queryOptions.where.startDateTime = Object.assign(Object.assign({}, queryOptions.where.startDateTime), { gte: startDate });
                }
                if (endDate) {
                    queryOptions.where.endDateTime = {
                        lte: endDate
                    };
                }
                // Aplicar límite si se especifica
                if (limit && !isNaN(Number(limit))) {
                    queryOptions.take = Number(limit);
                }
                // Obtener eventos según el rol del usuario
                let events;
                if (userRole === 'admin' || userRole === 'super_admin') {
                    // Los administradores ven todos los eventos
                    events = yield prisma.communityEvent.findMany(queryOptions);
                }
                else {
                    // Los demás usuarios ven eventos públicos o dirigidos a su rol
                    queryOptions.where.OR = [
                        { visibility: 'public' },
                        { targetRoles: { has: userRole } }
                    ];
                    events = yield prisma.communityEvent.findMany(queryOptions);
                }
                // Formatear respuesta
                return events.map(event => ({
                    id: event.id,
                    title: event.title,
                    description: event.description,
                    location: event.location,
                    startDateTime: event.startDateTime,
                    endDateTime: event.endDateTime,
                    type: event.type,
                    visibility: event.visibility,
                    maxAttendees: event.maxAttendees,
                    organizer: event.organizer,
                    attachments: event.attachments.map(attachment => ({
                        id: attachment.id,
                        name: attachment.name,
                        url: attachment.url,
                        type: attachment.type,
                        size: attachment.size
                    })),
                    userAttendance: event.attendees.length > 0 ? event.attendees[0] : null
                }));
            }
            catch (error) {
                console.error('Error al obtener eventos:', error);
                throw new Error('No se pudieron obtener los eventos');
            }
        });
    }
    /**
     * Registra asistencia a un evento
     */
    registerEventAttendance(eventId, userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar que el evento existe
                const event = yield prisma.communityEvent.findUnique({
                    where: { id: eventId },
                    include: {
                        attendees: {
                            where: {
                                userId
                            }
                        }
                    }
                });
                if (!event) {
                    throw new Error('Evento no encontrado');
                }
                // Verificar límite de asistentes si está confirmando
                if (status === 'confirmed' && event.maxAttendees) {
                    const confirmedCount = yield prisma.eventAttendee.count({
                        where: {
                            eventId,
                            status: 'confirmed'
                        }
                    });
                    if (confirmedCount >= event.maxAttendees && event.attendees.length === 0) {
                        throw new Error('El evento ha alcanzado su capacidad máxima');
                    }
                }
                // Actualizar o crear registro de asistencia
                if (event.attendees.length > 0) {
                    return yield prisma.eventAttendee.update({
                        where: {
                            id: event.attendees[0].id
                        },
                        data: {
                            status
                        }
                    });
                }
                else {
                    return yield prisma.eventAttendee.create({
                        data: {
                            eventId,
                            userId,
                            status
                        }
                    });
                }
            }
            catch (error) {
                console.error('Error al registrar asistencia:', error);
                throw new Error('No se pudo registrar la asistencia');
            }
        });
    }
    /**
     * UTILIDADES
     */
    /**
     * Elimina notificaciones y anuncios expirados
     */
    cleanupExpiredItems() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const now = new Date();
                // Eliminar notificaciones expiradas
                const deletedNotifications = yield prisma.notification.deleteMany({
                    where: {
                        expiresAt: {
                            lt: now
                        }
                    }
                });
                // Marcar anuncios expirados como inactivos
                const updatedAnnouncements = yield prisma.announcement.updateMany({
                    where: {
                        expiresAt: {
                            lt: now
                        }
                    },
                    data: {
                        // No eliminamos anuncios, solo los marcamos como expirados en los datos
                        data: {
                            expired: true
                        }
                    }
                });
                return {
                    deletedNotifications: deletedNotifications.count,
                    updatedAnnouncements: updatedAnnouncements.count
                };
            }
            catch (error) {
                console.error('Error al limpiar elementos expirados:', error);
                throw new Error('No se pudieron limpiar los elementos expirados');
            }
        });
    }
    /**
     * Migra notificaciones del sistema antiguo al nuevo
     */
    migrateReservationNotifications() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Obtener notificaciones de reservas no migradas
                const reservationNotifications = yield prisma.reservationNotification.findMany({
                    where: {
                        // Agregar campo para marcar como migradas
                        migrated: false
                    },
                    include: {
                        reservation: true
                    }
                });
                let migratedCount = 0;
                // Migrar cada notificación
                for (const oldNotification of reservationNotifications) {
                    try {
                        // Determinar tipo de notificación
                        let type = 'info';
                        if (oldNotification.type === 'rejection')
                            type = 'error';
                        if (oldNotification.type === 'cancellation')
                            type = 'warning';
                        // Crear nueva notificación
                        yield prisma.notification.create({
                            data: {
                                recipientId: oldNotification.userId,
                                type,
                                title: 'Notificación de reserva',
                                message: oldNotification.message,
                                sourceType: 'reservation',
                                sourceId: (_a = oldNotification.reservationId) === null || _a === void 0 ? void 0 : _a.toString(),
                                read: oldNotification.isRead || false,
                                readAt: oldNotification.readAt,
                                data: {
                                    reservationId: oldNotification.reservationId,
                                    notificationType: oldNotification.type
                                }
                            }
                        });
                        // Marcar como migrada
                        yield prisma.reservationNotification.update({
                            where: { id: oldNotification.id },
                            data: { migrated: true }
                        });
                        migratedCount++;
                    }
                    catch (error) {
                        console.error(`Error al migrar notificación ${oldNotification.id}:`, error);
                    }
                }
                return { migratedCount };
            }
            catch (error) {
                console.error('Error al migrar notificaciones de reservas:', error);
                throw new Error('No se pudieron migrar las notificaciones');
            }
        });
    }
}
// Exportar instancia del servicio
export default new CommunicationService();
