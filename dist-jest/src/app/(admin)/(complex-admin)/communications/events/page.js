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
import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { getCommunityEvents, createCommunityEvent, updateCommunityEvent, deleteCommunityEvent } from '@/services/communityEventService';
export default function CommunityEventsPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDateTime: '',
        endDateTime: '',
        location: '',
        isPublic: true,
    });
    const fetchEvents = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const data = yield getCommunityEvents();
            setEvents(data);
        }
        catch (error) {
            console.error('Error fetching community events:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar los eventos comunitarios.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    }), [toast]);
    useEffect(() => {
        if (!authLoading && user) {
            fetchEvents();
        }
    }, [authLoading, user, fetchEvents]);
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: type === 'checkbox' ? e.target.checked : value })));
    };
    const handleAddEvent = () => {
        setCurrentEvent(null);
        setFormData({
            title: '',
            description: '',
            startDateTime: new Date().toISOString().slice(0, 16),
            endDateTime: new Date().toISOString().slice(0, 16),
            location: '',
            isPublic: true,
        });
        setIsModalOpen(true);
    };
    const handleEditEvent = (event) => {
        setCurrentEvent(event);
        setFormData({
            title: event.title,
            description: event.description || '',
            startDateTime: new Date(event.startDateTime).toISOString().slice(0, 16),
            endDateTime: new Date(event.endDateTime).toISOString().slice(0, 16),
            location: event.location,
            isPublic: event.isPublic,
        });
        setIsModalOpen(true);
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        try {
            if (currentEvent) {
                yield updateCommunityEvent(currentEvent.id, formData);
                toast({
                    title: 'Éxito',
                    description: 'Evento comunitario actualizado correctamente.',
                });
            }
            else {
                yield createCommunityEvent(formData);
                toast({
                    title: 'Éxito',
                    description: 'Evento comunitario creado correctamente.',
                });
            }
            setIsModalOpen(false);
            fetchEvents();
        }
        catch (error) {
            console.error('Error saving community event:', error);
            toast({
                title: 'Error',
                description: 'Error al guardar el evento comunitario.',
                variant: 'destructive',
            });
        }
    });
    const handleDeleteEvent = (id) => __awaiter(this, void 0, void 0, function* () {
        if (confirm('¿Estás seguro de que quieres eliminar este evento comunitario?')) {
            try {
                yield deleteCommunityEvent(id);
                toast({
                    title: 'Éxito',
                    description: 'Evento comunitario eliminado correctamente.',
                });
                fetchEvents();
            }
            catch (error) {
                console.error('Error deleting community event:', error);
                toast({
                    title: 'Error',
                    description: 'Error al eliminar el evento comunitario.',
                    variant: 'destructive',
                });
            }
        }
    });
    if (authLoading || loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    if (!user || (user.role !== 'ADMIN' && user.role !== 'COMPLEX_ADMIN')) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Acceso Denegado" }), _jsx("p", { className: "text-gray-600", children: "No tienes permisos para acceder a esta p\u00E1gina." })] }) }));
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Gesti\u00F3n de Eventos Comunitarios" }), _jsx("div", { className: "flex justify-end mb-4", children: _jsxs(Button, { onClick: handleAddEvent, children: [_jsx(PlusCircle, { className: "mr-2 h-4 w-4" }), " Crear Evento"] }) }), _jsx("div", { className: "bg-white shadow-md rounded-lg overflow-hidden", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "T\u00EDtulo" }), _jsx(TableHead, { children: "Descripci\u00F3n" }), _jsx(TableHead, { children: "Inicio" }), _jsx(TableHead, { children: "Fin" }), _jsx(TableHead, { children: "Ubicaci\u00F3n" }), _jsx(TableHead, { children: "P\u00FAblico" }), _jsx(TableHead, {})] }) }), _jsx(TableBody, { children: events.length > 0 ? (events.map((event) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: event.title }), _jsx(TableCell, { children: event.description }), _jsx(TableCell, { children: new Date(event.startDateTime).toLocaleString() }), _jsx(TableCell, { children: new Date(event.endDateTime).toLocaleString() }), _jsx(TableCell, { children: event.location }), _jsx(TableCell, { children: event.isPublic ? _jsx(Badge, { variant: "default", children: "S\u00ED" }) : _jsx(Badge, { variant: "destructive", children: "No" }) }), _jsxs(TableCell, { className: "text-right", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleEditEvent(event), className: "mr-2", children: _jsx(Edit, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDeleteEvent(event.id), children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }, event.id)))) : (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 7, className: "text-center py-5", children: "No hay eventos comunitarios registrados." }) })) })] }) })] }));
}
