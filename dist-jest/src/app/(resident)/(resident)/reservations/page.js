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
import { Loader2, PlusCircle, Eye, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { getReservations } from '@/services/reservationService';
export default function ResidentReservationsPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchReservations = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const data = yield getReservations(); // This will fetch only resident's reservations due to authMiddleware
            setReservations(data);
        }
        catch (error) {
            console.error('Error fetching resident reservations:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar tus reservas.',
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
    if (authLoading || loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    if (!user) {
        return null; // Redirect handled by AuthLayout
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Mis Reservas de \u00C1reas Comunes" }), _jsx("div", { className: "flex justify-end mb-4", children: _jsx(Link, { href: "/resident/reservations/create", children: _jsxs(Button, { children: [_jsx(PlusCircle, { className: "mr-2 h-4 w-4" }), " Crear Nueva Reserva"] }) }) }), _jsx("div", { className: "bg-white shadow-md rounded-lg overflow-hidden", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "\u00C1rea Com\u00FAn" }), _jsx(TableHead, { children: "T\u00EDtulo" }), _jsx(TableHead, { children: "Inicio" }), _jsx(TableHead, { children: "Fin" }), _jsx(TableHead, { children: "Estado" }), _jsx(TableHead, {})] }) }), _jsx(TableBody, { children: reservations.length > 0 ? (reservations.map((reservation) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: reservation.commonAreaName }), _jsx(TableCell, { children: reservation.title }), _jsx(TableCell, { children: new Date(reservation.startDateTime).toLocaleString() }), _jsx(TableCell, { children: new Date(reservation.endDateTime).toLocaleString() }), _jsx(TableCell, { children: _jsx(Badge, { variant: reservation.status === 'APPROVED' ? 'default' : reservation.status === 'PENDING' ? 'secondary' : 'destructive', children: reservation.status }) }), _jsxs(TableCell, { className: "text-right", children: [_jsx(Link, { href: `/resident/reservations/${reservation.id}/view`, children: _jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Eye, { className: "h-4 w-4" }) }) }), reservation.requiresPayment && reservation.paymentStatus !== 'PAID' && (_jsx(Link, { href: `/resident/reservations/${reservation.id}/pay`, children: _jsx(Button, { variant: "ghost", size: "sm", className: "ml-2", children: _jsx(DollarSign, { className: "h-4 w-4 text-green-600" }) }) }))] })] }, reservation.id)))) : (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 6, className: "text-center py-5", children: "No tienes reservas registradas." }) })) })] }) })] }));
}
