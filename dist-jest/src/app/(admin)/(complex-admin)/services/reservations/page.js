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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Loader2, Trash2, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { getReservations, updateReservationStatus, deleteReservation } from '@/services/reservationService';
export default function ReservationsPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchReservations = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const data = yield getReservations();
            setReservations(data);
        }
        catch (error) {
            console.error('Error fetching reservations:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar las reservas.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    }), [toast]);
    useEffect(() => {
        if (!authLoading && user) {
            fetchReservations();
        }
    }, [authLoading, user, fetchReservations]);
    const handleUpdateStatus = (id, status) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield updateReservationStatus(id, status);
            toast({
                title: 'Éxito',
                description: `Reserva ${status === 'APPROVED' ? 'aprobada' : 'rechazada'} correctamente.`,
            });
            fetchReservations();
        }
        catch (error) {
            console.error('Error updating reservation status:', error);
            toast({
                title: 'Error',
                description: 'Error al actualizar el estado de la reserva.',
                variant: 'destructive',
            });
        }
    });
    const handleDeleteReservation = (id) => __awaiter(this, void 0, void 0, function* () {
        if (confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
            try {
                yield deleteReservation(id);
                toast({
                    title: 'Éxito',
                    description: 'Reserva eliminada correctamente.',
                });
                fetchReservations();
            }
            catch (error) {
                console.error('Error deleting reservation:', error);
                toast({
                    title: 'Error',
                    description: 'Error al eliminar la reserva.',
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
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Gesti\u00F3n de Reservas" }), _jsx("div", { className: "bg-white shadow-md rounded-lg overflow-hidden", children: _jsxs("table", { className: "min-w-full leading-normal", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "\u00C1rea Com\u00FAn" }), _jsx("th", { className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Usuario" }), _jsx("th", { className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Propiedad" }), _jsx("th", { className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "T\u00EDtulo" }), _jsx("th", { className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Inicio" }), _jsx("th", { className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Fin" }), _jsx("th", { className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Estado" }), _jsx("th", { className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100" })] }) }), _jsxs("tbody", { children: [reservations.map((reservation) => (_jsxs("tr", { children: [_jsx("td", { className: "px-5 py-5 border-b border-gray-200 bg-white text-sm", children: reservation.commonAreaName }), _jsx("td", { className: "px-5 py-5 border-b border-gray-200 bg-white text-sm", children: reservation.userName }), _jsx("td", { className: "px-5 py-5 border-b border-gray-200 bg-white text-sm", children: reservation.unitNumber }), _jsx("td", { className: "px-5 py-5 border-b border-gray-200 bg-white text-sm", children: reservation.title }), _jsx("td", { className: "px-5 py-5 border-b border-gray-200 bg-white text-sm", children: new Date(reservation.startDateTime).toLocaleString() }), _jsx("td", { className: "px-5 py-5 border-b border-gray-200 bg-white text-sm", children: new Date(reservation.endDateTime).toLocaleString() }), _jsx("td", { className: "px-5 py-5 border-b border-gray-200 bg-white text-sm", children: _jsx(Badge, { variant: reservation.status === 'APPROVED' ? 'default' : reservation.status === 'PENDING' ? 'secondary' : 'destructive', children: reservation.status }) }), _jsxs("td", { className: "px-5 py-5 border-b border-gray-200 bg-white text-sm text-right", children: [_jsx(Link, { href: `/admin/services/reservations/${reservation.id}/view`, children: _jsx(Button, { variant: "ghost", size: "sm", className: "mr-2", children: _jsx(Eye, { className: "h-4 w-4" }) }) }), reservation.status === 'PENDING' && (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleUpdateStatus(reservation.id, 'APPROVED'), className: "mr-2", children: _jsx(CheckCircle, { className: "h-4 w-4 text-green-600" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleUpdateStatus(reservation.id, 'REJECTED'), className: "mr-2", children: _jsx(XCircle, { className: "h-4 w-4 text-red-600" }) })] })), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDeleteReservation(reservation.id), children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }, reservation.id))), reservations.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 8, className: "px-5 py-5 border-b border-gray-200 bg-white text-sm text-center", children: "No hay reservas registradas." }) }))] })] }) })] }));
}
