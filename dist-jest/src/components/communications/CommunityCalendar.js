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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar as CalendarIcon, Clock, MapPin, Users, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRealTimeCommunication } from '@/lib/communications/real-time-context';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
export default function CommunityCalendar({ language = 'Español', userId, userRole, isAdmin = false }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('month');
    const { subscribeToEvent, socket } = useRealTimeCommunication();
    // Cargar eventos
    useEffect(() => {
        const fetchEvents = () => __awaiter(this, void 0, void 0, function* () {
            try {
                setLoading(true);
                const startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd');
                const endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd');
                // Variable response eliminada por lint
                if (response.ok) {
                    const _data = yield response.json();
                    setEvents(data);
                }
            }
            catch (error) {
                console.error('Error al cargar eventos:', error);
            }
            finally {
                setLoading(false);
            }
        });
        fetchEvents();
        // Suscribirse a nuevos eventos
        const handleNewEvent = (event) => {
            setEvents(prev => [...prev, event]);
        };
        subscribeToEvent('new_event', handleNewEvent);
        return () => {
            // Limpiar suscripción
            if (socket) {
                socket.off('new_event', handleNewEvent);
            }
        };
    }, [currentDate, subscribeToEvent, socket]);
    // Navegar al mes anterior
    const goToPreviousMonth = () => {
        setCurrentDate(prevDate => subMonths(prevDate, 1));
    };
    // Navegar al mes siguiente
    const goToNextMonth = () => {
        setCurrentDate(prevDate => addMonths(prevDate, 1));
    };
    // Navegar al mes actual
    const goToCurrentMonth = () => {
        setCurrentDate(new Date());
    };
    // Obtener días del mes actual
    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate)
    });
    // Obtener eventos para un día específico
    const getEventsForDay = (day) => {
        return events.filter(event => isSameDay(new Date(event.startDate), day) ||
            (new Date(event.startDate) <= day && new Date(event.endDate) >= day));
    };
    // Obtener color según tipo de evento
    const getEventColor = (type) => {
        switch (type) {
            case 'meeting': return 'bg-blue-500';
            case 'maintenance': return 'bg-yellow-500';
            case 'social': return 'bg-green-500';
            case 'other': return 'bg-purple-500';
            default: return 'bg-gray-500';
        }
    };
    // Formatear fecha
    const formatEventDate = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isSameDay(start, end)) {
            return `${format(start, 'PPP', { locale: language === 'Español' ? es : undefined })} · ${format(start, 'p', { locale: language === 'Español' ? es : undefined })} - ${format(end, 'p', { locale: language === 'Español' ? es : undefined })}`;
        }
        return `${format(start, 'PPP', { locale: language === 'Español' ? es : undefined })} - ${format(end, 'PPP', { locale: language === 'Español' ? es : undefined })}`;
    };
    // Confirmar asistencia a un evento
    const confirmAttendance = (eventId, status) => __awaiter(this, void 0, void 0, function* () {
        try {
            // Variable response eliminada por lint
            if (response.ok) {
                // Actualizar estado local
                setEvents(prev => prev.map(event => {
                    var _a;
                    if (event.id === eventId) {
                        const existingAttendeeIndex = (_a = event.attendees) === null || _a === void 0 ? void 0 : _a.findIndex(a => a.userId === userId);
                        const updatedAttendees = [...(event.attendees || [])];
                        if (existingAttendeeIndex !== undefined && existingAttendeeIndex >= 0) {
                            updatedAttendees[existingAttendeeIndex] = Object.assign(Object.assign({}, updatedAttendees[existingAttendeeIndex]), { status });
                        }
                        else {
                            updatedAttendees.push({
                                userId,
                                name: 'Current User', // Idealmente, obtener el nombre del usuario actual
                                status
                            });
                        }
                        return Object.assign(Object.assign({}, event), { attendees: updatedAttendees });
                    }
                    return event;
                }));
                // Si hay un evento seleccionado, actualizarlo también
                if (selectedEvent && selectedEvent.id === eventId) {
                    const updatedEvent = events.find(e => e.id === eventId);
                    if (updatedEvent) {
                        setSelectedEvent(updatedEvent);
                    }
                }
            }
        }
        catch (error) {
            console.error('Error al confirmar asistencia:', error);
        }
    });
    // Obtener estado de asistencia del usuario actual
    const getUserAttendanceStatus = (event) => {
        var _a, _b;
        return ((_b = (_a = event.attendees) === null || _a === void 0 ? void 0 : _a.find(a => a.userId === userId)) === null || _b === void 0 ? void 0 : _b.status) || null;
    };
    // Contar asistentes por estado
    const countAttendees = (event, status) => {
        var _a;
        return ((_a = event.attendees) === null || _a === void 0 ? void 0 : _a.filter(a => a.status === status).length) || 0;
    };
    // Verificar si un evento está lleno
    const isEventFull = (event) => {
        if (!event.maxAttendees)
            return false;
        return (countAttendees(event, 'attending') >= event.maxAttendees);
    };
    return (_jsxs(Card, { className: "w-full", children: [_jsxs(CardHeader, { className: "pb-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs(CardTitle, { className: "text-xl flex items-center gap-2", children: [_jsx(CalendarIcon, { className: "h-5 w-5" }), language === 'Español' ? 'Calendario Comunitario' : 'Community Calendar'] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => setViewMode(viewMode === 'month' ? 'list' : 'month'), children: viewMode === 'month'
                                            ? (language === 'Español' ? 'Vista de lista' : 'List view')
                                            : (language === 'Español' ? 'Vista de mes' : 'Month view') }), isAdmin && (_jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(Plus, { className: "h-4 w-4 mr-1" }), language === 'Español' ? 'Crear Evento' : 'Create Event'] }))] })] }), _jsx(CardDescription, { children: language === 'Español'
                            ? 'Eventos, reuniones y actividades de la comunidad'
                            : 'Events, meetings and community activities' })] }), _jsx(CardContent, { className: "p-0", children: viewMode === 'month' ? (_jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: goToPreviousMonth, children: [_jsx(ChevronLeft, { className: "h-4 w-4" }), language === 'Español' ? 'Anterior' : 'Previous'] }), _jsx("h3", { className: "text-lg font-medium", children: format(currentDate, 'MMMM yyyy', { locale: language === 'Español' ? es : undefined }) }), _jsxs(Button, { variant: "outline", size: "sm", onClick: goToNextMonth, children: [language === 'Español' ? 'Siguiente' : 'Next', _jsx(ChevronRight, { className: "h-4 w-4" })] })] }), _jsx("div", { className: "grid grid-cols-7 gap-1 mb-2", children: ['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((day, index) => (_jsx("div", { className: "text-center text-sm font-medium", children: day }, index))) }), _jsxs("div", { className: "grid grid-cols-7 gap-1", children: [Array.from({ length: new Date(daysInMonth[0]).getDay() }).map((_, index) => (_jsx("div", { className: "h-24 p-1 border rounded-md bg-gray-50" }, `empty-${index}`))), daysInMonth.map((day) => {
                                    const dayEvents = getEventsForDay(day);
                                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                                    return (_jsxs("div", { className: `h-24 p-1 border rounded-md cursor-pointer hover:bg-gray-50 overflow-hidden
                      ${isToday(day) ? 'border-blue-500' : ''}
                      ${isSelected ? 'bg-blue-50' : ''}
                      ${!isSameMonth(day, currentDate) ? 'text-gray-400' : ''}
                    `, onClick: () => setSelectedDate(day), children: [_jsxs("div", { className: "flex justify-between items-center mb-1", children: [_jsx("span", { className: `text-sm font-medium ${isToday(day) ? 'bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center' : ''}`, children: format(day, 'd') }), dayEvents.length > 0 && (_jsx(Badge, { className: "text-xs", children: dayEvents.length }))] }), _jsxs("div", { className: "space-y-1", children: [dayEvents.slice(0, 2).map((event) => (_jsxs("div", { className: "text-xs truncate flex items-center", onClick: (e) => {
                                                            e.stopPropagation();
                                                            setSelectedEvent(event);
                                                        }, children: [_jsx("div", { className: `h-2 w-2 rounded-full mr-1 ${getEventColor(event.type)}` }), event.title] }, event.id))), dayEvents.length > 2 && (_jsxs("div", { className: "text-xs text-gray-500", children: ["+", dayEvents.length - 2, " ", language === 'Español' ? 'más' : 'more'] }))] })] }, day.toString()));
                                })] }), _jsx("div", { className: "flex justify-center mt-4", children: _jsx(Button, { variant: "outline", size: "sm", onClick: goToCurrentMonth, children: language === 'Español' ? 'Hoy' : 'Today' }) })] })) : (_jsx(ScrollArea, { className: "h-[400px]", children: loading ? (_jsx("div", { className: "flex justify-center items-center h-40", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" }) })) : events.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-40 p-4 text-gray-500", children: [_jsx(CalendarIcon, { className: "h-10 w-10 mb-2 text-gray-400" }), _jsx("p", { children: language === 'Español' ? 'No hay eventos programados' : 'No scheduled events' })] })) : (_jsx("div", { className: "divide-y", children: events
                            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                            .map((event) => (_jsx("div", { className: "p-4 hover:bg-gray-50 cursor-pointer", onClick: () => setSelectedEvent(event), children: _jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: `h-2 w-2 mt-1.5 rounded-full mr-2 ${getEventColor(event.type)}` }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "font-medium", children: event.title }), _jsxs("div", { className: "flex items-center gap-2 mt-1 text-sm text-gray-500", children: [_jsx(Clock, { className: "h-4 w-4" }), _jsx("span", { children: formatEventDate(event.startDate, event.endDate) })] }), _jsxs("div", { className: "flex items-center gap-2 mt-1 text-sm text-gray-500", children: [_jsx(MapPin, { className: "h-4 w-4" }), _jsx("span", { children: event.location })] }), event.maxAttendees && (_jsxs("div", { className: "flex items-center gap-2 mt-1 text-sm text-gray-500", children: [_jsx(Users, { className: "h-4 w-4" }), _jsxs("span", { children: [countAttendees(event, 'attending'), "/", event.maxAttendees, " ", language === 'Español' ? 'asistentes' : 'attendees'] })] })), _jsx("div", { className: "mt-2", children: getUserAttendanceStatus(event) === 'attending' ? (_jsx(Badge, { className: "bg-green-500", children: language === 'Español' ? 'Asistiré' : 'Attending' })) : getUserAttendanceStatus(event) === 'not_attending' ? (_jsx(Badge, { variant: "outline", className: "text-red-500 border-red-500", children: language === 'Español' ? 'No asistiré' : 'Not attending' })) : getUserAttendanceStatus(event) === 'maybe' ? (_jsx(Badge, { variant: "outline", className: "text-yellow-500 border-yellow-500", children: language === 'Español' ? 'Tal vez' : 'Maybe' })) : (_jsx(Badge, { variant: "outline", children: language === 'Español' ? 'Sin confirmar' : 'Not confirmed' })) })] })] }) }, event.id))) })) })) }), _jsxs(CardFooter, { className: "flex justify-between py-2 px-4 border-t", children: [_jsxs("div", { className: "text-xs text-gray-500", children: [events.length, " ", language === 'Español' ? 'eventos' : 'events'] }), _jsx(Button, { variant: "ghost", size: "sm", className: "h-7 text-xs", onClick: goToCurrentMonth, children: language === 'Español' ? 'Ir a hoy' : 'Go to today' })] }), selectedEvent && (_jsx(Dialog, { open: !!selectedEvent, onOpenChange: (open) => !open && setSelectedEvent(null), children: _jsxs(DialogContent, { className: "sm:max-w-md", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: selectedEvent.title }), _jsx(DialogDescription, { children: formatEventDate(selectedEvent.startDate, selectedEvent.endDate) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-start gap-2", children: [_jsx(MapPin, { className: "h-5 w-5 text-gray-500 mt-0.5" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-sm", children: language === 'Español' ? 'Ubicación' : 'Location' }), _jsx("div", { children: selectedEvent.location })] })] }), _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Users, { className: "h-5 w-5 text-gray-500 mt-0.5" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-sm", children: language === 'Español' ? 'Asistentes' : 'Attendees' }), _jsxs("div", { className: "flex gap-2 mt-1", children: [_jsxs(Badge, { className: "bg-green-500", children: [countAttendees(selectedEvent, 'attending'), " ", language === 'Español' ? 'asistirán' : 'attending'] }), _jsxs(Badge, { variant: "outline", className: "text-yellow-500 border-yellow-500", children: [countAttendees(selectedEvent, 'maybe'), " ", language === 'Español' ? 'tal vez' : 'maybe'] }), _jsxs(Badge, { variant: "outline", className: "text-red-500 border-red-500", children: [countAttendees(selectedEvent, 'not_attending'), " ", language === 'Español' ? 'no asistirán' : 'not attending'] })] }), selectedEvent.maxAttendees && (_jsxs("div", { className: "text-sm mt-1", children: [language === 'Español' ? 'Capacidad máxima: ' : 'Maximum capacity: ', selectedEvent.maxAttendees] }))] })] }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-sm mb-1", children: language === 'Español' ? 'Descripción' : 'Description' }), _jsx("p", { className: "text-sm", children: selectedEvent.description })] }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-sm mb-2", children: language === 'Español' ? '¿Asistirás a este evento?' : 'Will you attend this event?' }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: getUserAttendanceStatus(selectedEvent) === 'attending' ? 'default' : 'outline', size: "sm", onClick: () => confirmAttendance(selectedEvent.id, 'attending'), disabled: isEventFull(selectedEvent) && getUserAttendanceStatus(selectedEvent) !== 'attending', children: language === 'Español' ? 'Asistiré' : 'Attending' }), _jsx(Button, { variant: getUserAttendanceStatus(selectedEvent) === 'maybe' ? 'default' : 'outline', size: "sm", onClick: () => confirmAttendance(selectedEvent.id, 'maybe'), children: language === 'Español' ? 'Tal vez' : 'Maybe' }), _jsx(Button, { variant: getUserAttendanceStatus(selectedEvent) === 'not_attending' ? 'default' : 'outline', size: "sm", onClick: () => confirmAttendance(selectedEvent.id, 'not_attending'), children: language === 'Español' ? 'No asistiré' : 'Not attending' })] }), isEventFull(selectedEvent) && getUserAttendanceStatus(selectedEvent) !== 'attending' && (_jsx("div", { className: "text-sm text-red-500 mt-2", children: language === 'Español' ? 'Este evento está completo' : 'This event is full' }))] })] }), _jsx(DialogFooter, { children: _jsx(Button, { variant: "outline", onClick: () => setSelectedEvent(null), children: language === 'Español' ? 'Cerrar' : 'Close' }) })] }) }))] }));
}
