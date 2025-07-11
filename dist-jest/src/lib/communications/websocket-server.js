/**
 * WebSocket Server para comunicaciones en tiempo real
 *
 * Este módulo implementa un servidor WebSocket para manejar comunicaciones
 * en tiempo real entre clientes, incluyendo notificaciones, mensajes y eventos.
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
import { Server as SocketIOServer } from 'socket.io';
import { getPrisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { logAuditAction, AuditActionType, AuditStatus } from '@/lib/security/audit-trail';
// Cliente Prisma para operaciones de base de datos
const prisma = getPrisma();
// Mapa de conexiones activas: userId -> socketId
const activeConnections = new Map();
/**
 * Inicializa el servidor WebSocket
 */
export function initializeWebSocketServer(httpServer) {
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });
    // Middleware de autenticación
    io.use((socket, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const _token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error: Token missing'));
            }
            // Verificar token
            const _user = yield verifyToken(token);
            if (!user) {
                return next(new Error('Authentication error: Invalid token'));
            }
            // Guardar información del usuario en el socket
            socket.data.user = user;
            next();
        }
        catch (error) {
            console.error('WebSocket authentication error:', error);
            next(new Error('Authentication error'));
        }
    }));
    // Manejar conexiones
    io.on('connection', (socket) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const _user = socket.data.user;
            if (!user || !user.id) {
                socket.disconnect();
                return;
            }
            const userId = user.id;
            // Registrar conexión activa
            if (!activeConnections.has(userId)) {
                activeConnections.set(userId, []);
            }
            (_a = activeConnections.get(userId)) === null || _a === void 0 ? void 0 : _a.push(socket.id);
            // Registrar en auditoría
            yield logAuditAction({
                action: AuditActionType.LOGIN,
                details: `WebSocket connection established for user ${user.name || user.email}`,
                userId,
                userName: user.name || user.email || 'Unknown',
                status: AuditStatus.SUCCESS
            });
            // Emitir lista de usuarios en línea
            emitOnlineUsers(io);
            // Enviar notificaciones pendientes
            yield sendPendingNotifications(socket, userId);
            // Manejar desconexión
            socket.on('disconnect', () => __awaiter(this, void 0, void 0, function* () {
                // Eliminar conexión del mapa
                const userConnections = activeConnections.get(userId) || [];
                const updatedConnections = userConnections.filter(id => id !== socket.id);
                if (updatedConnections.length === 0) {
                    activeConnections.delete(userId);
                }
                else {
                    activeConnections.set(userId, updatedConnections);
                }
                // Registrar en auditoría
                yield logAuditAction({
                    action: AuditActionType.LOGOUT,
                    details: `WebSocket connection closed for user ${user.name || user.email}`,
                    userId,
                    userName: user.name || user.email || 'Unknown',
                    status: AuditStatus.SUCCESS
                });
                // Actualizar lista de usuarios en línea
                emitOnlineUsers(io);
            }));
            // Manejar envío de mensajes
            socket.on('send_message', (data, callback) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { recipientId, content, attachments } = data;
                    // Validar datos
                    if (!recipientId || !content) {
                        callback({ success: false, error: 'Invalid message data' });
                        return;
                    }
                    // Crear mensaje en la base de datos
                    const message = yield prisma.message.create({
                        data: {
                            senderId: userId,
                            senderName: user.name || user.email || 'Unknown',
                            recipientId,
                            content,
                            attachments: attachments || [],
                            read: false
                        }
                    });
                    // Formatear mensaje para enviar
                    const formattedMessage = {
                        id: message.id,
                        senderId: message.senderId,
                        senderName: message.senderName,
                        recipientId: message.recipientId,
                        content: message.content,
                        timestamp: message.createdAt,
                        read: message.read,
                        attachments: message.attachments
                    };
                    // Enviar mensaje al destinatario si está conectado
                    const recipientSockets = activeConnections.get(recipientId);
                    if (recipientSockets && recipientSockets.length > 0) {
                        recipientSockets.forEach(socketId => {
                            io.to(socketId).emit('message', formattedMessage);
                        });
                    }
                    // Responder al remitente
                    callback({ success: true, message: formattedMessage });
                }
                catch (error) {
                    console.error('Error sending message:', error);
                    callback({ success: false, error: 'Failed to send message' });
                }
            }));
            // Manejar eventos de escritura
            socket.on('typing', (data) => {
                const { recipientId, conversationId, isTyping } = data;
                // Enviar estado de escritura al destinatario
                const recipientSockets = activeConnections.get(recipientId);
                if (recipientSockets && recipientSockets.length > 0) {
                    recipientSockets.forEach(socketId => {
                        io.to(socketId).emit('typing', {
                            userId,
                            conversationId,
                            isTyping
                        });
                    });
                }
            });
        }
        catch (error) {
            console.error('Error handling WebSocket connection:', error);
            socket.disconnect();
        }
    }));
    return io;
}
/**
 * Emite la lista de usuarios en línea a todos los clientes
 */
function emitOnlineUsers(io) {
    const onlineUsers = Array.from(activeConnections.keys());
    io.emit('online_users', onlineUsers);
}
/**
 * Envía notificaciones pendientes a un usuario
 */
function sendPendingNotifications(socket, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Obtener notificaciones no leídas
            const notifications = yield prisma.notification.findMany({
                where: {
                    recipientId: userId,
                    read: false
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            // Enviar cada notificación
            notifications.forEach(notification => {
                socket.emit('notification', {
                    id: notification.id,
                    type: notification.type,
                    title: notification.title,
                    message: notification.message,
                    timestamp: notification.createdAt,
                    read: notification.read,
                    link: notification.link,
                    data: notification.data ? JSON.parse(notification.data) : undefined
                });
            });
        }
        catch (error) {
            console.error('Error sending pending notifications:', error);
        }
    });
}
/**
 * Envía una notificación a un usuario específico
 */
export function sendNotificationToUser(userId, notification) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Crear notificación en la base de datos
            const newNotification = yield prisma.notification.create({
                data: {
                    recipientId: userId,
                    type: notification.type,
                    title: notification.title,
                    message: notification.message,
                    link: notification.link,
                    data: notification.data ? JSON.stringify(notification.data) : null,
                    read: false
                }
            });
            // Formatear notificación para enviar
            const formattedNotification = {
                id: newNotification.id,
                type: newNotification.type,
                title: newNotification.title,
                message: newNotification.message,
                timestamp: newNotification.createdAt,
                read: newNotification.read,
                link: newNotification.link,
                data: notification.data
            };
            // Obtener sockets del usuario
            const userSockets = activeConnections.get(userId);
            // Enviar notificación si el usuario está conectado
            if (userSockets && userSockets.length > 0) {
                const io = global.socketIo;
                userSockets.forEach(socketId => {
                    io.to(socketId).emit('notification', formattedNotification);
                });
            }
            return formattedNotification;
        }
        catch (error) {
            console.error('Error sending notification to user:', error);
            throw new Error('Failed to send notification');
        }
    });
}
/**
 * Envía una notificación a múltiples usuarios
 */
export function sendNotificationToUsers(userIds, notification) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const results = [];
            for (const userId of userIds) {
                try {
                    const _result = yield sendNotificationToUser(userId, notification);
                    results.push(result);
                }
                catch (error) {
                    console.error(`Error sending notification to user ${userId}:`, error);
                }
            }
            return results;
        }
        catch (error) {
            console.error('Error sending notification to users:', error);
            throw new Error('Failed to send notifications');
        }
    });
}
/**
 * Envía una notificación a todos los usuarios
 */
export function sendNotificationToAll(notification) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Obtener todos los usuarios
            const users = yield prisma.user.findMany({
                select: {
                    id: true
                }
            });
            const userIds = users.map(user => user.id);
            return yield sendNotificationToUsers(userIds, notification);
        }
        catch (error) {
            console.error('Error sending notification to all users:', error);
            throw new Error('Failed to send notification to all users');
        }
    });
}
/**
 * Envía una notificación a usuarios con un rol específico
 */
export function sendNotificationByRole(role, notification) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Obtener usuarios con el rol especificado
            const users = yield prisma.user.findMany({
                where: {
                    role
                },
                select: {
                    id: true
                }
            });
            const userIds = users.map(user => user.id);
            return yield sendNotificationToUsers(userIds, notification);
        }
        catch (error) {
            console.error(`Error sending notification to users with role ${role}:`, error);
            throw new Error('Failed to send notification by role');
        }
    });
}
