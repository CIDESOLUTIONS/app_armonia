// src/components/reservations/CommonAreaReservationImproved.tsx
'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, Calendar as CalendarIcon, Clock, MapPin, Users, DollarSign, CreditCard, Plus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useSession } from 'next-auth/react';
import { useReservationsWithPayments } from '@/hooks/useReservationsWithPayments';
import PaymentModal from './PaymentModal';
// Localización del calendario
moment.locale('es');
const localizer = momentLocalizer(moment);
const CommonAreaReservationImproved = () => {
    var _a, _b, _c;
    const { data: session } = useSession();
    const { toast } = useToast();
    // Usar el hook personalizado para manejar reservas con pagos
    const { 
    // Estados de datos
    commonAreas, selectedArea, myReservations, calendarEvents, viewDate, 
    // Estados de carga
    isLoading, isCreatingReservation, 
    // Estados de formulario
    reservationForm, 
    // Estados de UI
    isReservationDialogOpen, selectedReservation, isDetailDialogOpen, isPaymentModalOpen, 
    // Funciones de manejo de datos
    setSelectedArea, setViewDate, 
    // Funciones de formulario
    setReservationForm, 
    // Funciones de UI
    setIsReservationDialogOpen, setIsDetailDialogOpen, setIsPaymentModalOpen, 
    // Funciones de acciones
    handleCreateReservation, handleCancelReservation, handleEventClick, handleNewReservation, handlePaymentComplete } = useReservationsWithPayments();
    // Propiedades de ejemplo (en producción vendría de la API)
    const properties = [
        { id: 1, name: 'Apartamento 101' },
        { id: 2, name: 'Apartamento 102' }
    ];
    // Función para formatear moneda
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    };
    // Función para obtener el color del evento según el estado
    const eventStyleGetter = (event) => {
        let backgroundColor = '#3174ad';
        switch (event.status) {
            case 'APPROVED':
                backgroundColor = '#10b981';
                break;
            case 'PENDING':
                backgroundColor = '#f59e0b';
                break;
            case 'REJECTED':
                backgroundColor = '#ef4444';
                break;
            case 'CANCELLED':
                backgroundColor = '#6b7280';
                break;
            default:
                backgroundColor = '#3174ad';
        }
        return {
            style: {
                backgroundColor,
                borderRadius: '4px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        };
    };
    // Función para obtener badge del estado
    const getStatusBadge = (status) => {
        switch (status) {
            case 'APPROVED':
                return _jsx(Badge, { className: "bg-green-100 text-green-800 border-green-200", children: "Aprobada" });
            case 'PENDING':
                return _jsx(Badge, { className: "bg-yellow-100 text-yellow-800 border-yellow-200", children: "Pendiente" });
            case 'REJECTED':
                return _jsx(Badge, { className: "bg-red-100 text-red-800 border-red-200", children: "Rechazada" });
            case 'CANCELLED':
                return _jsx(Badge, { className: "bg-gray-100 text-gray-800 border-gray-200", children: "Cancelada" });
            case 'COMPLETED':
                return _jsx(Badge, { className: "bg-blue-100 text-blue-800 border-blue-200", children: "Completada" });
            default:
                return _jsx(Badge, { variant: "outline", children: status });
        }
    };
    // Función para obtener badge del pago
    const getPaymentBadge = (paymentStatus) => {
        switch (paymentStatus) {
            case 'COMPLETED':
                return _jsx(Badge, { className: "bg-green-100 text-green-800 border-green-200", children: "Pagado" });
            case 'PENDING':
                return _jsx(Badge, { className: "bg-yellow-100 text-yellow-800 border-yellow-200", children: "Pendiente" });
            case 'FAILED':
                return _jsx(Badge, { className: "bg-red-100 text-red-800 border-red-200", children: "Fallido" });
            default:
                return _jsx(Badge, { variant: "outline", children: "Sin pagar" });
        }
    };
    if (isLoading) {
        return (_jsxs("div", { className: "flex items-center justify-center h-96", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }), _jsx("span", { className: "ml-2", children: "Cargando \u00E1reas comunes..." })] }));
    }
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Reservas de \u00C1reas Comunes" }), _jsx("p", { className: "text-gray-600", children: "Administra tus reservas y pagos de instalaciones comunitarias" })] }), _jsxs(Button, { onClick: handleNewReservation, className: "bg-blue-600 hover:bg-blue-700", children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Nueva Reserva"] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Seleccionar \u00C1rea Com\u00FAn" }) }), _jsx(CardContent, { children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: commonAreas.map((area) => (_jsx(Card, { className: `cursor-pointer transition-all ${(selectedArea === null || selectedArea === void 0 ? void 0 : selectedArea.id) === area.id
                                    ? 'ring-2 ring-blue-500 bg-blue-50'
                                    : 'hover:bg-gray-50'}`, onClick: () => setSelectedArea(area), children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-medium", children: area.name }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: area.description }), _jsxs("div", { className: "flex items-center mt-2 text-xs text-gray-500", children: [_jsx(MapPin, { className: "h-3 w-3 mr-1" }), area.location, _jsx(Users, { className: "h-3 w-3 ml-3 mr-1" }), area.capacity, " personas"] }), area.hasFee && (_jsxs("div", { className: "flex items-center mt-2 text-sm font-medium text-green-600", children: [_jsx(DollarSign, { className: "h-4 w-4 mr-1" }), formatCurrency(area.feeAmount || 0)] }))] }), _jsxs("div", { className: "flex flex-col gap-1", children: [area.isActive ? (_jsx(Badge, { className: "bg-green-100 text-green-800 border-green-200", children: "Activo" })) : (_jsx(Badge, { variant: "outline", children: "Inactivo" })), area.requiresApproval && (_jsx(Badge, { variant: "outline", children: "Requiere aprobaci\u00F3n" }))] })] }) }) }, area.id))) }) })] }), selectedArea && (_jsxs(Tabs, { defaultValue: "calendar", className: "space-y-4", children: [_jsxs(TabsList, { children: [_jsxs(TabsTrigger, { value: "calendar", children: [_jsx(CalendarIcon, { className: "h-4 w-4 mr-2" }), "Calendario"] }), _jsxs(TabsTrigger, { value: "myReservations", children: ["Mis Reservas (", myReservations.length, ")"] })] }), _jsx(TabsContent, { value: "calendar", className: "space-y-4", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { children: ["Disponibilidad - ", selectedArea.name] }), _jsx(CardDescription, { children: "Haz clic en una fecha libre para crear una nueva reserva" })] }), _jsx(CardContent, { children: _jsx("div", { style: { height: '600px' }, children: _jsx(Calendar, { localizer: localizer, events: calendarEvents, startAccessor: "start", endAccessor: "end", onSelectEvent: handleEventClick, eventPropGetter: eventStyleGetter, views: ['month', 'week', 'day'], defaultView: "month", date: viewDate, onNavigate: setViewDate, culture: "es", messages: {
                                                next: 'Siguiente',
                                                previous: 'Anterior',
                                                today: 'Hoy',
                                                month: 'Mes',
                                                week: 'Semana',
                                                day: 'Día',
                                                date: 'Fecha',
                                                time: 'Hora',
                                                event: 'Evento',
                                                showMore: (total) => `+ Ver más (${total})`
                                            } }) }) })] }) }), _jsx(TabsContent, { value: "myReservations", className: "space-y-4", children: _jsx("div", { className: "grid gap-4", children: myReservations.length === 0 ? (_jsx(Card, { children: _jsxs(CardContent, { className: "p-8 text-center", children: [_jsx(CalendarIcon, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No tienes reservas" }), _jsx("p", { className: "text-gray-600", children: "Crea tu primera reserva para comenzar" })] }) })) : (myReservations.map((reservation) => (_jsx(Card, { children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-medium mb-2", children: reservation.title }), _jsxs("div", { className: "space-y-1 text-sm text-gray-600", children: [_jsxs("p", { className: "flex items-center", children: [_jsx(CalendarIcon, { className: "h-4 w-4 mr-2" }), format(new Date(reservation.startDateTime), 'PPP', { locale: es })] }), _jsxs("p", { className: "flex items-center", children: [_jsx(Clock, { className: "h-4 w-4 mr-2" }), format(new Date(reservation.startDateTime), 'HH:mm'), " -", format(new Date(reservation.endDateTime), 'HH:mm')] }), _jsxs("p", { className: "flex items-center", children: [_jsx(Users, { className: "h-4 w-4 mr-2" }), reservation.attendees, " asistentes"] }), reservation.requiresPayment && (_jsxs("p", { className: "flex items-center", children: [_jsx(CreditCard, { className: "h-4 w-4 mr-2" }), formatCurrency(reservation.paymentAmount || 0)] }))] })] }), _jsxs("div", { className: "flex flex-col gap-2 items-end", children: [getStatusBadge(reservation.status), reservation.requiresPayment && getPaymentBadge(reservation.paymentStatus), _jsxs("div", { className: "flex gap-2 mt-2", children: [reservation.requiresPayment && reservation.paymentStatus !== 'COMPLETED' && (_jsxs(Button, { size: "sm", variant: "outline", className: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100", onClick: () => {
                                                                    setSelectedReservation(reservation);
                                                                    setIsPaymentModalOpen(true);
                                                                }, children: [_jsx(CreditCard, { className: "h-4 w-4 mr-1" }), "Pagar"] })), _jsx(Button, { size: "sm", variant: "outline", onClick: () => {
                                                                    setSelectedReservation(reservation);
                                                                    setIsDetailDialogOpen(true);
                                                                }, children: "Ver detalles" })] })] })] }) }) }, reservation.id)))) }) })] })), _jsx(Dialog, { open: isReservationDialogOpen, onOpenChange: setIsReservationDialogOpen, children: _jsxs(DialogContent, { className: "max-w-md", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { children: ["Nueva Reserva - ", selectedArea === null || selectedArea === void 0 ? void 0 : selectedArea.name] }), _jsx(DialogDescription, { children: "Complete los detalles de su reserva" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "title", children: "T\u00EDtulo de la reserva" }), _jsx(Input, { id: "title", value: reservationForm.title, onChange: (e) => setReservationForm(Object.assign(Object.assign({}, reservationForm), { title: e.target.value })), placeholder: "Ej: Reuni\u00F3n familiar" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "description", children: "Descripci\u00F3n (opcional)" }), _jsx(Textarea, { id: "description", value: reservationForm.description, onChange: (e) => setReservationForm(Object.assign(Object.assign({}, reservationForm), { description: e.target.value })), placeholder: "Detalles adicionales...", className: "min-h-[80px]" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "startDateTime", children: "Fecha y hora inicio" }), _jsx(Input, { id: "startDateTime", type: "datetime-local", value: reservationForm.startDateTime, onChange: (e) => setReservationForm(Object.assign(Object.assign({}, reservationForm), { startDateTime: e.target.value })) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "endDateTime", children: "Fecha y hora fin" }), _jsx(Input, { id: "endDateTime", type: "datetime-local", value: reservationForm.endDateTime, onChange: (e) => setReservationForm(Object.assign(Object.assign({}, reservationForm), { endDateTime: e.target.value })) })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "attendees", children: "N\u00FAmero de asistentes" }), _jsx(Input, { id: "attendees", type: "number", min: "1", max: (selectedArea === null || selectedArea === void 0 ? void 0 : selectedArea.capacity) || 50, value: reservationForm.attendees, onChange: (e) => setReservationForm(Object.assign(Object.assign({}, reservationForm), { attendees: parseInt(e.target.value) || 1 })) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "property", children: "Propiedad" }), _jsxs(Select, { value: reservationForm.propertyId.toString(), onValueChange: (value) => setReservationForm(Object.assign(Object.assign({}, reservationForm), { propertyId: parseInt(value) })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Seleccionar..." }) }), _jsx(SelectContent, { children: properties.map((property) => (_jsx(SelectItem, { value: property.id.toString(), children: property.name }, property.id))) })] })] })] }), (selectedArea === null || selectedArea === void 0 ? void 0 : selectedArea.hasFee) && (_jsxs(Alert, { children: [_jsx(DollarSign, { className: "h-4 w-4" }), _jsx(AlertTitle, { children: "Informaci\u00F3n de pago" }), _jsxs(AlertDescription, { children: ["Esta reserva requiere un pago de ", formatCurrency(selectedArea.feeAmount || 0), ". Podr\u00E1s completar el pago despu\u00E9s de crear la reserva."] })] })), (selectedArea === null || selectedArea === void 0 ? void 0 : selectedArea.requiresApproval) && (_jsxs(Alert, { children: [_jsx(AlertCircle, { className: "h-4 w-4" }), _jsx(AlertTitle, { children: "Requiere aprobaci\u00F3n" }), _jsx(AlertDescription, { children: "Esta reserva debe ser aprobada por el administrador antes de ser confirmada." })] }))] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setIsReservationDialogOpen(false), children: "Cancelar" }), _jsx(Button, { onClick: handleCreateReservation, disabled: isCreatingReservation || !reservationForm.title || !reservationForm.startDateTime || !reservationForm.endDateTime, children: isCreatingReservation ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" }), "Creando..."] })) : ('Crear Reserva') })] })] }) }), _jsx(Dialog, { open: isDetailDialogOpen, onOpenChange: setIsDetailDialogOpen, children: _jsxs(DialogContent, { className: "max-w-md", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Detalles de la Reserva" }) }), selectedReservation && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [_jsx("h4", { className: "font-medium mb-2", children: selectedReservation.title }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("p", { children: [_jsx("strong", { children: "\u00C1rea:" }), " ", (_a = selectedReservation.commonArea) === null || _a === void 0 ? void 0 : _a.name] }), _jsxs("p", { children: [_jsx("strong", { children: "Fecha:" }), " ", format(new Date(selectedReservation.startDateTime), 'PPP', { locale: es })] }), _jsxs("p", { children: [_jsx("strong", { children: "Hora:" }), " ", format(new Date(selectedReservation.startDateTime), 'HH:mm'), " - ", format(new Date(selectedReservation.endDateTime), 'HH:mm')] }), _jsxs("p", { children: [_jsx("strong", { children: "Asistentes:" }), " ", selectedReservation.attendees] }), selectedReservation.description && (_jsxs("p", { children: [_jsx("strong", { children: "Descripci\u00F3n:" }), " ", selectedReservation.description] }))] })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium", children: "Estado:" }), getStatusBadge(selectedReservation.status)] }), selectedReservation.requiresPayment && (_jsxs(_Fragment, { children: [_jsx(Separator, {}), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium", children: "Estado del pago:" }), getPaymentBadge(selectedReservation.paymentStatus)] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium", children: "Monto:" }), _jsx("span", { className: "font-semibold text-green-600", children: formatCurrency(selectedReservation.paymentAmount || 0) })] })] })] })), selectedReservation.rejectionReason && (_jsxs(Alert, { variant: "destructive", children: [_jsx(AlertCircle, { className: "h-4 w-4" }), _jsx(AlertTitle, { children: "Raz\u00F3n del rechazo" }), _jsx(AlertDescription, { children: selectedReservation.rejectionReason })] }))] })), _jsx(DialogFooter, { children: _jsxs("div", { className: "flex gap-2 w-full", children: [(selectedReservation === null || selectedReservation === void 0 ? void 0 : selectedReservation.requiresPayment) &&
                                        (selectedReservation === null || selectedReservation === void 0 ? void 0 : selectedReservation.paymentStatus) !== 'COMPLETED' && (_jsxs(Button, { className: "flex-1 bg-green-600 hover:bg-green-700", onClick: () => {
                                            setIsDetailDialogOpen(false);
                                            setIsPaymentModalOpen(true);
                                        }, children: [_jsx(CreditCard, { className: "h-4 w-4 mr-2" }), "Pagar Ahora"] })), (selectedReservation === null || selectedReservation === void 0 ? void 0 : selectedReservation.status) === 'PENDING' && (_jsx(Button, { variant: "destructive", className: "flex-1", onClick: () => selectedReservation && handleCancelReservation(selectedReservation.id), children: "Cancelar Reserva" })), _jsx(Button, { variant: "outline", onClick: () => setIsDetailDialogOpen(false), children: "Cerrar" })] }) })] }) }), selectedReservation && (_jsx(PaymentModal, { isOpen: isPaymentModalOpen, onClose: () => setIsPaymentModalOpen(false), reservation: {
                    id: selectedReservation.id,
                    title: selectedReservation.title,
                    commonArea: {
                        name: ((_b = selectedReservation.commonArea) === null || _b === void 0 ? void 0 : _b.name) || '',
                        feeAmount: (_c = selectedReservation.commonArea) === null || _c === void 0 ? void 0 : _c.feeAmount
                    },
                    startDateTime: selectedReservation.startDateTime,
                    endDateTime: selectedReservation.endDateTime,
                    paymentStatus: selectedReservation.paymentStatus,
                    requiresPayment: selectedReservation.requiresPayment
                }, onPaymentComplete: handlePaymentComplete }))] }));
};
export default CommonAreaReservationImproved;
