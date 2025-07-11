'use client';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Megaphone, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRealTimeCommunication } from '@/lib/communications/real-time-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
export default function AnnouncementBoard({ language = 'Español', userId, userRole, isAdmin = false }) {
    const [announcements, setAnnouncements] = useState([]);
    const [expandedAnnouncement, setExpandedAnnouncement] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);
    const { subscribeToEvent, socket } = useRealTimeCommunication();
    const { toast } = useToast();
    // Cargar anuncios
    useEffect(() => {
        const fetchAnnouncements = () => __awaiter(this, void 0, void 0, function* () {
            try {
                setLoading(true);
                const response = yield fetch('/api/communications/announcements');
                if (response.ok) {
                    const data = yield response.json();
                    setAnnouncements(data);
                }
                else {
                    toast({
                        title: language === 'Español' ? 'Error' : 'Error',
                        description: language === 'Español'
                            ? 'No se pudieron cargar los anuncios'
                            : 'Could not load announcements',
                        variant: 'destructive'
                    });
                }
            }
            catch (error) {
                console.error('Error al cargar anuncios:', error);
                toast({
                    title: language === 'Español' ? 'Error' : 'Error',
                    description: language === 'Español'
                        ? 'No se pudieron cargar los anuncios'
                        : 'Could not load announcements',
                    variant: 'destructive'
                });
            }
            finally {
                setLoading(false);
            }
        });
        fetchAnnouncements();
        // Suscribirse a nuevos anuncios
        const handleNewAnnouncement = (announcement) => {
            setAnnouncements(prev => [announcement, ...prev]);
            toast({
                title: language === 'Español' ? 'Nuevo anuncio' : 'New announcement',
                description: announcement.title,
                variant: announcement.type === 'emergency' ? 'destructive' :
                    announcement.type === 'important' ? 'warning' : 'default'
            });
        };
        subscribeToEvent('new_announcement', handleNewAnnouncement);
        return () => {
            // Limpiar suscripción
            if (socket) {
                socket.off('new_announcement', handleNewAnnouncement);
            }
        };
    }, [subscribeToEvent, socket, toast, language]);
    // Formatear fecha relativa
    const formatRelativeTime = (date) => {
        return formatDistanceToNow(new Date(date), {
            addSuffix: true,
            locale: language === 'Español' ? es : undefined
        });
    };
    // Formatear fecha completa
    const formatFullDate = (date) => {
        return format(new Date(date), 'PPpp', {
            locale: language === 'Español' ? es : undefined
        });
    };
    // Verificar si un anuncio ha sido leído por el usuario actual
    const isAnnouncementRead = (announcement) => {
        return announcement.isRead || announcement.readBy.some(reader => reader.userId === userId);
    };
    // Marcar anuncio como leído
    const markAsRead = (announcementId) => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`/api/communications/announcements/${announcementId}/read`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                setAnnouncements(prev => prev.map(a => a.id === announcementId
                    ? Object.assign(Object.assign({}, a), { isRead: true, readBy: [...a.readBy, { userId, readAt: new Date() }] }) : a));
            }
            else {
                toast({
                    title: language === 'Español' ? 'Error' : 'Error',
                    description: language === 'Español'
                        ? 'No se pudo marcar el anuncio como leído'
                        : 'Could not mark announcement as read',
                    variant: 'destructive'
                });
            }
        }
        catch (error) {
            console.error('Error al marcar anuncio como leído:', error);
            toast({
                title: language === 'Español' ? 'Error' : 'Error',
                description: language === 'Español'
                    ? 'No se pudo marcar el anuncio como leído'
                    : 'Could not mark announcement as read',
                variant: 'destructive'
            });
        }
    });
    // Confirmar lectura de anuncio
    const confirmReading = (announcementId) => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`/api/communications/announcements/${announcementId}/confirm`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                setAnnouncements(prev => prev.map(a => a.id === announcementId
                    ? Object.assign(Object.assign({}, a), { isRead: true, readBy: [...a.readBy, { userId, readAt: new Date() }] }) : a));
                toast({
                    title: language === 'Español' ? 'Confirmado' : 'Confirmed',
                    description: language === 'Español'
                        ? 'Lectura confirmada correctamente'
                        : 'Reading confirmed successfully',
                    variant: 'success'
                });
            }
            else {
                toast({
                    title: language === 'Español' ? 'Error' : 'Error',
                    description: language === 'Español'
                        ? 'No se pudo confirmar la lectura'
                        : 'Could not confirm reading',
                    variant: 'destructive'
                });
            }
        }
        catch (error) {
            console.error('Error al confirmar lectura:', error);
            toast({
                title: language === 'Español' ? 'Error' : 'Error',
                description: language === 'Español'
                    ? 'No se pudo confirmar la lectura'
                    : 'Could not confirm reading',
                variant: 'destructive'
            });
        }
    });
    // Manejar clic en anuncio
    const handleAnnouncementClick = (announcement) => {
        // Expandir/colapsar detalles
        setExpandedAnnouncement(expandedAnnouncement === announcement.id ? null : announcement.id);
        // Marcar como leído si no lo está
        if (!isAnnouncementRead(announcement)) {
            markAsRead(announcement.id);
        }
    };
    // Filtrar anuncios según la pestaña activa
    const filteredAnnouncements = announcements.filter(announcement => {
        if (activeTab === 'unread') {
            return !isAnnouncementRead(announcement);
        }
        else if (activeTab === 'important') {
            return announcement.type === 'important' || announcement.type === 'emergency';
        }
        return true;
    });
    // Contar anuncios no leídos
    const unreadCount = announcements.filter(a => !isAnnouncementRead(a)).length;
    // Contar anuncios importantes
    const importantCount = announcements.filter(a => (a.type === 'important' || a.type === 'emergency')).length;
    // Obtener color según tipo de anuncio
    const getAnnouncementColor = (type) => {
        switch (type) {
            case 'general': return 'bg-blue-500';
            case 'important': return 'bg-yellow-500';
            case 'emergency': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };
    // Obtener icono según tipo de anuncio
    const getAnnouncementIcon = (type) => {
        switch (type) {
            case 'general': return _jsx(Megaphone, { className: "h-5 w-5" });
            case 'important': return _jsx(AlertCircle, { className: "h-5 w-5" });
            case 'emergency': return _jsx(AlertCircle, { className: "h-5 w-5 text-red-500" });
            default: return _jsx(Megaphone, { className: "h-5 w-5" });
        }
    };
    // Verificar si un anuncio está expirado
    const isExpired = (announcement) => {
        if (!announcement.expiresAt)
            return false;
        return new Date(announcement.expiresAt) < new Date();
    };
    // Crear nuevo anuncio
    const handleCreateAnnouncement = () => {
        // Implementar navegación a la página de creación de anuncios
        window.location.href = '/admin/communications/announcements/create';
    };
    return (_jsxs(Card, { className: "w-full", children: [_jsxs(CardHeader, { className: "pb-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs(CardTitle, { className: "text-xl flex items-center gap-2", children: [_jsx(Megaphone, { className: "h-5 w-5" }), language === 'Español' ? 'Tablón de Anuncios' : 'Announcement Board'] }), isAdmin && (_jsx(Button, { variant: "outline", size: "sm", onClick: handleCreateAnnouncement, children: language === 'Español' ? 'Crear Anuncio' : 'Create Announcement' }))] }), _jsx(CardDescription, { children: language === 'Español'
                            ? 'Comunicados oficiales e información importante de la administración'
                            : 'Official communications and important information from management' }), _jsxs(TabsList, { className: "grid grid-cols-3 mt-2", children: [_jsx(TabsTrigger, { value: "all", onClick: () => setActiveTab('all'), className: activeTab === 'all' ? 'data-[state=active]:bg-indigo-600 data-[state=active]:text-white' : '', children: language === 'Español' ? 'Todos' : 'All' }), _jsxs(TabsTrigger, { value: "unread", onClick: () => setActiveTab('unread'), className: activeTab === 'unread' ? 'data-[state=active]:bg-indigo-600 data-[state=active]:text-white' : '', children: [language === 'Español' ? 'No leídos' : 'Unread', unreadCount > 0 && (_jsx(Badge, { className: "ml-2 bg-red-500", children: unreadCount }))] }), _jsxs(TabsTrigger, { value: "important", onClick: () => setActiveTab('important'), className: activeTab === 'important' ? 'data-[state=active]:bg-indigo-600 data-[state=active]:text-white' : '', children: [language === 'Español' ? 'Importantes' : 'Important', importantCount > 0 && (_jsx(Badge, { className: "ml-2 bg-yellow-500", children: importantCount }))] })] })] }), _jsx(CardContent, { className: "p-0", children: _jsx(ScrollArea, { className: "h-[400px]", children: loading ? (_jsx("div", { className: "flex justify-center items-center h-40", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" }) })) : filteredAnnouncements.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-40 p-4 text-gray-500", children: [_jsx(Megaphone, { className: "h-10 w-10 mb-2 text-gray-400" }), _jsx("p", { children: activeTab === 'unread'
                                    ? language === 'Español' ? 'No hay anuncios sin leer' : 'No unread announcements'
                                    : activeTab === 'important'
                                        ? language === 'Español' ? 'No hay anuncios importantes' : 'No important announcements'
                                        : language === 'Español' ? 'No hay anuncios' : 'No announcements' })] })) : (_jsx("div", { children: filteredAnnouncements.map((announcement) => {
                            const isRead = isAnnouncementRead(announcement);
                            const isExpanded = expandedAnnouncement === announcement.id;
                            return (_jsx("div", { className: `border-b last:border-b-0 p-4 cursor-pointer hover:bg-gray-50 ${!isRead ? 'bg-blue-50' : ''} ${isExpired(announcement) ? 'opacity-70' : ''}`, onClick: () => handleAnnouncementClick(announcement), children: _jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: `h-2 w-2 mt-1.5 rounded-full mr-2 ${getAnnouncementColor(announcement.type)}` }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex items-center gap-2", children: [getAnnouncementIcon(announcement.type), _jsxs("h4", { className: "font-medium", children: [announcement.title, announcement.requiresConfirmation && !isRead && (_jsx(Badge, { className: "ml-2 bg-red-500", children: language === 'Español' ? 'Requiere confirmación' : 'Confirmation required' }))] })] }), _jsx("span", { className: "text-xs text-gray-500 whitespace-nowrap ml-2", children: formatRelativeTime(announcement.createdAt) })] }), _jsxs("div", { className: "flex items-center gap-2 mt-1 text-xs text-gray-500", children: [_jsxs(Avatar, { className: "h-5 w-5", children: [announcement.createdBy.avatar && (_jsx(AvatarImage, { src: announcement.createdBy.avatar })), _jsx(AvatarFallback, { className: "text-[10px]", children: announcement.createdBy.name.substring(0, 2).toUpperCase() })] }), _jsx("span", { children: announcement.createdBy.name }), announcement.expiresAt && (_jsxs("div", { className: "flex items-center gap-1 ml-2", children: [_jsx(Clock, { className: "h-3 w-3" }), _jsxs("span", { children: [isExpired(announcement)
                                                                            ? language === 'Español' ? 'Expirado' : 'Expired'
                                                                            : language === 'Español' ? 'Expira ' : 'Expires ', !isExpired(announcement) && formatRelativeTime(announcement.expiresAt)] })] }))] }), _jsx("div", { className: `mt-2 text-sm ${isExpanded ? '' : 'line-clamp-2'}`, children: announcement.content }), isExpanded && announcement.attachments && announcement.attachments.length > 0 && (_jsxs("div", { className: "mt-3 space-y-2", children: [_jsx("h5", { className: "text-sm font-medium", children: language === 'Español' ? 'Archivos adjuntos:' : 'Attachments:' }), _jsx("div", { className: "flex flex-wrap gap-2", children: announcement.attachments.map(attachment => (_jsx("a", { href: attachment.url, target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 rounded px-2 py-1", onClick: (e) => e.stopPropagation(), children: _jsx("span", { children: attachment.name }) }, attachment.id))) })] })), _jsxs("div", { className: "flex justify-between items-center mt-2", children: [_jsx("div", { className: "flex items-center gap-2", children: isRead ? (_jsxs("div", { className: "flex items-center text-xs text-green-600", children: [_jsx(CheckCircle, { className: "h-3 w-3 mr-1" }), language === 'Español' ? 'Leído' : 'Read'] })) : announcement.requiresConfirmation ? (_jsx(Button, { variant: "outline", size: "sm", className: "h-7 text-xs", onClick: (e) => {
                                                                    e.stopPropagation();
                                                                    confirmReading(announcement.id);
                                                                }, children: language === 'Español' ? 'Confirmar lectura' : 'Confirm reading' })) : null }), _jsx("div", { className: "flex items-center", children: isExpanded ? (_jsx(ChevronUp, { className: "h-4 w-4 text-gray-400" })) : (_jsx(ChevronDown, { className: "h-4 w-4 text-gray-400" })) })] }), isExpanded && (_jsxs("div", { className: "mt-3 text-xs text-gray-500", children: [language === 'Español' ? 'Publicado el ' : 'Published on ', formatFullDate(announcement.createdAt)] }))] })] }) }, announcement.id));
                        }) })) }) })] }));
}
