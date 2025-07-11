/**
 * Servicio de notificaciones para el sistema de comunicaciones en tiempo real
 *
 * Este módulo proporciona funciones para enviar notificaciones a usuarios específicos,
 * grupos de usuarios o roles, con soporte para confirmación de lectura y priorización.
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
import { getPrisma } from '@/lib/prisma';
import { sendNotificationToUser } from './websocket-server';
const prisma = getPrisma();
/**
 * Envía una notificación a un usuario específico
 */
export function notifyUser(userId, notification) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verificar si el usuario existe
            const _user = yield prisma.user.findUnique({
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
                    requireConfirmation: notification.requireConfirmation || false,
                    priority: notification.priority || 'medium',
                    expiresAt: notification.expiresAt,
                    data: notification.data ? JSON.stringify(notification.data) : null,
                    read: false
                }
            });
            // Enviar notificación en tiempo real
            yield sendNotificationToUser(userId, {
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
export function notifyUsers(userIds, notification) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const results = [];
            for (const userId of userIds) {
                try {
                    const _result = yield notifyUser(userId, notification);
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
export function notifyByRole(role, notification) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Obtener usuarios con el rol especificado
            const users = yield prisma.user.findMany({
                where: { role },
                select: { id: true }
            });
            const userIds = users.map(user => user.id);
            return yield notifyUsers(userIds, notification);
        }
        catch (error) {
            console.error(`Error al enviar notificación a usuarios con rol ${role}:`, error);
            throw new Error('No se pudo enviar la notificación por rol');
        }
    });
}
/**
 * Envía una notificación a todos los usuarios
 */
export function notifyAll(notification) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Obtener todos los usuarios
            const users = yield prisma.user.findMany({
                select: { id: true }
            });
            const userIds = users.map(user => user.id);
            return yield notifyUsers(userIds, notification);
        }
        catch (error) {
            console.error('Error al enviar notificación a todos los usuarios:', error);
            throw new Error('No se pudo enviar la notificación a todos los usuarios');
        }
    });
}
/**
 * Envía una notificación a todos los residentes de una unidad específica
 */
export function notifyUnit(unitId, notification) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Obtener residentes de la unidad
            const residents = yield prisma.resident.findMany({
                where: { unitId },
                select: { userId: true }
            });
            const userIds = residents.map(resident => resident.userId);
            return yield notifyUsers(userIds, notification);
        }
        catch (error) {
            console.error(`Error al enviar notificación a la unidad ${unitId}:`, error);
            throw new Error('No se pudo enviar la notificación a la unidad');
        }
    });
}
/**
 * Marca una notificación como leída
 */
export function markNotificationAsRead(notificationId, userId) {
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
            throw new Error('No se pudo marcar la notificación como leída');
        }
    });
}
/**
 * Confirma la lectura de una notificación que requiere confirmación
 */
export function confirmNotificationReading(notificationId, userId) {
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
                    userId,
                    confirmedAt: new Date()
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
 * Obtiene estadísticas de confirmación de lectura para una notificación
 */
export function getNotificationConfirmationStats(notificationId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Obtener notificación
            const notification = yield prisma.notification.findUnique({
                where: { id: notificationId }
            });
            if (!notification || !notification.requireConfirmation) {
                throw new Error('Notificación no encontrada o no requiere confirmación');
            }
            // Contar confirmaciones
            const confirmationsCount = yield prisma.notificationConfirmation.count({
                where: { notificationId }
            });
            // Si la notificación fue enviada a un rol específico, obtener el total de usuarios con ese rol
            let totalRecipients = 1; // Por defecto, asumimos un solo destinatario
            if (notification.data) {
                const _data = JSON.parse(notification.data);
                if (data.recipientRole) {
                    totalRecipients = yield prisma.user.count({
                        where: { role: data.recipientRole }
                    });
                }
                else if (data.recipientUnitId) {
                    totalRecipients = yield prisma.resident.count({
                        where: { unitId: data.recipientUnitId }
                    });
                }
                else if (data.recipientAll) {
                    totalRecipients = yield prisma.user.count();
                }
            }
            return {
                total: totalRecipients,
                confirmed: confirmationsCount,
                percentage: Math.round((confirmationsCount / totalRecipients) * 100)
            };
        }
        catch (error) {
            console.error('Error al obtener estadísticas de confirmación:', error);
            throw new Error('No se pudieron obtener las estadísticas de confirmación');
        }
    });
}
/**
 * Elimina notificaciones expiradas
 */
export function cleanupExpiredNotifications() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const now = new Date();
            // Eliminar notificaciones expiradas
            const deleted = yield prisma.notification.deleteMany({
                where: {
                    expiresAt: {
                        lt: now
                    }
                }
            });
            return deleted.count;
        }
        catch (error) {
            console.error('Error al limpiar notificaciones expiradas:', error);
            throw new Error('No se pudieron limpiar las notificaciones expiradas');
        }
    });
}
