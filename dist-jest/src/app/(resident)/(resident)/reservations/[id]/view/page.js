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
import { Edit } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Loader2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { getReservations } from '@/services/reservationService';
export default function ViewResidentReservationPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const reservationId = params.id ? parseInt(params.id) : null;
    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchReservation = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            // For simplicity, fetching all and filtering. In a real app, you'd have a getReservationById endpoint.
            const data = yield getReservations();
            const foundReservation = data.find((r) => r.id === reservationId);
            if (foundReservation) {
                setReservation(foundReservation);
            }
            else {
                toast({
                    title: 'Error',
                    description: 'Reserva no encontrada.',
                    variant: 'destructive',
                });
                router.push('/resident/reservations');
            }
        }
        catch (error) {
            console.error('Error fetching reservation:', error);
            toast({
                title: 'Error',
                description: 'No se pudo cargar la reserva.',
                variant: 'destructive',
            });
            router.push('/resident/reservations');
        }
        finally {
            setLoading(false);
        }
    }), [reservationId, router, toast]);
    useEffect(() => {
        if (!authLoading && user && reservationId) {
            fetchReservation();
        }
    }, [authLoading, user, reservationId, fetchReservation]);
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    };
    if (authLoading || loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    if (!user) {
        return null; // Redirect handled by AuthLayout
    }
    if (!reservation) {
        return null; // Should not happen due to redirects above
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900", children: ["Detalles de la Reserva: ", reservation.title] }), _jsxs("div", { className: "flex space-x-2", children: [reservation.status === 'PENDING' && (_jsx(Link, { href: `/resident/reservations/${reservation.id}/edit`, children: _jsxs(Button, { variant: "outline", children: [_jsx(Edit, { className: "mr-2 h-4 w-4" }), " Editar Reserva"] }) })), reservation.requiresPayment && reservation.paymentStatus !== 'PAID' && (_jsx(Link, { href: `/resident/reservations/${reservation.id}/pay`, children: _jsxs(Button, { children: [_jsx(CreditCard, { className: "mr-2 h-4 w-4" }), " Realizar Pago"] }) }))] })] }), _jsxs(Card, { className: "mb-6", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Informaci\u00F3n de la Reserva" }) }), _jsxs(CardContent, { className: "grid gap-4", children: [_jsxs("p", { children: [_jsx("strong", { children: "\u00C1rea Com\u00FAn:" }), " ", reservation.commonAreaName] }), _jsxs("p", { children: [_jsx("strong", { children: "Descripci\u00F3n:" }), " ", reservation.description || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Inicio:" }), " ", new Date(reservation.startDateTime).toLocaleString()] }), _jsxs("p", { children: [_jsx("strong", { children: "Fin:" }), " ", new Date(reservation.endDateTime).toLocaleString()] }), _jsxs("p", { children: [_jsx("strong", { children: "Asistentes:" }), " ", reservation.attendees] }), _jsxs("p", { children: [_jsx("strong", { children: "Estado:" }), _jsx(Badge, { variant: reservation.status === 'APPROVED' ? 'default' : reservation.status === 'PENDING' ? 'secondary' : 'destructive', children: reservation.status })] }), reservation.requiresPayment && (_jsxs("p", { children: [_jsx("strong", { children: "Monto a Pagar:" }), " ", formatCurrency(reservation.paymentAmount || 0)] })), reservation.requiresPayment && (_jsxs("p", { children: [_jsx("strong", { children: "Estado del Pago:" }), _jsx(Badge, { variant: reservation.paymentStatus === 'PAID' ? 'default' : 'secondary', children: reservation.paymentStatus || 'PENDING' })] })), reservation.rejectionReason && (_jsxs("p", { children: [_jsx("strong", { children: "Raz\u00F3n de Rechazo:" }), " ", reservation.rejectionReason] })), reservation.cancellationReason && (_jsxs("p", { children: [_jsx("strong", { children: "Raz\u00F3n de Cancelaci\u00F3n:" }), " ", reservation.cancellationReason] })), _jsxs("p", { children: [_jsx("strong", { children: "Reservado por:" }), " ", reservation.userName, " (Propiedad: ", reservation.unitNumber, ")"] }), _jsxs("p", { children: [_jsx("strong", { children: "Fecha de Creaci\u00F3n:" }), " ", new Date(reservation.createdAt).toLocaleString()] }), _jsxs("p", { children: [_jsx("strong", { children: "\u00DAltima Actualizaci\u00F3n:" }), " ", new Date(reservation.updatedAt).toLocaleString()] })] })] })] }));
}
