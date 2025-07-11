/**
 * Servicio de Citofonía Virtual
 *
 * Este servicio implementa la funcionalidad de citofonía virtual con integraciones
 * a WhatsApp y Telegram para notificaciones de visitantes y control de accesos.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { prisma } from '../prisma';
import { ActivityLogger } from '../logging/activity-logger';
import { NotificationChannel, NotificationStatus, ResponseType, VisitStatus } from '@prisma/client';
export class IntercomService {
    constructor() {
        this.adapters = new Map();
        this.messageQueue = [];
        this.isProcessingQueue = false;
        this.prisma = prisma;
        this.logger = new ActivityLogger();
        this.initializeAdapters();
        // Iniciar procesamiento de cola cada 5 segundos
        setInterval(() => this.processMessageQueue(), 5000);
    }
    /**
     * Inicializa los adaptadores de mensajería según la configuración
     */
    initializeAdapters() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Obtener configuración de la base de datos
                const settings = yield this.prisma.intercomSettings.findFirst();
                if (!settings) {
                    console.error('No se encontró configuración para el servicio de citofonía');
                    return;
                }
                // Inicializar adaptador de WhatsApp si está habilitado
                if (settings.whatsappEnabled && settings.whatsappConfig) {
                    const config = settings.whatsappConfig;
                    this.adapters.set(NotificationChannel.WHATSAPP, new WhatsAppAdapter(config));
                }
                // Inicializar adaptador de Telegram si está habilitado
                if (settings.telegramEnabled && settings.telegramBotToken) {
                    const config = { botToken: settings.telegramBotToken };
                    this.adapters.set(NotificationChannel.TELEGRAM, new TelegramAdapter(config));
                }
                console.log('Adaptadores de mensajería inicializados correctamente');
            }
            catch (error) {
                console.error('Error al inicializar adaptadores:', error);
            }
        });
    }
    /**
     * Registra una nueva visita en el sistema
     */
    registerVisit(visitorData, unitId, purpose) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, identification, phone, typeId } = visitorData;
            try {
                // Transacción para asegurar consistencia
                return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    // Buscar si el visitante ya existe
                    let visitor = yield tx.visitor.findFirst({
                        where: {
                            identification: identification
                        }
                    });
                    // Si no existe, crearlo
                    if (!visitor) {
                        visitor = yield tx.visitor.create({
                            data: {
                                name,
                                identification,
                                phone,
                                typeId,
                                isFrequent: false
                            }
                        });
                    }
                    // Crear la visita
                    const visit = yield tx.visit.create({
                        data: {
                            visitorId: visitor.id,
                            unitId,
                            purpose,
                            status: VisitStatus.PENDING
                        }
                    });
                    // Registrar actividad
                    yield this.logger.logActivity({
                        module: 'intercom',
                        action: 'register_visit',
                        entityId: visit.id,
                        details: { visitor: visitor.name, unit: unitId, purpose }
                    });
                    // Notificar a los residentes
                    yield this.notifyResidents(visit.id, tx);
                    return visit;
                }));
            }
            catch (error) {
                console.error('Error al registrar visita:', error);
                throw error;
            }
        });
    }
    /**
     * Notifica a los residentes sobre una visita
     */
    notifyResidents(visitId, prismaClient) {
        return __awaiter(this, void 0, void 0, function* () {
            const tx = prismaClient || this.prisma;
            try {
                // Obtener información de la visita
                const visit = yield tx.visit.findUnique({
                    where: { id: visitId },
                    include: {
                        visitor: {
                            include: { type: true }
                        },
                        unit: true
                    }
                });
                if (!visit) {
                    throw new Error(`Visita con ID ${visitId} no encontrada`);
                }
                // Obtener residentes de la unidad
                const unit = yield tx.unit.findUnique({
                    where: { id: visit.unitId }
                });
                if (!unit || !unit.residents || unit.residents.length === 0) {
                    console.warn(`No se encontraron residentes para la unidad ${visit.unitId}`);
                    return;
                }
                // Obtener preferencias de citofonía de los residentes
                for (const residentId of unit.residents) {
                    const preferences = yield tx.userIntercomPreference.findUnique({
                        where: { userId: residentId }
                    });
                    // Si no hay preferencias o el tipo de visitante está en la lista de auto-aprobación
                    if (!preferences)
                        continue;
                    // Verificar si el tipo de visitante requiere notificación
                    if (!preferences.notifyAllVisitors &&
                        preferences.allowedVisitorTypes.includes(visit.visitor.typeId)) {
                        continue;
                    }
                    // Verificar si estamos en horas de silencio
                    if (this.isQuietHours(preferences)) {
                        continue;
                    }
                    // Verificar si el tipo de visitante tiene aprobación automática
                    if (preferences.autoApproveTypes.includes(visit.visitor.typeId)) {
                        yield this.approveVisit(visitId, residentId);
                        continue;
                    }
                    // Enviar notificaciones según preferencias
                    if (preferences.whatsappEnabled && preferences.whatsappNumber) {
                        yield this.queueNotification({
                            visitId,
                            userId: residentId,
                            channel: NotificationChannel.WHATSAPP,
                            to: preferences.whatsappNumber,
                            visitor: visit.visitor,
                            unit: visit.unit,
                            purpose: visit.purpose
                        });
                    }
                    if (preferences.telegramEnabled && preferences.telegramChatId) {
                        yield this.queueNotification({
                            visitId,
                            userId: residentId,
                            channel: NotificationChannel.TELEGRAM,
                            to: preferences.telegramChatId,
                            visitor: visit.visitor,
                            unit: visit.unit,
                            purpose: visit.purpose
                        });
                    }
                }
                // Actualizar estado de la visita
                yield tx.visit.update({
                    where: { id: visitId },
                    data: { status: VisitStatus.NOTIFIED }
                });
            }
            catch (error) {
                console.error('Error al notificar residentes:', error);
                throw error;
            }
        });
    }
    /**
     * Verifica si estamos en horas de silencio para un usuario
     */
    isQuietHours(preferences) {
        if (!preferences.quietHoursStart || !preferences.quietHoursEnd) {
            return false;
        }
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const [startHour, startMinute] = preferences.quietHoursStart.split(':').map(Number);
        const [endHour, endMinute] = preferences.quietHoursEnd.split(':').map(Number);
        const currentTime = currentHour * 60 + currentMinute;
        const startTime = startHour * 60 + startMinute;
        const endTime = endHour * 60 + endMinute;
        // Manejar caso donde el período cruza la medianoche
        if (startTime > endTime) {
            return currentTime >= startTime || currentTime < endTime;
        }
        else {
            return currentTime >= startTime && currentTime < endTime;
        }
    }
    /**
     * Encola una notificación para ser enviada
     */
    queueNotification(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Crear registro de notificación en la base de datos
                const notification = yield this.prisma.virtualIntercomNotification.create({
                    data: {
                        visitId: data.visitId,
                        userId: data.userId,
                        channel: data.channel,
                        status: NotificationStatus.PENDING
                    }
                });
                // Agregar a la cola de mensajes
                this.messageQueue.push({
                    notificationId: notification.id,
                    to: data.to,
                    channel: data.channel,
                    visitor: data.visitor,
                    unit: data.unit,
                    purpose: data.purpose
                });
                // Registrar actividad
                yield this.logger.logActivity({
                    module: 'intercom',
                    action: 'queue_notification',
                    entityId: notification.id,
                    details: { channel: data.channel, userId: data.userId }
                });
            }
            catch (error) {
                console.error('Error al encolar notificación:', error);
            }
        });
    }
    /**
     * Procesa la cola de mensajes pendientes
     */
    processMessageQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isProcessingQueue || this.messageQueue.length === 0) {
                return;
            }
            this.isProcessingQueue = true;
            try {
                // Obtener plantillas de mensajes
                const settings = yield this.prisma.intercomSettings.findFirst();
                const templates = (settings === null || settings === void 0 ? void 0 : settings.messageTemplates) || {};
                // Procesar mensajes en cola
                while (this.messageQueue.length > 0) {
                    const message = this.messageQueue.shift();
                    // Obtener adaptador para el canal
                    const adapter = this.adapters.get(message.channel);
                    if (!adapter) {
                        console.error(`No hay adaptador configurado para el canal ${message.channel}`);
                        continue;
                    }
                    // Preparar mensaje según el canal
                    const messageText = this.prepareMessage(message, templates);
                    // Preparar opciones según el canal
                    const options = {};
                    if (message.channel === NotificationChannel.TELEGRAM) {
                        options.buttons = [
                            { text: '✅ Aprobar', payload: `approve_${message.notificationId}` },
                            { text: '❌ Rechazar', payload: `reject_${message.notificationId}` }
                        ];
                    }
                    if (message.visitor.photo) {
                        options.mediaUrl = message.visitor.photo;
                    }
                    // Enviar mensaje
                    const result = yield adapter.sendMessage(message.to, messageText, options);
                    // Actualizar estado de la notificación
                    yield this.prisma.virtualIntercomNotification.update({
                        where: { id: message.notificationId },
                        data: {
                            status: result.success ? NotificationStatus.SENT : NotificationStatus.FAILED,
                            messageId: result.messageId,
                            errorMessage: result.error
                        }
                    });
                    // Registrar actividad
                    yield this.logger.logActivity({
                        module: 'intercom',
                        action: result.success ? 'notification_sent' : 'notification_failed',
                        entityId: message.notificationId,
                        details: { channel: message.channel, success: result.success }
                    });
                }
            }
            catch (error) {
                console.error('Error al procesar cola de mensajes:', error);
            }
            finally {
                this.isProcessingQueue = false;
            }
        });
    }
    /**
     * Prepara el mensaje según la plantilla y los datos
     */
    prepareMessage(data, templates) {
        var _a;
        const { visitor, unit, purpose } = data;
        const channel = data.channel;
        // Obtener plantilla según el canal
        let template = ((_a = templates[channel]) === null || _a === void 0 ? void 0 : _a.visitor_notification) ||
            '¡Hola! Tienes un visitante: {{visitor.name}} para {{unit.number}}. Motivo: {{purpose}}';
        // Reemplazar variables en la plantilla
        return template
            .replace(/{{visitor\.name}}/g, visitor.name)
            .replace(/{{visitor\.type}}/g, visitor.type.name)
            .replace(/{{unit\.number}}/g, unit.number)
            .replace(/{{purpose}}/g, purpose);
    }
    /**
     * Procesa un webhook recibido de un proveedor de mensajería
     */
    processWebhook(channel, payload, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Obtener adaptador para el canal
                const adapter = this.adapters.get(channel);
                if (!adapter) {
                    throw new Error(`No hay adaptador configurado para el canal ${channel}`);
                }
                // Verificar autenticidad del webhook
                if (!adapter.verifyWebhook(payload, signature)) {
                    throw new Error('Verificación de webhook fallida');
                }
                // Parsear respuesta
                const event = adapter.parseResponse(payload);
                // Procesar según el tipo de evento
                if (event.type === 'button' && event.buttonPayload) {
                    // Es una respuesta de botón (Telegram)
                    const [action, notificationId] = event.buttonPayload.split('_');
                    if (action === 'approve') {
                        yield this.processApproval(notificationId);
                    }
                    else if (action === 'reject') {
                        yield this.processRejection(notificationId);
                    }
                }
                else if (event.type === 'text') {
                    // Es un mensaje de texto (WhatsApp o Telegram)
                    // Buscar notificación pendiente para este remitente
                    const notification = yield this.findPendingNotification(channel, event.from);
                    if (notification) {
                        // Procesar respuesta según el texto
                        const text = event.text.toLowerCase().trim();
                        if (text.includes('si') || text.includes('sí') || text.includes('aprobar') ||
                            text.includes('aceptar') || text === '1') {
                            yield this.processApproval(notification.id);
                        }
                        else if (text.includes('no') || text.includes('rechazar') ||
                            text.includes('denegar') || text === '2') {
                            yield this.processRejection(notification.id);
                        }
                        else {
                            // Respuesta no reconocida, guardar como personalizada
                            yield this.processCustomResponse(notification.id, event.text);
                        }
                    }
                }
                return { success: true };
            }
            catch (error) {
                console.error('Error al procesar webhook:', error);
                return { success: false, error: error.message };
            }
        });
    }
    /**
     * Busca una notificación pendiente para un remitente
     */
    findPendingNotification(channel, from) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Buscar usuario por número de WhatsApp o chat ID de Telegram
                const userPreference = yield this.prisma.userIntercomPreference.findFirst({
                    where: channel === NotificationChannel.WHATSAPP
                        ? { whatsappNumber: from }
                        : { telegramChatId: from }
                });
                if (!userPreference)
                    return null;
                // Buscar notificación pendiente para este usuario
                const notification = yield this.prisma.virtualIntercomNotification.findFirst({
                    where: {
                        userId: userPreference.userId,
                        channel,
                        status: {
                            in: [NotificationStatus.SENT, NotificationStatus.DELIVERED, NotificationStatus.READ]
                        }
                    },
                    orderBy: {
                        sentAt: 'desc'
                    },
                    include: {
                        visit: true
                    }
                });
                return notification;
            }
            catch (error) {
                console.error('Error al buscar notificación pendiente:', error);
                return null;
            }
        });
    }
    /**
     * Procesa una aprobación de visita
     */
    processApproval(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Obtener notificación
                const notification = yield this.prisma.virtualIntercomNotification.findUnique({
                    where: { id: notificationId },
                    include: { visit: true }
                });
                if (!notification) {
                    throw new Error(`Notificación con ID ${notificationId} no encontrada`);
                }
                // Actualizar notificación
                yield this.prisma.virtualIntercomNotification.update({
                    where: { id: notificationId },
                    data: {
                        status: NotificationStatus.RESPONDED,
                        respondedAt: new Date(),
                        response: 'Aprobado',
                        responseType: ResponseType.APPROVE
                    }
                });
                // Aprobar visita
                yield this.approveVisit(notification.visitId, notification.userId);
            }
            catch (error) {
                console.error('Error al procesar aprobación:', error);
            }
        });
    }
    /**
     * Procesa un rechazo de visita
     */
    processRejection(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Obtener notificación
                const notification = yield this.prisma.virtualIntercomNotification.findUnique({
                    where: { id: notificationId },
                    include: { visit: true }
                });
                if (!notification) {
                    throw new Error(`Notificación con ID ${notificationId} no encontrada`);
                }
                // Actualizar notificación
                yield this.prisma.virtualIntercomNotification.update({
                    where: { id: notificationId },
                    data: {
                        status: NotificationStatus.RESPONDED,
                        respondedAt: new Date(),
                        response: 'Rechazado',
                        responseType: ResponseType.REJECT
                    }
                });
                // Rechazar visita
                yield this.rejectVisit(notification.visitId, notification.userId);
            }
            catch (error) {
                console.error('Error al procesar rechazo:', error);
            }
        });
    }
    /**
     * Procesa una respuesta personalizada
     */
    processCustomResponse(notificationId, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Actualizar notificación
                yield this.prisma.virtualIntercomNotification.update({
                    where: { id: notificationId },
                    data: {
                        status: NotificationStatus.RESPONDED,
                        respondedAt: new Date(),
                        response,
                        responseType: ResponseType.CUSTOM
                    }
                });
                // Registrar actividad
                yield this.logger.logActivity({
                    module: 'intercom',
                    action: 'custom_response',
                    entityId: notificationId,
                    details: { response }
                });
            }
            catch (error) {
                console.error('Error al procesar respuesta personalizada:', error);
            }
        });
    }
    /**
     * Aprueba una visita
     */
    approveVisit(visitId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Actualizar estado de la visita
                yield this.prisma.visit.update({
                    where: { id: visitId },
                    data: {
                        status: VisitStatus.APPROVED,
                        authorizedBy: userId
                    }
                });
                // Registrar actividad
                yield this.logger.logActivity({
                    module: 'intercom',
                    action: 'approve_visit',
                    entityId: visitId,
                    details: { userId }
                });
            }
            catch (error) {
                console.error('Error al aprobar visita:', error);
                throw error;
            }
        });
    }
    /**
     * Rechaza una visita
     */
    rejectVisit(visitId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Actualizar estado de la visita
                yield this.prisma.visit.update({
                    where: { id: visitId },
                    data: {
                        status: VisitStatus.REJECTED,
                        authorizedBy: userId
                    }
                });
                // Registrar actividad
                yield this.logger.logActivity({
                    module: 'intercom',
                    action: 'reject_visit',
                    entityId: visitId,
                    details: { userId }
                });
            }
            catch (error) {
                console.error('Error al rechazar visita:', error);
                throw error;
            }
        });
    }
    /**
     * Registra la entrada de un visitante
     */
    registerEntry(visitId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar que la visita esté aprobada
                const visit = yield this.prisma.visit.findUnique({
                    where: { id: visitId }
                });
                if (!visit) {
                    throw new Error(`Visita con ID ${visitId} no encontrada`);
                }
                if (visit.status !== VisitStatus.APPROVED) {
                    throw new Error(`La visita con ID ${visitId} no está aprobada`);
                }
                // Actualizar estado de la visita
                yield this.prisma.visit.update({
                    where: { id: visitId },
                    data: {
                        status: VisitStatus.IN_PROGRESS,
                        entryTime: new Date()
                    }
                });
                // Registrar actividad
                yield this.logger.logActivity({
                    module: 'intercom',
                    action: 'register_entry',
                    entityId: visitId,
                    details: {}
                });
            }
            catch (error) {
                console.error('Error al registrar entrada:', error);
                throw error;
            }
        });
    }
    /**
     * Registra la salida de un visitante
     */
    registerExit(visitId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar que la visita esté en progreso
                const visit = yield this.prisma.visit.findUnique({
                    where: { id: visitId }
                });
                if (!visit) {
                    throw new Error(`Visita con ID ${visitId} no encontrada`);
                }
                if (visit.status !== VisitStatus.IN_PROGRESS) {
                    throw new Error(`La visita con ID ${visitId} no está en progreso`);
                }
                // Actualizar estado de la visita
                yield this.prisma.visit.update({
                    where: { id: visitId },
                    data: {
                        status: VisitStatus.COMPLETED,
                        exitTime: new Date()
                    }
                });
                // Registrar actividad
                yield this.logger.logActivity({
                    module: 'intercom',
                    action: 'register_exit',
                    entityId: visitId,
                    details: {}
                });
            }
            catch (error) {
                console.error('Error al registrar salida:', error);
                throw error;
            }
        });
    }
    /**
     * Obtiene el historial de visitas para una unidad
     */
    getVisitHistory(unitId_1) {
        return __awaiter(this, arguments, void 0, function* (unitId, options = {}) {
            const { status, startDate, endDate, page = 1, pageSize = 10 } = options;
            try {
                // Construir filtros
                const where = { unitId };
                if (status) {
                    where.status = status;
                }
                if (startDate || endDate) {
                    where.createdAt = {};
                    if (startDate) {
                        where.createdAt.gte = new Date(startDate);
                    }
                    if (endDate) {
                        where.createdAt.lte = new Date(endDate);
                    }
                }
                // Obtener visitas
                const visits = yield this.prisma.visit.findMany({
                    where,
                    include: {
                        visitor: {
                            include: { type: true }
                        },
                        notifications: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    skip: (page - 1) * pageSize,
                    take: pageSize
                });
                // Obtener total de registros para paginación
                const total = yield this.prisma.visit.count({ where });
                return {
                    data: visits,
                    pagination: {
                        page,
                        pageSize,
                        total,
                        totalPages: Math.ceil(total / pageSize)
                    }
                };
            }
            catch (error) {
                console.error('Error al obtener historial de visitas:', error);
                throw error;
            }
        });
    }
    /**
     * Actualiza las preferencias de citofonía de un usuario
     */
    updateUserPreferences(userId, preferences) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar si ya existen preferencias
                const existing = yield this.prisma.userIntercomPreference.findUnique({
                    where: { userId }
                });
                if (existing) {
                    // Actualizar preferencias existentes
                    return yield this.prisma.userIntercomPreference.update({
                        where: { userId },
                        data: preferences
                    });
                }
                else {
                    // Crear nuevas preferencias
                    return yield this.prisma.userIntercomPreference.create({
                        data: Object.assign({ userId }, preferences)
                    });
                }
            }
            catch (error) {
                console.error('Error al actualizar preferencias de usuario:', error);
                throw error;
            }
        });
    }
    /**
     * Actualiza la configuración general del sistema de citofonía
     */
    updateSettings(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Obtener configuración actual
                const current = yield this.prisma.intercomSettings.findFirst();
                if (current) {
                    // Actualizar configuración existente
                    const updated = yield this.prisma.intercomSettings.update({
                        where: { id: current.id },
                        data: settings
                    });
                    // Reinicializar adaptadores
                    yield this.initializeAdapters();
                    return updated;
                }
                else {
                    // Crear nueva configuración
                    const created = yield this.prisma.intercomSettings.create({
                        data: settings
                    });
                    // Reinicializar adaptadores
                    yield this.initializeAdapters();
                    return created;
                }
            }
            catch (error) {
                console.error('Error al actualizar configuración:', error);
                throw error;
            }
        });
    }
    /**
     * Obtiene estadísticas del sistema de citofonía
     */
    getStatistics() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            const { startDate, endDate } = options;
            try {
                // Construir filtros de fecha
                const dateFilter = {};
                if (startDate) {
                    dateFilter.gte = new Date(startDate);
                }
                if (endDate) {
                    dateFilter.lte = new Date(endDate);
                }
                // Estadísticas de visitas
                const visitStats = yield this.prisma.$transaction([
                    // Total de visitas
                    this.prisma.visit.count({
                        where: dateFilter.gte || dateFilter.lte ? { createdAt: dateFilter } : {}
                    }),
                    // Visitas por estado
                    this.prisma.visit.groupBy({
                        by: ['status'],
                        _count: true,
                        where: dateFilter.gte || dateFilter.lte ? { createdAt: dateFilter } : {}
                    }),
                    // Tiempo promedio de respuesta (en segundos)
                    this.prisma.virtualIntercomNotification.aggregate({
                        _avg: {
                            retries: true
                        },
                        where: {
                            status: NotificationStatus.RESPONDED,
                            sentAt: dateFilter.gte || dateFilter.lte ? dateFilter : {}
                        }
                    })
                ]);
                // Estadísticas de notificaciones
                const notificationStats = yield this.prisma.$transaction([
                    // Notificaciones por canal
                    this.prisma.virtualIntercomNotification.groupBy({
                        by: ['channel'],
                        _count: true,
                        where: dateFilter.gte || dateFilter.lte ? { sentAt: dateFilter } : {}
                    }),
                    // Notificaciones por estado
                    this.prisma.virtualIntercomNotification.groupBy({
                        by: ['status'],
                        _count: true,
                        where: dateFilter.gte || dateFilter.lte ? { sentAt: dateFilter } : {}
                    })
                ]);
                // Formatear resultados
                const visitByStatus = visitStats[1].reduce((acc, item) => {
                    acc[item.status] = item._count;
                    return acc;
                }, {});
                const notificationByChannel = notificationStats[0].reduce((acc, item) => {
                    acc[item.channel] = item._count;
                    return acc;
                }, {});
                const notificationByStatus = notificationStats[1].reduce((acc, item) => {
                    acc[item.status] = item._count;
                    return acc;
                }, {});
                return {
                    visits: {
                        total: visitStats[0],
                        byStatus: visitByStatus
                    },
                    notifications: {
                        byChannel: notificationByChannel,
                        byStatus: notificationByStatus
                    },
                    performance: {
                        avgRetries: visitStats[2]._avg.retries || 0
                    }
                };
            }
            catch (error) {
                console.error('Error al obtener estadísticas:', error);
                throw error;
            }
        });
    }
}
// Exportar la clase del servicio
// La instancia se creará en el archivo de prueba para permitir el mocking adecuado
