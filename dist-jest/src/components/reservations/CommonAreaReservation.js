'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, Calendar as CalendarIcon, Clock, Info, MapPin, Users } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useSession } from 'next-auth/react';
import { useReservationsWithPayments } from '@/hooks/useReservationsWithPayments';
// Localización del calendario
moment.locale('es');
const localizer = momentLocalizer(moment);
const CommonAreaReservation = () => {
    var _a;
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
    setSelectedArea, setViewDate, fetchReservations, 
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
    // Función para cambiar el área común seleccionada
    const handleAreaChange = (areaId) => {
        const area = commonAreas.find(a => a.id === parseInt(areaId));
        if (area) {
            setSelectedArea(area);
        }
    };
    // Función para renderizar eventos en el calendario
    const eventStyleGetter = (event) => {
        let backgroundColor = '#3182ce';
        let borderColor = '#2b6cb0';
        switch (event.status) {
            case 'PENDING':
                backgroundColor = '#ed8936';
                borderColor = '#dd6b20';
                break;
            case 'APPROVED':
                backgroundColor = '#38a169';
                borderColor = '#2f855a';
                break;
            case 'REJECTED':
                backgroundColor = '#e53e3e';
                borderColor = '#c53030';
                break;
            case 'CANCELLED':
                backgroundColor = '#718096';
                borderColor = '#4a5568';
                break;
        }
        return {
            style: {
                backgroundColor,
                borderColor,
                borderWidth: '1px',
                color: 'white',
                display: 'block',
                padding: '2px 5px',
                borderRadius: '4px'
            }
        };
    };
    // Función para obtener el estado de una reserva en español
    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING': return 'Pendiente';
            case 'APPROVED': return 'Aprobada';
            case 'REJECTED': return 'Rechazada';
            case 'CANCELLED': return 'Cancelada';
            case 'COMPLETED': return 'Completada';
            default: return status;
        }
    };
    // Función para obtener el color de estado
    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-orange-500';
            case 'APPROVED': return 'bg-green-500';
            case 'REJECTED': return 'bg-red-500';
            case 'CANCELLED': return 'bg-gray-500';
            case 'COMPLETED': return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    };
    return (_jsxs("div", { className: "container mx-auto p-4", children: [_jsx("h1", { className: "text-2xl font-bold mb-6", children: "Reserva de \u00C1reas Comunes" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsxs("div", { className: "md:col-span-1", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "\u00C1reas Comunes" }), _jsx(CardDescription, { children: "Seleccione un \u00E1rea para reservar" })] }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "area-select", children: "\u00C1rea Com\u00FAn" }), _jsxs(Select, { value: selectedArea === null || selectedArea === void 0 ? void 0 : selectedArea.id.toString(), onValueChange: handleAreaChange, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Seleccione un \u00E1rea" }) }), _jsx(SelectContent, { children: commonAreas.map(area => (_jsx(SelectItem, { value: area.id.toString(), children: area.name }, area.id))) })] })] }), selectedArea && (_jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "font-medium", children: selectedArea.name }), _jsx("p", { className: "text-sm text-gray-500", children: selectedArea.description }), _jsxs("div", { className: "flex items-center text-sm text-gray-500", children: [_jsx(MapPin, { className: "h-4 w-4 mr-1" }), _jsx("span", { children: selectedArea.location })] }), _jsxs("div", { className: "flex items-center text-sm text-gray-500", children: [_jsx(Users, { className: "h-4 w-4 mr-1" }), _jsxs("span", { children: ["Capacidad: ", selectedArea.capacity, " personas"] })] }), selectedArea.hasFee && (_jsx("div", { className: "flex items-center text-sm text-gray-500", children: _jsxs("span", { children: ["Costo: $", selectedArea.feeAmount] }) })), selectedArea.requiresApproval && (_jsx("div", { className: "mt-2", children: _jsx(Badge, { variant: "outline", className: "bg-yellow-50 text-yellow-800 border-yellow-300", children: "Requiere aprobaci\u00F3n" }) }))] })), _jsx(Button, { className: "w-full", onClick: handleNewReservation, disabled: !selectedArea, children: "Nueva Reserva" })] }) })] }), _jsxs(Card, { className: "mt-4", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Mis Reservas" }), _jsx(CardDescription, { children: "Reservas activas y pendientes" })] }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-3", children: myReservations.length === 0 ? (_jsx("p", { className: "text-sm text-gray-500", children: "No tiene reservas activas" })) : (myReservations.map(reservation => (_jsxs("div", { className: "p-3 border rounded-md cursor-pointer hover:bg-gray-50", onClick: () => {
                                                    setSelectedReservation(reservation);
                                                    setIsDetailDialogOpen(true);
                                                }, children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsx("h4", { className: "font-medium", children: reservation.title }), _jsx(Badge, { className: getStatusColor(reservation.status), children: getStatusText(reservation.status) })] }), _jsxs("div", { className: "text-sm text-gray-500 mt-1", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(CalendarIcon, { className: "h-3 w-3 mr-1" }), _jsx("span", { children: format(new Date(reservation.startDateTime), 'dd/MM/yyyy', { locale: es }) })] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Clock, { className: "h-3 w-3 mr-1" }), _jsxs("span", { children: [format(new Date(reservation.startDateTime), 'HH:mm', { locale: es }), " -", format(new Date(reservation.endDateTime), 'HH:mm', { locale: es })] })] })] })] }, reservation.id)))) }) })] })] }), _jsx("div", { className: "md:col-span-3", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Calendario de Disponibilidad" }), _jsx(CardDescription, { children: selectedArea ? `Reservas para ${selectedArea.name}` : 'Seleccione un área común' })] }), _jsx(CardContent, { children: isLoading ? (_jsx("div", { className: "flex justify-center items-center h-96", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" }) })) : (_jsx("div", { className: "h-[600px]", children: _jsx(Calendar, { localizer: localizer, events: calendarEvents, startAccessor: "start", endAccessor: "end", style: { height: '100%' }, onSelectEvent: handleEventClick, eventPropGetter: eventStyleGetter, onNavigate: (date) => setViewDate(date), views: ['month', 'week', 'day'], messages: {
                                                next: 'Siguiente',
                                                previous: 'Anterior',
                                                today: 'Hoy',
                                                month: 'Mes',
                                                week: 'Semana',
                                                day: 'Día',
                                                agenda: 'Agenda',
                                                date: 'Fecha',
                                                time: 'Hora',
                                                event: 'Evento',
                                                noEventsInRange: 'No hay reservas en este período'
                                            } }) })) })] }) })] }), _jsx(Dialog, { open: isReservationDialogOpen, onOpenChange: setIsReservationDialogOpen, children: _jsxs(DialogContent, { className: "sm:max-w-[500px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Nueva Reserva" }), _jsx(DialogDescription, { children: "Complete el formulario para solicitar una reserva" })] }), _jsxs("div", { className: "space-y-4 py-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "title", children: "T\u00EDtulo" }), _jsx(Input, { id: "title", value: reservationForm.title, onChange: (e) => setReservationForm(Object.assign(Object.assign({}, reservationForm), { title: e.target.value })), placeholder: "Ej: Reuni\u00F3n familiar" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "description", children: "Descripci\u00F3n" }), _jsx(Textarea, { id: "description", value: reservationForm.description, onChange: (e) => setReservationForm(Object.assign(Object.assign({}, reservationForm), { description: e.target.value })), placeholder: "Detalles de la reserva", rows: 3 })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "startDateTime", children: "Fecha y hora de inicio" }), _jsx(Input, { id: "startDateTime", type: "datetime-local", value: reservationForm.startDateTime, onChange: (e) => setReservationForm(Object.assign(Object.assign({}, reservationForm), { startDateTime: e.target.value })) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "endDateTime", children: "Fecha y hora de fin" }), _jsx(Input, { id: "endDateTime", type: "datetime-local", value: reservationForm.endDateTime, onChange: (e) => setReservationForm(Object.assign(Object.assign({}, reservationForm), { endDateTime: e.target.value })) })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "attendees", children: "N\u00FAmero de asistentes" }), _jsx(Input, { id: "attendees", type: "number", min: "1", value: reservationForm.attendees, onChange: (e) => setReservationForm(Object.assign(Object.assign({}, reservationForm), { attendees: parseInt(e.target.value) })) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "property", children: "Propiedad" }), _jsxs(Select, { value: selectedProperty === null || selectedProperty === void 0 ? void 0 : selectedProperty.toString(), onValueChange: (value) => setSelectedProperty(parseInt(value)), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Seleccione una propiedad" }) }), _jsx(SelectContent, { children: properties.map(property => (_jsx(SelectItem, { value: property.id.toString(), children: property.name }, property.id))) })] })] })] }), (selectedArea === null || selectedArea === void 0 ? void 0 : selectedArea.requiresApproval) && (_jsxs(Alert, { children: [_jsx(AlertCircle, { className: "h-4 w-4" }), _jsx(AlertTitle, { children: "Requiere aprobaci\u00F3n" }), _jsx(AlertDescription, { children: "Esta \u00E1rea com\u00FAn requiere aprobaci\u00F3n de la administraci\u00F3n. Su reserva quedar\u00E1 en estado pendiente hasta ser aprobada." })] })), (selectedArea === null || selectedArea === void 0 ? void 0 : selectedArea.hasFee) && (_jsxs(Alert, { children: [_jsx(Info, { className: "h-4 w-4" }), _jsx(AlertTitle, { children: "\u00C1rea con costo" }), _jsxs(AlertDescription, { children: ["Esta \u00E1rea com\u00FAn tiene un costo de $", selectedArea.feeAmount, " por reserva."] })] }))] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setIsReservationDialogOpen(false), children: "Cancelar" }), _jsx(Button, { onClick: handleCreateReservation, children: (selectedArea === null || selectedArea === void 0 ? void 0 : selectedArea.requiresApproval) ? 'Solicitar Reserva' : 'Confirmar Reserva' })] })] }) }), _jsx(Dialog, { open: isDetailDialogOpen, onOpenChange: setIsDetailDialogOpen, children: _jsxs(DialogContent, { className: "sm:max-w-[500px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Detalle de Reserva" }), _jsx(DialogDescription, { children: "Informaci\u00F3n de la reserva seleccionada" })] }), selectedReservation && (_jsxs("div", { className: "space-y-4 py-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { className: "text-lg font-medium", children: selectedReservation.title }), _jsx(Badge, { className: getStatusColor(selectedReservation.status), children: getStatusText(selectedReservation.status) })] }), _jsx("p", { className: "text-sm text-gray-500", children: selectedReservation.description }), _jsx(Separator, {}), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium", children: "Fecha y hora de inicio" }), _jsx("p", { className: "text-sm text-gray-500", children: format(new Date(selectedReservation.startDateTime), 'dd/MM/yyyy HH:mm', { locale: es }) })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium", children: "Fecha y hora de fin" }), _jsx("p", { className: "text-sm text-gray-500", children: format(new Date(selectedReservation.endDateTime), 'dd/MM/yyyy HH:mm', { locale: es }) })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium", children: "\u00C1rea com\u00FAn" }), _jsx("p", { className: "text-sm text-gray-500", children: ((_a = selectedReservation.commonArea) === null || _a === void 0 ? void 0 : _a.name) || 'No disponible' })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium", children: "Asistentes" }), _jsx("p", { className: "text-sm text-gray-500", children: selectedReservation.attendees })] })] }), selectedReservation.requiresPayment && (_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium", children: "Pago" }), _jsxs("p", { className: "text-sm text-gray-500", children: ["$", selectedReservation.paymentAmount, " - ", selectedReservation.paymentStatus || 'Pendiente'] })] })), selectedReservation.rejectionReason && (_jsxs(Alert, { variant: "destructive", children: [_jsx(AlertCircle, { className: "h-4 w-4" }), _jsx(AlertTitle, { children: "Reserva rechazada" }), _jsx(AlertDescription, { children: selectedReservation.rejectionReason })] })), selectedReservation.cancellationReason && (_jsxs(Alert, { children: [_jsx(Info, { className: "h-4 w-4" }), _jsx(AlertTitle, { children: "Reserva cancelada" }), _jsx(AlertDescription, { children: selectedReservation.cancellationReason })] }))] })), _jsxs(DialogFooter, { children: [selectedReservation && ['PENDING', 'APPROVED'].includes(selectedReservation.status) && (_jsx(Button, { variant: "destructive", onClick: () => handleCancelReservation(selectedReservation.id), children: "Cancelar Reserva" })), _jsx(Button, { variant: "outline", onClick: () => setIsDetailDialogOpen(false), children: "Cerrar" })] })] }) })] }));
};
export default CommonAreaReservation;
