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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, DollarSign, Calendar, MessageSquare, TrendingUp, Activity, AlertCircle, BarChart3, BellRing // Added BellRing icon
 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { getDashboardStats, getRecentActivity, getUpcomingEvents } from '@/services/dashboardService'; // Added getUpcomingEvents
import { DashboardCharts } from '@/components/admin/dashboard/DashboardCharts';
export function AdminDashboardContent() {
    const [stats, setStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]); // New state for upcoming events
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchDashboardData();
    }, []);
    const fetchDashboardData = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const [fetchedStats, fetchedActivity, fetchedUpcomingEvents] = yield Promise.all([
                getDashboardStats(),
                getRecentActivity(),
                getUpcomingEvents(), // Fetch upcoming events
            ]);
            setStats(fetchedStats);
            setRecentActivity(fetchedActivity);
            setUpcomingEvents(fetchedUpcomingEvents); // Set upcoming events state
        }
        catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
        finally {
            setLoading(false);
        }
    });
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    };
    const getActivityIcon = (type) => {
        switch (type) {
            case 'payment': return _jsx(DollarSign, { className: "h-4 w-4" });
            case 'pqr': return _jsx(MessageSquare, { className: "h-4 w-4" });
            case 'assembly': return _jsx(Calendar, { className: "h-4 w-4" });
            case 'incident': return _jsx(AlertCircle, { className: "h-4 w-4" });
            default: return _jsx(Activity, { className: "h-4 w-4" });
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'success': return 'bg-green-100 text-green-800';
            case 'warning': return 'bg-yellow-100 text-yellow-800';
            case 'error': return 'bg-red-100 text-red-800';
            case 'info': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    // New helper functions for upcoming events
    const getEventIcon = (type) => {
        switch (type) {
            case 'assembly': return _jsx(Calendar, { className: "h-4 w-4 text-blue-600" });
            case 'fee': return _jsx(DollarSign, { className: "h-4 w-4 text-green-600" });
            default: return _jsx(BellRing, { className: "h-4 w-4 text-gray-600" });
        }
    };
    const getEventBadge = (status) => {
        switch (status) {
            case 'upcoming': return _jsx(Badge, { variant: "outline", children: "Pr\u00F3xima" });
            case 'overdue': return _jsx(Badge, { variant: "destructive", children: "Vencida" });
            default: return _jsx(Badge, { variant: "secondary", children: "Info" });
        }
    };
    if (loading) {
        return (_jsx("div", { className: "space-y-6", children: _jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "h-8 bg-gray-200 rounded w-1/4 mb-6" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [...Array(8)].map((_, i) => (_jsx("div", { className: "h-32 bg-gray-200 rounded-lg" }, i))) })] }) }));
    }
    if (!stats)
        return null;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Dashboard Administrador" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Panel de control y m\u00E9tricas principales" })] }), _jsxs("div", { className: "flex space-x-3", children: [_jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(BarChart3, { className: "h-4 w-4 mr-2" }), "Exportar Reporte"] }), _jsxs(Button, { size: "sm", children: [_jsx(Activity, { className: "h-4 w-4 mr-2" }), "Actualizar Datos"] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Total Inmuebles" }), _jsx(Building2, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: stats.totalProperties }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Casas y apartamentos registrados" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Total Residentes" }), _jsx(Users, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: stats.totalResidents }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Residentes activos registrados" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Pagos Pendientes" }), _jsx(DollarSign, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold text-red-600", children: stats.pendingPayments }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Cuotas por cobrar este mes" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Ingresos del Mes" }), _jsx(TrendingUp, { className: "h-4 w-4 text-green-600" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold text-green-600", children: formatCurrency(stats.totalRevenue) }), _jsx("p", { className: "text-xs text-muted-foreground", children: "+12% vs mes anterior" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Ejecuci\u00F3n Presupuesto" }), _jsx(BarChart3, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold", children: [stats.budgetExecution, "%"] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 mt-2", children: _jsx("div", { className: "bg-blue-600 h-2 rounded-full", style: { width: `${stats.budgetExecution}%` } }) })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Proyectos Activos" }), _jsx(Activity, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: stats.activeProjects }), _jsx("p", { className: "text-xs text-muted-foreground", children: "En ejecuci\u00F3n actualmente" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Uso \u00C1reas Comunes" }), _jsx(Calendar, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold", children: [stats.commonAreaUsage, "%"] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Ocupaci\u00F3n promedio mensual" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "PQRs" }), _jsx(MessageSquare, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "text-lg font-bold text-yellow-600", children: stats.pendingPQRs }), _jsx("span", { className: "text-sm text-gray-500", children: "pendientes" })] }), _jsxs("div", { className: "flex items-center space-x-2 mt-1", children: [_jsx("div", { className: "text-lg font-bold text-green-600", children: stats.resolvedPQRs }), _jsx("span", { className: "text-sm text-gray-500", children: "resueltas" })] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Pr\u00F3ximas Asambleas" }), _jsx(Calendar, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: stats.upcomingAssemblies }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Programadas para los pr\u00F3ximos 30 d\u00EDas" })] })] })] }), stats.revenueTrend && stats.commonAreaUsageTrend && (_jsx(DashboardCharts, { revenueTrend: stats.revenueTrend, commonAreaUsageTrend: stats.commonAreaUsageTrend })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs(Card, { className: "lg:col-span-2", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Activity, { className: "h-5 w-5 mr-2" }), "Actividad Reciente"] }) }), _jsxs(CardContent, { children: [_jsx("div", { className: "space-y-4", children: recentActivity.map((activity) => (_jsxs("div", { className: "flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50", children: [_jsx("div", { className: `p-2 rounded-full ${getStatusColor(activity.status)}`, children: getActivityIcon(activity.type) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: activity.title }), _jsx("p", { className: "text-sm text-gray-500", children: activity.description }), _jsx("p", { className: "text-xs text-gray-400 mt-1", children: new Date(activity.timestamp).toLocaleString('es-CO') })] })] }, activity.id))) }), _jsx("div", { className: "mt-4 pt-4 border-t", children: _jsx(Link, { href: "/admin/activity", children: _jsx(Button, { variant: "outline", size: "sm", className: "w-full", children: "Ver toda la actividad" }) }) })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Acciones R\u00E1pidas" }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsx(Link, { href: "/admin/assemblies/create", children: _jsxs(Button, { variant: "outline", size: "sm", className: "w-full justify-start", children: [_jsx(Calendar, { className: "h-4 w-4 mr-2" }), "Nueva Asamblea"] }) }), _jsx(Link, { href: "/admin/finances/fees/create", children: _jsxs(Button, { variant: "outline", size: "sm", className: "w-full justify-start", children: [_jsx(DollarSign, { className: "h-4 w-4 mr-2" }), "Generar Cuotas"] }) }), _jsx(Link, { href: "/admin/communications/create", children: _jsxs(Button, { variant: "outline", size: "sm", className: "w-full justify-start", children: [_jsx(MessageSquare, { className: "h-4 w-4 mr-2" }), "Nuevo Anuncio"] }) }), _jsx(Link, { href: "/admin/inventory/residents/create", children: _jsxs(Button, { variant: "outline", size: "sm", className: "w-full justify-start", children: [_jsx(Users, { className: "h-4 w-4 mr-2" }), "Registrar Residente"] }) }), _jsx(Link, { href: "/admin/reports", children: _jsxs(Button, { variant: "outline", size: "sm", className: "w-full justify-start", children: [_jsx(BarChart3, { className: "h-4 w-4 mr-2" }), "Generar Reporte"] }) })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Calendar, { className: "h-5 w-5 mr-2" }), "Pr\u00F3ximos Eventos"] }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-3", children: upcomingEvents.length > 0 ? (upcomingEvents.map((event) => (_jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "p-2 rounded-full", children: getEventIcon(event.type) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: event.title }), _jsx("p", { className: "text-sm text-gray-500", children: new Date(event.date).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) })] })] }), getEventBadge(event.status)] }, event.id)))) : (_jsx("p", { className: "text-gray-500 text-center", children: "No hay pr\u00F3ximos eventos." })) }) })] })] }));
}
