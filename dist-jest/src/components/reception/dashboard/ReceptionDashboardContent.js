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
import { Users, AlertCircle, Camera, ClipboardList, MessageSquare, Package, Phone, Activity, BarChart3 } from 'lucide-react';
import Link from 'next/link';
export function ReceptionDashboardContent() {
    const [stats, setStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Simular carga de datos
        const fetchData = () => __awaiter(this, void 0, void 0, function* () {
            setLoading(true);
            // Aquí se llamarían a los servicios reales
            yield new Promise(resolve => setTimeout(resolve, 1000)); // Simular retardo de red
            setStats({
                currentVisitors: 15,
                commonAreasInUse: 3,
                pendingAlerts: 2,
                camerasOnline: 8,
                previousShiftIncidents: 5,
                pendingPQRs: 7,
                pendingPackages: 12,
            });
            setRecentActivity([
                { id: '1', type: 'visitor', title: 'Nuevo visitante registrado', description: 'Acceso de Juan Pérez a apto 301', timestamp: new Date().toISOString(), status: 'info' },
                { id: '2', type: 'package', title: 'Paquete recibido', description: 'Paquete para apto 502 de Amazon', timestamp: new Date().toISOString(), status: 'success' },
                { id: '3', type: 'incident', title: 'Incidente de seguridad', description: 'Alarma activada en zona común', timestamp: new Date().toISOString(), status: 'error' },
                { id: '4', type: 'pqr', title: 'Nueva PQR', description: 'Reporte de ruido en apto 203', timestamp: new Date().toISOString(), status: 'warning' },
            ]);
            setLoading(false);
        });
        fetchData();
    }, []);
    const getActivityIcon = (type) => {
        switch (type) {
            case 'visitor': return _jsx(Users, { className: "h-4 w-4" });
            case 'package': return _jsx(Package, { className: "h-4 w-4" });
            case 'incident': return _jsx(AlertCircle, { className: "h-4 w-4" });
            case 'pqr': return _jsx(MessageSquare, { className: "h-4 w-4" });
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
    if (loading) {
        return (_jsx("div", { className: "space-y-6", children: _jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "h-8 bg-gray-200 rounded w-1/4 mb-6" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [...Array(6)].map((_, i) => (_jsx("div", { className: "h-32 bg-gray-200 rounded-lg" }, i))) })] }) }));
    }
    if (!stats)
        return null; // O mostrar un mensaje de error
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Dashboard Recepci\u00F3n" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Panel de control y m\u00E9tricas clave para el personal de recepci\u00F3n y vigilancia" })] }), _jsxs("div", { className: "flex space-x-3", children: [_jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(BarChart3, { className: "h-4 w-4 mr-2" }), "Exportar Reporte"] }), _jsxs(Button, { size: "sm", children: [_jsx(Activity, { className: "h-4 w-4 mr-2" }), "Actualizar Datos"] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Visitantes Actuales" }), _jsx(Users, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: stats.currentVisitors }), _jsx("p", { className: "text-xs text-muted-foreground", children: "En el conjunto" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "\u00C1reas Comunes en Uso" }), _jsx(Activity, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: stats.commonAreasInUse }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Salones, piscina, etc." })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Alertas Pendientes" }), _jsx(AlertCircle, { className: "h-4 w-4 text-red-500" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold text-red-600", children: stats.pendingAlerts }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Incidencias de seguridad o sistema" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "C\u00E1maras Online" }), _jsx(Camera, { className: "h-4 w-4 text-green-500" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold text-green-600", children: stats.camerasOnline }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Sistemas de vigilancia activos" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Novedades Turno Anterior" }), _jsx(ClipboardList, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: stats.previousShiftIncidents }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Registradas en minuta digital" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "PQRs Asignados" }), _jsx(MessageSquare, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: stats.pendingPQRs }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Pendientes de gesti\u00F3n" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Paquetes Pendientes" }), _jsx(Package, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: stats.pendingPackages }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Por entregar a residentes" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs(Card, { className: "lg:col-span-2", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Activity, { className: "h-5 w-5 mr-2" }), "Actividad Reciente"] }) }), _jsxs(CardContent, { children: [_jsx("div", { className: "space-y-4", children: recentActivity.map((activity) => (_jsxs("div", { className: "flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50", children: [_jsx("div", { className: `p-2 rounded-full ${getStatusColor(activity.status)}`, children: getActivityIcon(activity.type) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: activity.title }), _jsx("p", { className: "text-sm text-gray-500", children: activity.description }), _jsx("p", { className: "text-xs text-gray-400 mt-1", children: new Date(activity.timestamp).toLocaleString('es-CO') })] })] }, activity.id))) }), _jsx("div", { className: "mt-4 pt-4 border-t", children: _jsx(Link, { href: "/reception/activity", children: _jsx(Button, { variant: "outline", size: "sm", className: "w-full", children: "Ver toda la actividad" }) }) })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Acciones R\u00E1pidas" }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsx(Link, { href: "/reception/visitors/register", children: _jsxs(Button, { variant: "outline", size: "sm", className: "w-full justify-start", children: [_jsx(Users, { className: "h-4 w-4 mr-2" }), "Registrar Visitante"] }) }), _jsx(Link, { href: "/reception/packages/register", children: _jsxs(Button, { variant: "outline", size: "sm", className: "w-full justify-start", children: [_jsx(Package, { className: "h-4 w-4 mr-2" }), "Registrar Paquete"] }) }), _jsx(Link, { href: "/reception/incidents/create", children: _jsxs(Button, { variant: "outline", size: "sm", className: "w-full justify-start", children: [_jsx(AlertCircle, { className: "h-4 w-4 mr-2" }), "Reportar Incidente"] }) }), _jsx(Link, { href: "/reception/intercom", children: _jsxs(Button, { variant: "outline", size: "sm", className: "w-full justify-start", children: [_jsx(Phone, { className: "h-4 w-4 mr-2" }), "Citofon\u00EDa Virtual"] }) }), _jsx(Link, { href: "/reception/minuta", children: _jsxs(Button, { variant: "outline", size: "sm", className: "w-full justify-start", children: [_jsx(ClipboardList, { className: "h-4 w-4 mr-2" }), "Minuta Digital"] }) })] })] })] })] }));
}
