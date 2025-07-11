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
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserPlus, Package, ShieldAlert, Calendar, Clock, AlertCircle, AlertTriangle, CheckCircle, Search, Info, ArrowRight, LogOut } from 'lucide-react';
import NotificationCenterThemed from '@/components/communications/NotificationCenterThemed';
export default function ReceptionDashboard() {
    const { isLoggedIn, token, schemaName, user: { name: userName, language, themeMode } = {} } = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    // const { notifications, unreadNotificationsCount } = useRealTimeCommunication();
    // Datos de ejemplo para desarrollo y pruebas
    const mockData = useMemo(() => ({
        activeVisitors: [
            {
                id: "v1",
                name: "Carlos Rodríguez",
                destinationUnit: "Casa 8",
                checkInTime: "2025-04-08T10:30:00",
                checkOutTime: null,
                type: 'visitor',
                status: 'active'
            },
            {
                id: "v2",
                name: "María Gómez",
                destinationUnit: "Casa 12",
                checkInTime: "2025-04-08T11:15:00",
                checkOutTime: null,
                type: 'visitor',
                status: 'active'
            },
            {
                id: "v3",
                name: "Plomería Express",
                destinationUnit: "Casa 4",
                checkInTime: "2025-04-08T09:45:00",
                checkOutTime: null,
                type: 'service',
                status: 'active'
            }
        ],
        pendingPackages: [
            {
                id: "p1",
                description: "Paquete Amazon",
                recipient: "Juan Pérez",
                unit: "Casa 3",
                receivedAt: "2025-04-07T15:20:00",
                deliveredAt: null,
                status: 'pending'
            },
            {
                id: "p2",
                description: "Correspondencia",
                recipient: "Ana López",
                unit: "Casa 7",
                receivedAt: "2025-04-08T09:10:00",
                deliveredAt: null,
                status: 'pending'
            },
            {
                id: "p3",
                description: "Mercado a domicilio",
                recipient: "Luis Martínez",
                unit: "Casa 15",
                receivedAt: "2025-04-08T10:45:00",
                deliveredAt: null,
                status: 'pending'
            }
        ],
        recentIncidents: [
            {
                id: "i1",
                title: "Fuga de agua en zona común",
                description: "Se reporta fuga de agua en jardín central",
                reportedAt: "2025-04-08T08:30:00",
                type: 'maintenance',
                severity: 'medium',
                status: 'inProgress'
            },
            {
                id: "i2",
                title: "Ruido excesivo",
                description: "Quejas por ruido excesivo en Casa 10",
                reportedAt: "2025-04-07T22:15:00",
                type: 'complaint',
                severity: 'low',
                status: 'reported'
            }
        ],
        todayEvents: [
            {
                id: "e1",
                title: "Reserva Salón Comunal",
                location: "Salón Comunal",
                startTime: "14:00",
                endTime: "18:00",
                date: "2025-04-08",
                type: 'reservation'
            },
            {
                id: "e2",
                title: "Mantenimiento Piscina",
                location: "Piscina",
                startTime: "10:00",
                endTime: "12:00",
                date: "2025-04-08",
                type: 'maintenance'
            }
        ],
        stats: {
            visitorsToday: 8,
            pendingPackages: 5,
            activeIncidents: 3,
            securityAlerts: 0
        }
    }), []);
    const fetchData = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            // En un entorno real, esto sería una llamada a la API
            // const response = await fetch('/api/dashboard');
            // const result = await response.json();
            // if (!response.ok) throw new Error(result.message || 'Error al cargar datos');
            // setData(result);
            // Simulamos un retraso en la carga de datos
            setTimeout(() => {
                setData(mockData);
                setLoading(false);
            }, 1000);
        }
        catch (err) {
            console.error("[ReceptionDashboard] Error:", err);
            setError(err.message || 'Error al cargar datos del dashboard');
            setLoading(false);
        }
    }), [mockData]);
    useEffect(() => {
        if (!isLoggedIn || !token || !schemaName) {
            router.push('/login');
            return;
        }
        fetchData();
    }, [isLoggedIn, token, schemaName, router, fetchData]);
    // Función para formatear fechas y horas
    const formatDateTime = (dateTimeStr) => {
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };
        return new Date(dateTimeStr).toLocaleString(language === 'Español' ? 'es-CO' : 'en-US', options);
    };
    // Función para formatear solo la hora
    const formatTime = (dateTimeStr) => {
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        return new Date(dateTimeStr).toLocaleString(language === 'Español' ? 'es-CO' : 'en-US', options);
    };
    // Función para calcular el tiempo transcurrido
    const getElapsedTime = (dateTimeStr) => {
        const start = new Date(dateTimeStr).getTime();
        const now = new Date().getTime();
        const diffMs = now - start;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };
    // Función para obtener el color según el tipo de severidad
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };
    // Función para obtener el color según el tipo de visitante
    const getVisitorTypeColor = (type) => {
        switch (type) {
            case 'visitor': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'service': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'delivery': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };
    // Filtrar visitantes según término de búsqueda
    const filteredVisitors = (data === null || data === void 0 ? void 0 : data.activeVisitors.filter(visitor => visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.destinationUnit.toLowerCase().includes(searchTerm.toLowerCase()))) || [];
    // Renderizado de estado de carga
    if (loading) {
        return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx(Skeleton, { className: "h-8 w-64 mb-2" }), _jsx(Skeleton, { className: "h-4 w-40" })] }), _jsx(Skeleton, { className: "h-10 w-32" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-6", children: [1, 2, 3, 4].map(i => (_jsx(Skeleton, { className: "h-32 w-full rounded-lg" }, i))) }), _jsx(Skeleton, { className: "h-64 w-full rounded-lg mb-6" }), _jsx(Skeleton, { className: "h-64 w-full rounded-lg" })] }));
    }
    // Renderizado de estado de error
    if (error) {
        return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsxs(Alert, { variant: "destructive", children: [_jsx(AlertCircle, { className: "h-4 w-4" }), _jsx(AlertTitle, { children: "Error" }), _jsx(AlertDescription, { children: error })] }), _jsx(Button, { className: "mt-4", onClick: () => window.location.reload(), children: language === 'Español' ? 'Reintentar' : 'Retry' })] }));
    }
    // Si no hay datos después de cargar, mostrar mensaje
    if (!data) {
        return (_jsx("div", { className: "container mx-auto p-6", children: _jsxs(Alert, { children: [_jsx(Info, { className: "h-4 w-4" }), _jsx(AlertTitle, { children: language === 'Español' ? 'Información no disponible' : 'Information not available' }), _jsx(AlertDescription, { children: language === 'Español'
                            ? 'No se pudo cargar la información del dashboard. Por favor, contacte al administrador.'
                            : 'Could not load dashboard information. Please contact the administrator.' })] }) }));
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", children: language === 'Español' ? 'Panel de Control - Recepción' : 'Control Panel - Reception' }), _jsxs("p", { className: "text-gray-500 dark:text-gray-400", children: [language === 'Español' ? 'Bienvenido, ' : 'Welcome, ', userName || 'Usuario'] })] }), _jsxs("div", { className: "flex items-center mt-2 md:mt-0 gap-4", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Clock, { className: "w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" }), _jsx("span", { children: new Date().toLocaleString(language === 'Español' ? 'es-CO' : 'en-US', { dateStyle: 'full', timeStyle: 'short' }) })] }), _jsx(NotificationCenterThemed, { language: language, themeMode: themeMode })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8", children: [_jsx(Card, { className: "dark:border-gray-700", children: _jsxs(CardContent, { className: "p-6 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: language === 'Español' ? 'Visitantes Hoy' : 'Today\'s Visitors' }), _jsx("p", { className: "text-3xl font-bold text-indigo-600 dark:text-indigo-400", children: data.stats.visitorsToday }), _jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children: [data.activeVisitors.length, " ", language === 'Español' ? 'activos' : 'active'] })] }), _jsx("div", { className: "bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full", children: _jsx(UserPlus, { className: "h-8 w-8 text-indigo-600 dark:text-indigo-400" }) })] }) }), _jsx(Card, { className: "dark:border-gray-700", children: _jsxs(CardContent, { className: "p-6 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: language === 'Español' ? 'Paquetes Pendientes' : 'Pending Packages' }), _jsx("p", { className: "text-3xl font-bold text-indigo-600 dark:text-indigo-400", children: data.stats.pendingPackages }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children: language === 'Español' ? 'por entregar' : 'to deliver' })] }), _jsx("div", { className: "bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full", children: _jsx(Package, { className: "h-8 w-8 text-amber-600 dark:text-amber-400" }) })] }) }), _jsx(Card, { className: "dark:border-gray-700", children: _jsxs(CardContent, { className: "p-6 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: language === 'Español' ? 'Incidentes Activos' : 'Active Incidents' }), _jsx("p", { className: "text-3xl font-bold text-indigo-600 dark:text-indigo-400", children: data.stats.activeIncidents }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children: language === 'Español' ? 'por resolver' : 'to resolve' })] }), _jsx("div", { className: "bg-red-100 dark:bg-red-900/30 p-3 rounded-full", children: _jsx(AlertCircle, { className: "h-8 w-8 text-red-600 dark:text-red-400" }) })] }) }), _jsx(Card, { className: "dark:border-gray-700", children: _jsxs(CardContent, { className: "p-6 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: language === 'Español' ? 'Alertas de Seguridad' : 'Security Alerts' }), _jsx("p", { className: "text-3xl font-bold text-indigo-600 dark:text-indigo-400", children: data.stats.securityAlerts }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children: language === 'Español' ? 'actualmente' : 'currently' })] }), _jsx("div", { className: "bg-green-100 dark:bg-green-900/30 p-3 rounded-full", children: _jsx(ShieldAlert, { className: "h-8 w-8 text-green-600 dark:text-green-400" }) })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [_jsx("div", { className: "md:col-span-2", children: _jsxs(Card, { className: "h-full dark:border-gray-700", children: [_jsxs(CardHeader, { className: "pb-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(CardTitle, { className: "text-xl", children: language === 'Español' ? 'Visitantes Activos' : 'Active Visitors' }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => router.push('/reception/visitors/check-in'), className: "dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800", children: [_jsx(UserPlus, { className: "mr-2 h-4 w-4" }), language === 'Español' ? 'Registrar Visitante' : 'Register Visitor'] })] }), _jsx(CardDescription, { children: language === 'Español' ? 'Personas actualmente dentro del conjunto' : 'People currently inside the complex' }), _jsx("div", { className: "mt-2", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx(Input, { placeholder: language === 'Español' ? "Buscar por nombre o destino..." : "Search by name or destination...", className: "pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })] }) })] }), _jsx(CardContent, { children: filteredVisitors.length > 0 ? (_jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { className: "dark:border-gray-700", children: [_jsx(TableHead, { className: "dark:text-gray-300", children: language === 'Español' ? 'Nombre' : 'Name' }), _jsx(TableHead, { className: "dark:text-gray-300", children: language === 'Español' ? 'Destino' : 'Destination' }), _jsx(TableHead, { className: "dark:text-gray-300", children: language === 'Español' ? 'Ingreso' : 'Check-in' }), _jsx(TableHead, { className: "dark:text-gray-300", children: language === 'Español' ? 'Tiempo' : 'Time' }), _jsx(TableHead, { className: "dark:text-gray-300", children: language === 'Español' ? 'Tipo' : 'Type' }), _jsx(TableHead, { className: "text-right dark:text-gray-300", children: language === 'Español' ? 'Acción' : 'Action' })] }) }), _jsx(TableBody, { children: filteredVisitors.map((visitor) => (_jsxs(TableRow, { className: "dark:border-gray-700", children: [_jsx(TableCell, { className: "font-medium dark:text-gray-200", children: visitor.name }), _jsx(TableCell, { className: "dark:text-gray-300", children: visitor.destinationUnit }), _jsx(TableCell, { className: "dark:text-gray-300", children: formatTime(visitor.checkInTime) }), _jsx(TableCell, { className: "dark:text-gray-300", children: getElapsedTime(visitor.checkInTime) }), _jsx(TableCell, { children: _jsx(Badge, { className: getVisitorTypeColor(visitor.type), children: visitor.type === 'visitor' ? (language === 'Español' ? 'Visitante' : 'Visitor') :
                                                                    visitor.type === 'service' ? (language === 'Español' ? 'Servicio' : 'Service') :
                                                                        (language === 'Español' ? 'Entrega' : 'Delivery') }) }), _jsx(TableCell, { className: "text-right", children: _jsxs(Button, { variant: "ghost", size: "sm", className: "text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300", onClick: () => router.push(`/reception/visitors/check-out?id=${visitor.id}`), children: [_jsx(LogOut, { className: "mr-2 h-4 w-4" }), language === 'Español' ? 'Registrar Salida' : 'Check Out'] }) })] }, visitor.id))) })] })) : (_jsxs("div", { className: "flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400", children: [_jsx(UserPlus, { className: "h-10 w-10 mb-2 text-gray-400 dark:text-gray-500" }), _jsx("p", { children: language === 'Español' ? 'No hay visitantes activos' : 'No active visitors' })] })) })] }) }), _jsxs("div", { children: [_jsxs(Card, { className: "mb-6 dark:border-gray-700", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "text-lg flex items-center", children: [_jsx(Package, { className: "h-5 w-5 mr-2 text-amber-600 dark:text-amber-400" }), language === 'Español' ? 'Paquetes Pendientes' : 'Pending Packages'] }) }), _jsx(CardContent, { children: data.pendingPackages.length > 0 ? (_jsx("div", { className: "space-y-4", children: data.pendingPackages.slice(0, 3).map((pkg) => (_jsxs("div", { className: "flex items-start border-b pb-3 last:border-0 last:pb-0 dark:border-gray-700", children: [_jsx("div", { className: "bg-amber-100 dark:bg-amber-900/30 p-2 rounded-md mr-3", children: _jsx(Package, { className: "h-5 w-5 text-amber-600 dark:text-amber-400" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium dark:text-gray-200", children: pkg.description }), _jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [pkg.recipient, " - ", pkg.unit] }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: formatDateTime(pkg.receivedAt) })] }), _jsx(Button, { variant: "ghost", size: "sm", className: "text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300", onClick: () => router.push(`/reception/packages?id=${pkg.id}`), children: _jsx(ArrowRight, { className: "h-4 w-4" }) })] }, pkg.id))) })) : (_jsxs("div", { className: "flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400", children: [_jsx(Package, { className: "h-8 w-8 mb-2 text-gray-400 dark:text-gray-500" }), _jsx("p", { children: language === 'Español' ? 'No hay paquetes pendientes' : 'No pending packages' })] })) }), _jsx(CardFooter, { children: _jsx(Button, { variant: "outline", size: "sm", className: "w-full dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800", onClick: () => router.push('/reception/packages'), children: language === 'Español' ? 'Ver Todos los Paquetes' : 'View All Packages' }) })] }), _jsxs(Card, { className: "dark:border-gray-700", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "text-lg flex items-center", children: [_jsx(AlertCircle, { className: "h-5 w-5 mr-2 text-red-600 dark:text-red-400" }), language === 'Español' ? 'Incidentes Recientes' : 'Recent Incidents'] }) }), _jsx(CardContent, { children: data.recentIncidents.length > 0 ? (_jsx("div", { className: "space-y-4", children: data.recentIncidents.map((incident) => (_jsxs("div", { className: "flex items-start border-b pb-3 last:border-0 last:pb-0 dark:border-gray-700", children: [_jsx("div", { className: `p-2 rounded-md mr-3 ${getSeverityColor(incident.severity)}`, children: _jsx(AlertTriangle, { className: "h-5 w-5" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium dark:text-gray-200", children: incident.title }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 line-clamp-1", children: incident.description }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: formatDateTime(incident.reportedAt) })] }), _jsx(Button, { variant: "ghost", size: "sm", className: "text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300", onClick: () => router.push(`/reception/incidents?id=${incident.id}`), children: _jsx(ArrowRight, { className: "h-4 w-4" }) })] }, incident.id))) })) : (_jsxs("div", { className: "flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400", children: [_jsx(CheckCircle, { className: "h-8 w-8 mb-2 text-gray-400 dark:text-gray-500" }), _jsx("p", { children: language === 'Español' ? 'No hay incidentes recientes' : 'No recent incidents' })] })) }), _jsx(CardFooter, { children: _jsx(Button, { variant: "outline", size: "sm", className: "w-full dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800", onClick: () => router.push('/reception/incidents'), children: language === 'Español' ? 'Ver Todos los Incidentes' : 'View All Incidents' }) })] })] })] }), _jsxs(Card, { className: "dark:border-gray-700", children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Calendar, { className: "h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" }), language === 'Español' ? 'Eventos de Hoy' : 'Today\'s Events'] }), _jsx(CardDescription, { children: language === 'Español' ? 'Reservas y actividades programadas para hoy' : 'Reservations and activities scheduled for today' })] }), _jsx(CardContent, { children: data.todayEvents.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: data.todayEvents.map((event) => (_jsx(Card, { className: "dark:border-gray-700", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: "bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-md mr-3", children: event.type === 'reservation' ? (_jsx(Calendar, { className: "h-5 w-5 text-indigo-600 dark:text-indigo-400" })) : (_jsx(Clock, { className: "h-5 w-5 text-indigo-600 dark:text-indigo-400" })) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium dark:text-gray-200", children: event.title }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: event.location }), _jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: [event.startTime, " - ", event.endTime] })] })] }) }) }, event.id))) })) : (_jsxs("div", { className: "flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400", children: [_jsx(Calendar, { className: "h-8 w-8 mb-2 text-gray-400 dark:text-gray-500" }), _jsx("p", { children: language === 'Español' ? 'No hay eventos programados para hoy' : 'No events scheduled for today' })] })) })] })] }));
}
