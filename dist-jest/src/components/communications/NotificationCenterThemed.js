"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Bell, MessageSquare, X, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRealTimeCommunication } from '@/lib/communications/real-time-context';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { translate, getNotificationBackgroundClass } from '@/lib/communications/theme-config';
export default function NotificationCenterThemed({ language = 'Español', themeMode = 'light', primaryColor }) {
    const [isOpen, setIsOpen] = useState(false);
    // useState activeTab eliminado por lint
    const [expandedNotification, setExpandedNotification] = useState(null);
    const { notifications, unreadNotificationsCount, messages, unreadMessagesCount, markNotificationAsRead, markAllNotificationsAsRead, clearNotifications, markMessageAsRead, markAllMessagesAsRead } = useRealTimeCommunication();
    // Cerrar al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            const target = event.target;
            if (!target.closest('.notification-center') && !target.closest('.notification-trigger')) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    // Formatear fecha relativa
    const formatRelativeTime = (date) => {
        return formatDistanceToNow(new Date(date), {
            addSuffix: true,
            locale: language === 'Español' ? es : undefined
        });
    };
    // Obtener color según tipo de notificación
    const getNotificationColor = (type) => {
        return getNotificationBackgroundClass(type);
    };
    // Aplanar mensajes para mostrar
    const flattenedMessages = Object.values(messages).flat().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    // Agrupar mensajes por remitente
    const messagesBySender = {};
    flattenedMessages.forEach(message => {
        const senderId = message.senderId;
        if (!messagesBySender[senderId]) {
            messagesBySender[senderId] = [];
        }
        messagesBySender[senderId].push(message);
    });
    // Obtener remitentes únicos
    const uniqueSenders = Object.keys(messagesBySender).map(Number);
    // Manejar clic en notificación
    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            markNotificationAsRead(notification.id);
        }
        // Expandir/colapsar detalles
        setExpandedNotification(expandedNotification === notification.id ? null : notification.id);
        // Navegar si hay enlace
        if (notification.link) {
            window.location.href = notification.link;
        }
    };
    // Manejar clic en mensaje
    const handleMessageClick = (message) => {
        if (!message.read) {
            markMessageAsRead(message.id);
        }
    };
    // Estilo personalizado para el botón activo
    const activeTabStyle = primaryColor ?
        { backgroundColor: primaryColor, color: '#ffffff' } :
        {};
    return (_jsxs("div", { className: "relative", children: [_jsxs("div", { className: "flex space-x-2", children: [_jsxs(Button, { variant: "ghost", size: "sm", className: "notification-trigger relative", onClick: () => {
                            setIsOpen(!isOpen);
                            setActiveTab('notifications');
                        }, children: [_jsx(Bell, { className: "h-5 w-5" }), unreadNotificationsCount > 0 && (_jsx(Badge, { className: `absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 ${primaryColor ? 'bg-red-500' : 'bg-red-500 dark:bg-red-600'}`, children: unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount }))] }), _jsxs(Button, { variant: "ghost", size: "sm", className: "notification-trigger relative", onClick: () => {
                            setIsOpen(!isOpen);
                            setActiveTab('messages');
                        }, children: [_jsx(MessageSquare, { className: "h-5 w-5" }), unreadMessagesCount > 0 && (_jsx(Badge, { className: `absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 ${primaryColor ? 'bg-red-500' : 'bg-red-500 dark:bg-red-600'}`, children: unreadMessagesCount > 9 ? '9+' : unreadMessagesCount }))] })] }), isOpen && (_jsxs(Card, { className: "notification-center absolute right-0 mt-2 w-80 sm:w-96 z-50 shadow-lg", children: [_jsxs(CardHeader, { className: "p-3 pb-0", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx(CardTitle, { className: "text-lg", children: activeTab === 'notifications'
                                            ? translate('notifications', language)
                                            : translate('messages', language) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setIsOpen(false), children: _jsx(X, { className: "h-4 w-4" }) })] }), _jsxs(TabsList, { className: "grid grid-cols-2 mt-2", children: [_jsxs(TabsTrigger, { value: "notifications", onClick: () => setActiveTab('notifications'), className: activeTab === 'notifications' ? 'data-[state=active]' : '', style: activeTab === 'notifications' ? activeTabStyle : {}, children: [translate('notifications', language), unreadNotificationsCount > 0 && (_jsx(Badge, { className: `ml-2 ${primaryColor ? 'bg-red-500' : 'bg-red-500 dark:bg-red-600'}`, children: unreadNotificationsCount }))] }), _jsxs(TabsTrigger, { value: "messages", onClick: () => setActiveTab('messages'), className: activeTab === 'messages' ? 'data-[state=active]' : '', style: activeTab === 'messages' ? activeTabStyle : {}, children: [translate('messages', language), unreadMessagesCount > 0 && (_jsx(Badge, { className: `ml-2 ${primaryColor ? 'bg-red-500' : 'bg-red-500 dark:bg-red-600'}`, children: unreadMessagesCount }))] })] })] }), _jsx(CardContent, { className: "p-0", children: _jsxs(Tabs, { value: activeTab, className: "w-full", children: [_jsxs(TabsContent, { value: "notifications", className: "m-0", children: [_jsxs("div", { className: "flex justify-between items-center px-3 py-2 border-t border-b", children: [_jsxs("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: [notifications.length, " ", translate('notifications', language).toLowerCase()] }), _jsxs("div", { className: "flex space-x-2", children: [_jsxs(Button, { variant: "ghost", size: "sm", onClick: markAllNotificationsAsRead, disabled: unreadNotificationsCount === 0, children: [_jsx(Check, { className: "h-3 w-3 mr-1" }), _jsx("span", { className: "text-xs", children: translate('mark_as_read', language) })] }), _jsxs(Button, { variant: "ghost", size: "sm", onClick: clearNotifications, disabled: notifications.length === 0, children: [_jsx(X, { className: "h-3 w-3 mr-1" }), _jsx("span", { className: "text-xs", children: translate('clear', language) })] })] })] }), _jsx(ScrollArea, { className: "h-[300px]", children: notifications.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-full p-4 text-gray-500 dark:text-gray-400", children: [_jsx(Bell, { className: "h-10 w-10 mb-2 text-gray-400 dark:text-gray-500" }), _jsx("p", { children: translate('no_notifications', language) })] })) : (_jsx("div", { children: notifications.map((notification) => (_jsx("div", { className: `border-b last:border-b-0 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`, onClick: () => handleNotificationClick(notification), children: _jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: `h-2 w-2 mt-1.5 rounded-full mr-2 ${getNotificationColor(notification.type)}` }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsx("h4", { className: "font-medium text-sm", children: notification.title }), _jsx("span", { className: "text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2", children: formatRelativeTime(notification.timestamp) })] }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2", children: notification.message }), expandedNotification === notification.id && notification.data && (_jsx("div", { className: "mt-2 text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded", children: _jsx("pre", { className: "whitespace-pre-wrap", children: JSON.stringify(notification.data, null, 2) }) })), _jsxs("div", { className: "flex justify-between items-center mt-2", children: [notification.link && (_jsx(Button, { variant: "link", size: "sm", className: "p-0 h-auto text-xs", style: primaryColor ? { color: primaryColor } : {}, children: translate('view_details', language) })), _jsx("div", { className: "flex items-center ml-auto", children: expandedNotification === notification.id ? (_jsx(ChevronUp, { className: "h-3 w-3 text-gray-400 dark:text-gray-500" })) : (_jsx(ChevronDown, { className: "h-3 w-3 text-gray-400 dark:text-gray-500" })) })] })] })] }) }, notification.id))) })) })] }), _jsxs(TabsContent, { value: "messages", className: "m-0", children: [_jsxs("div", { className: "flex justify-between items-center px-3 py-2 border-t border-b", children: [_jsxs("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: [flattenedMessages.length, " ", translate('messages', language).toLowerCase()] }), _jsx("div", { className: "flex space-x-2", children: _jsxs(Button, { variant: "ghost", size: "sm", onClick: () => uniqueSenders.forEach(senderId => markAllMessagesAsRead(senderId)), disabled: unreadMessagesCount === 0, children: [_jsx(Check, { className: "h-3 w-3 mr-1" }), _jsx("span", { className: "text-xs", children: translate('mark_as_read', language) })] }) })] }), _jsx(ScrollArea, { className: "h-[300px]", children: flattenedMessages.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-full p-4 text-gray-500 dark:text-gray-400", children: [_jsx(MessageSquare, { className: "h-10 w-10 mb-2 text-gray-400 dark:text-gray-500" }), _jsx("p", { children: translate('no_messages', language) })] })) : (_jsx("div", { children: uniqueSenders.map((senderId) => {
                                                    const senderMessages = messagesBySender[senderId];
                                                    const latestMessage = senderMessages[0];
                                                    const unreadCount = senderMessages.filter(m => !m.read).length;
                                                    return (_jsx("div", { className: `border-b last:border-b-0 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${unreadCount > 0 ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`, onClick: () => handleMessageClick(latestMessage), children: _jsxs("div", { className: "flex items-center", children: [_jsx(Avatar, { className: "h-8 w-8 mr-3", children: _jsx(AvatarFallback, { children: latestMessage.senderName.substring(0, 2).toUpperCase() }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsx("h4", { className: "font-medium text-sm", children: latestMessage.senderName }), _jsx("span", { className: "text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2", children: formatRelativeTime(latestMessage.timestamp) })] }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-1", children: latestMessage.content }), _jsxs("div", { className: "flex justify-between items-center mt-1", children: [_jsx(Button, { variant: "link", size: "sm", className: "p-0 h-auto text-xs", style: primaryColor ? { color: primaryColor } : {}, children: translate('view_conversation', language) }), unreadCount > 0 && (_jsx(Badge, { className: primaryColor ?
                                                                                        { backgroundColor: primaryColor } :
                                                                                        'bg-red-500 dark:bg-red-600', children: unreadCount }))] })] })] }) }, senderId));
                                                }) })) })] })] }) })] }))] }));
}
