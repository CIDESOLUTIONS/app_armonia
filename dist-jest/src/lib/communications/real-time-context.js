"use client";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';
// Crear el contexto
const RealTimeCommunicationContext = createContext(undefined);
// Proveedor del contexto
export function RealTimeCommunicationProvider({ children }) {
    const { user, token } = useAuthStore();
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [messages, setMessages] = useState({});
    const [onlineUsers, setOnlineUsers] = useState([]);
    // Inicializar conexión WebSocket
    useEffect(() => {
        if (!user || !token)
            return;
        // Crear conexión Socket.IO
        const socketInstance = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001', {
            auth: {
                token
            },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });
        // Manejar eventos de conexión
        socketInstance.on('connect', () => {
            console.log('WebSocket connected');
            setConnected(true);
        });
        socketInstance.on('disconnect', () => {
            console.log('WebSocket disconnected');
            setConnected(false);
        });
        socketInstance.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
        // Manejar eventos de datos
        socketInstance.on('notification', (data) => {
            setNotifications(prev => [data, ...prev]);
        });
        socketInstance.on('message', (data) => {
            setMessages(prev => {
                const senderId = data.senderId;
                const prevMessages = prev[senderId] || [];
                return Object.assign(Object.assign({}, prev), { [senderId]: [...prevMessages, data] });
            });
        });
        socketInstance.on('online_users', (users) => {
            setOnlineUsers(users);
        });
        // Cargar notificaciones y mensajes iniciales
        fetchInitialData();
        // Guardar instancia de socket
        setSocket(socketInstance);
        // Limpiar al desmontar
        return () => {
            socketInstance.disconnect();
        };
    }, [user, token, fetchInitialData]);
    // Cargar datos iniciales
    const fetchInitialData = () => __awaiter(this, void 0, void 0, function* () {
        if (!token)
            return;
        try {
            // Cargar notificaciones
            const notificationsResponse = yield fetch('/api/communications/notifications', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (notificationsResponse.ok) {
                const notificationsData = yield notificationsResponse.json();
                setNotifications(notificationsData);
            }
            // Cargar mensajes
            const messagesResponse = yield fetch('/api/communications/messages', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (messagesResponse.ok) {
                const messagesData = yield messagesResponse.json();
                setMessages(messagesData);
            }
        }
        catch (error) {
            console.error('Error al cargar datos iniciales:', error);
        }
    });
    // Calcular contadores
    const unreadNotificationsCount = notifications.filter(n => !n.read).length;
    const unreadMessagesCount = Object.values(messages).flat().filter(m => !m.read).length;
    // Métodos para notificaciones
    const markNotificationAsRead = (id) => __awaiter(this, void 0, void 0, function* () {
        if (!token)
            return;
        try {
            // Variable response eliminada por lint
            if (response.ok) {
                setNotifications(prev => prev.map(n => n.id === id ? Object.assign(Object.assign({}, n), { read: true }) : n));
            }
        }
        catch (error) {
            console.error('Error al marcar notificación como leída:', error);
        }
    });
    const markAllNotificationsAsRead = () => __awaiter(this, void 0, void 0, function* () {
        if (!token)
            return;
        try {
            // Variable response eliminada por lint
            if (response.ok) {
                setNotifications(prev => prev.map(n => (Object.assign(Object.assign({}, n), { read: true }))));
            }
        }
        catch (error) {
            console.error('Error al marcar todas las notificaciones como leídas:', error);
        }
    });
    const clearNotifications = () => __awaiter(this, void 0, void 0, function* () {
        if (!token)
            return;
        try {
            // Variable response eliminada por lint
            if (response.ok) {
                setNotifications([]);
            }
        }
        catch (error) {
            console.error('Error al limpiar notificaciones:', error);
        }
    });
    // Métodos para mensajes
    const sendMessage = (recipientId, content, attachments) => __awaiter(this, void 0, void 0, function* () {
        if (!socket || !token || !user)
            return false;
        try {
            const messageData = {
                recipientId,
                content,
                attachments
            };
            return new Promise((resolve) => {
                socket.emit('send_message', messageData, (response) => {
                    if (response.success) {
                        setMessages(prev => {
                            const prevMessages = prev[recipientId] || [];
                            return Object.assign(Object.assign({}, prev), { [recipientId]: [...prevMessages, response.message] });
                        });
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                });
            });
        }
        catch (error) {
            console.error('Error al enviar mensaje:', error);
            return false;
        }
    });
    const markMessageAsRead = (messageId) => __awaiter(this, void 0, void 0, function* () {
        if (!token)
            return;
        try {
            // Variable response eliminada por lint
            if (response.ok) {
                setMessages(prev => {
                    const newMessages = Object.assign({}, prev);
                    // Buscar y actualizar el mensaje en todas las conversaciones
                    Object.keys(newMessages).forEach(senderId => {
                        newMessages[Number(senderId)] = newMessages[Number(senderId)].map(m => m.id === messageId ? Object.assign(Object.assign({}, m), { read: true }) : m);
                    });
                    return newMessages;
                });
            }
        }
        catch (error) {
            console.error('Error al marcar mensaje como leído:', error);
        }
    });
    const markAllMessagesAsRead = (senderId) => __awaiter(this, void 0, void 0, function* () {
        if (!token)
            return;
        try {
            // Variable response eliminada por lint
            if (response.ok) {
                setMessages(prev => {
                    const senderMessages = prev[senderId] || [];
                    return Object.assign(Object.assign({}, prev), { [senderId]: senderMessages.map(m => (Object.assign(Object.assign({}, m), { read: true }))) });
                });
            }
        }
        catch (error) {
            console.error('Error al marcar todos los mensajes como leídos:', error);
        }
    });
    // Métodos para eventos en tiempo real
    const subscribeToEvent = (eventType, callback) => {
        if (!socket)
            return;
        socket.on(eventType, callback);
    };
    const unsubscribeFromEvent = (eventType, callback) => {
        if (!socket)
            return;
        socket.off(eventType, callback);
    };
    // Métodos de conexión
    const reconnect = () => {
        if (socket) {
            socket.connect();
        }
    };
    const disconnect = () => {
        if (socket) {
            socket.disconnect();
        }
    };
    // Valor del contexto
    const value = {
        socket,
        connected,
        notifications,
        unreadNotificationsCount,
        messages,
        unreadMessagesCount,
        onlineUsers,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        sendMessage,
        markMessageAsRead,
        markAllMessagesAsRead,
        subscribeToEvent,
        unsubscribeFromEvent,
        reconnect,
        disconnect
    };
    return (_jsx(RealTimeCommunicationContext.Provider, { value: value, children: children }));
}
// Hook para usar el contexto
export function useRealTimeCommunication() {
    const context = useContext(RealTimeCommunicationContext);
    if (context === undefined) {
        throw new Error('useRealTimeCommunication debe ser usado dentro de un RealTimeCommunicationProvider');
    }
    return context;
}
