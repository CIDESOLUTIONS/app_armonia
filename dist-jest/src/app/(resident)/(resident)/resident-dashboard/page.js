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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, CreditCard, Calendar, MessageSquare, FileText, Users, Bell, Settings, LogOut, DollarSign, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getResidentDashboardStats } from '@/services/residentDashboardService';
import { useAuthStore } from '@/store/authStore';
export default function ResidentDashboard() {
    const { user, loading: authLoading, logout } = useAuthStore();
    const [stats, setStats] = useState(null);
    const [monthlyExpensesTrend, setMonthlyExpensesTrend] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!authLoading && user) {
            fetchDashboardData();
        }
    }, [authLoading, user]);
    const fetchDashboardData = () => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const { stats: fetchedStats, monthlyExpensesTrend: fetchedMonthlyExpensesTrend } = yield getResidentDashboardStats();
            setStats(fetchedStats);
            setMonthlyExpensesTrend(fetchedMonthlyExpensesTrend);
        }
        catch (error) {
            console.error('Error fetching resident dashboard data:', error);
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
    const quickActions = [
        { icon: CreditCard, title: "Estado de Cuenta", description: "Ver pagos y saldos", color: "bg-blue-500", link: "/resident/financial" },
        { icon: Calendar, title: "Reservar Espacios", description: "Áreas comunes disponibles", color: "bg-green-500", link: "/resident/reservations" },
        { icon: MessageSquare, title: "PQR", description: "Peticiones, quejas y reclamos", color: "bg-orange-500", link: "/resident/pqr" },
        { icon: FileText, title: "Documentos", description: "Reglamentos y actas", color: "bg-purple-500", link: "/resident/documents" },
        { icon: Users, title: "Asambleas", description: "Participar en votaciones", color: "bg-indigo-500", link: "/resident/assemblies" },
        { icon: Settings, title: "Mi Perfil", description: "Actualizar información", color: "bg-gray-500", link: "/resident/profile" }
    ];
    if (authLoading || loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    if (!user) {
        return null; // Redirect handled by AuthLayout
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("header", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Home, { className: "h-8 w-8 text-green-600 mr-3" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900", children: "Portal Residentes" })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Bell, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: logout, children: _jsx(LogOut, { className: "h-4 w-4" }) })] })] }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: ["\u00A1Bienvenido, ", user.name || user.email, "!"] }), _jsx("p", { className: "text-gray-600", children: "Gestiona tu informaci\u00F3n y servicios del conjunto residencial" })] }), stats && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Residentes en tu Propiedad" }), _jsx(Users, { className: "h-4 w-4 text-muted-foreground" })] }), _jsx(CardContent, { children: _jsx("div", { className: "text-2xl font-bold", children: stats.totalResidentsInProperty }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Saldo Actual" }), _jsx(CreditCard, { className: "h-4 w-4 text-muted-foreground" })] }), _jsx(CardContent, { children: _jsx("div", { className: "text-2xl font-bold text-red-600", children: formatCurrency(stats.currentAccountBalance) }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Pagos Anuales" }), _jsx(DollarSign, { className: "h-4 w-4 text-muted-foreground" })] }), _jsx(CardContent, { children: _jsx("div", { className: "text-2xl font-bold text-green-600", children: formatCurrency(stats.annualPaymentsSummary) }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "PQRs Reportadas" }), _jsx(MessageSquare, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold", children: [stats.reportedPQRs, " pendientes"] }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [stats.resolvedPQRs, " resueltas"] })] })] })] })), monthlyExpensesTrend.length > 0 && (_jsxs(Card, { className: "mb-8", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Gastos Mensuales (\u00DAltimos 6 meses)" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 200, children: _jsxs(LineChart, { data: monthlyExpensesTrend, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "month" }), _jsx(YAxis, { formatter: (value) => formatCurrency(value) }), _jsx(Tooltip, { formatter: (value) => formatCurrency(value) }), _jsx(Line, { type: "monotone", dataKey: "value", stroke: "#8884d8", activeDot: { r: 8 } })] }) }) })] })), stats && stats.pendingFees.length > 0 && (_jsxs(Card, { className: "mb-8", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Clock, { className: "h-5 w-5 mr-2" }), "Cuotas Pendientes"] }) }), _jsxs(CardContent, { children: [_jsx("div", { className: "space-y-3", children: stats.pendingFees.map((fee) => (_jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg bg-red-50", children: [_jsxs("div", { children: [_jsxs("p", { className: "font-medium", children: [fee.billNumber, " - ", fee.billingPeriod] }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Vence: ", new Date(fee.dueDate).toLocaleDateString()] })] }), _jsx(Badge, { variant: "destructive", children: formatCurrency(fee.totalAmount) })] }, fee.id))) }), _jsx("div", { className: "mt-4 text-right", children: _jsx(Link, { href: "/resident/financial/pending-fees", children: _jsx(Button, { variant: "outline", children: "Ver todas las cuotas pendientes" }) }) })] })] })), stats && stats.upcomingReservations.length > 0 && (_jsxs(Card, { className: "mb-8", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Calendar, { className: "h-5 w-5 mr-2" }), "Pr\u00F3ximas Reservas"] }) }), _jsxs(CardContent, { children: [_jsx("div", { className: "space-y-3", children: stats.upcomingReservations.map((res) => {
                                            var _a;
                                            return (_jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg bg-blue-50", children: [_jsxs("div", { children: [_jsxs("p", { className: "font-medium", children: [res.title, " (", (_a = res.commonArea) === null || _a === void 0 ? void 0 : _a.name, ")"] }), _jsxs("p", { className: "text-sm text-gray-600", children: [new Date(res.startDateTime).toLocaleString(), " - ", new Date(res.endDateTime).toLocaleString()] })] }), _jsx(Badge, { variant: "secondary", children: res.status })] }, res.id));
                                        }) }), _jsx("div", { className: "mt-4 text-right", children: _jsx(Link, { href: "/resident/reservations", children: _jsx(Button, { variant: "outline", children: "Ver todas mis reservas" }) }) })] })] })), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Acciones R\u00E1pidas" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: quickActions.map((action, index) => (_jsx(Link, { href: action.link, children: _jsx(Card, { className: "hover:shadow-lg transition-shadow cursor-pointer h-full", children: _jsx(CardHeader, { className: "pb-3", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: `p-2 rounded-lg ${action.color}`, children: _jsx(action.icon, { className: "h-6 w-6 text-white" }) }), _jsxs("div", { children: [_jsx(CardTitle, { className: "text-lg", children: action.title }), _jsx(CardDescription, { children: action.description })] })] }) }) }) }, index))) })] })] })] }));
}
