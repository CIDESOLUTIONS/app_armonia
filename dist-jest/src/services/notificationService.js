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
import { ServerLogger } from '@/lib/logging/server-logger';
export class NotificationService {
    constructor(schemaName) {
        this.schemaName = schemaName;
        this.prisma = getPrisma(schemaName);
    }
    getNotifications(userId, complexId, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const where = { userId, complexId };
                if (filters.type)
                    where.type = filters.type;
                if (filters.read !== undefined)
                    where.read = filters.read;
                const notifications = yield this.prisma.notification.findMany({
                    where,
                    orderBy: { createdAt: 'desc' },
                });
                return notifications;
            }
            catch (error) {
                ServerLogger.error(`[NotificationService] Error al obtener notificaciones para ${this.schemaName}:`, error);
                throw error;
            }
        });
    }
    createNotification(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newNotification = yield this.prisma.notification.create({
                    data: {
                        title: data.title,
                        message: data.message,
                        userId: data.userId,
                        type: data.type,
                        sentBy: data.sentBy,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                });
                ServerLogger.info(`[NotificationService] Notificación ${newNotification.id} creada para ${this.schemaName}`);
                return newNotification;
            }
            catch (error) {
                ServerLogger.error(`[NotificationService] Error al crear notificación para ${this.schemaName}:`, error);
                throw error;
            }
        });
    }
    sendNotificationToRecipients(complexId, schemaName, title, message, recipientType, recipientId, sentBy) {
        return __awaiter(this, void 0, void 0, function* () {
            const prisma = getPrisma(schemaName);
            let usersToNotify = [];
            switch (recipientType) {
                case 'ALL':
                    usersToNotify = yield prisma.user.findMany({ where: { complexId } });
                    break;
                case 'RESIDENT': {
                    const resident = yield prisma.resident.findUnique({ where: { id: parseInt(recipientId) }, include: { user: true } });
                    if (resident === null || resident === void 0 ? void 0 : resident.user)
                        usersToNotify.push(resident.user);
                    break;
                }
                case 'PROPERTY': {
                    const propertyUsers = yield prisma.user.findMany({ where: { propertyId: parseInt(recipientId) } });
                    usersToNotify = propertyUsers;
                    break;
                }
                case 'USER': {
                    const user = yield prisma.user.findUnique({ where: { id: parseInt(recipientId) } });
                    if (user)
                        usersToNotify.push(user);
                    break;
                }
                default:
                    break;
            }
            if (usersToNotify.length === 0) {
                ServerLogger.warn(`[NotificationService] No se encontraron destinatarios para la notificación en ${schemaName}`);
                return;
            }
            const notificationPromises = usersToNotify.map(user => this.createNotification({
                title,
                message,
                userId: user.id,
                type: 'GENERAL',
                sentBy,
            }));
            yield Promise.all(notificationPromises);
            ServerLogger.info(`[NotificationService] Notificación enviada a ${usersToNotify.length} usuarios en ${schemaName}`);
        });
    }
    markAsRead(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedNotification = yield this.prisma.notification.update({
                    where: { id },
                    data: { read: true, updatedAt: new Date() },
                });
                ServerLogger.info(`[NotificationService] Notificación ${id} marcada como leída para ${this.schemaName}`);
                return updatedNotification;
            }
            catch (error) {
                ServerLogger.error(`[NotificationService] Error al marcar notificación ${id} como leída para ${this.schemaName}:`, error);
                throw error;
            }
        });
    }
    deleteNotification(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.prisma.notification.delete({ where: { id } });
                ServerLogger.info(`[NotificationService] Notificación ${id} eliminada para ${this.schemaName}`);
            }
            catch (error) {
                ServerLogger.error(`[NotificationService] Error al eliminar notificación ${id} para ${this.schemaName}:`, error);
                throw error;
            }
        });
    }
}
