'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import AdminSidebar from '@/components/admin/layout/AdminSidebar';
import { Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
export default function FinancesPage() {
    const { user, loading, logout } = useAuthStore();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [finances] = useState({
        totalIngresos: 45000000,
        totalEgresos: 32000000,
        saldoActual: 13000000,
        cuotasPendientes: 15,
        pagosRecientes: [
            {
                id: 1,
                concepto: 'Cuota de administración - Apt 301',
                monto: 450000,
                fecha: '2025-07-03',
                estado: 'Pagado'
            },
            {
                id: 2,
                concepto: 'Servicios públicos - Junio',
                monto: 2800000,
                fecha: '2025-07-02',
                estado: 'Pendiente'
            }
        ]
    });
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(AdminHeader, { user: user, onLogout: logout, sidebarCollapsed: sidebarCollapsed, setSidebarCollapsed: setSidebarCollapsed }), _jsxs("div", { className: "flex", children: [_jsx(AdminSidebar, { collapsed: sidebarCollapsed }), _jsx("main", { className: `flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`, children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Gesti\u00F3n Financiera" }), _jsx("button", { className: "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700", children: "Generar Reporte" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-6", children: [_jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500", children: "Total Ingresos" }), _jsxs("p", { className: "text-2xl font-bold text-green-600", children: ["$", finances.totalIngresos.toLocaleString()] })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500", children: "Total Egresos" }), _jsxs("p", { className: "text-2xl font-bold text-red-600", children: ["$", finances.totalEgresos.toLocaleString()] })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500", children: "Saldo Actual" }), _jsxs("p", { className: "text-2xl font-bold text-blue-600", children: ["$", finances.saldoActual.toLocaleString()] })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500", children: "Cuotas Pendientes" }), _jsx("p", { className: "text-2xl font-bold text-orange-600", children: finances.cuotasPendientes })] })] }), _jsx("div", { className: "bg-white rounded-lg shadow", children: _jsxs("div", { className: "p-6", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Movimientos Recientes" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { className: "text-left py-2", children: "Concepto" }), _jsx(TableHead, { className: "text-left py-2", children: "Monto" }), _jsx(TableHead, { className: "text-left py-2", children: "Fecha" }), _jsx(TableHead, { className: "text-left py-2", children: "Estado" }), _jsx(TableHead, { className: "text-left py-2", children: "Acciones" })] }) }), _jsx(TableBody, { children: finances.pagosRecientes.map((pago) => (_jsxs(TableRow, { className: "border-b", children: [_jsx(TableCell, { className: "py-3", children: pago.concepto }), _jsxs(TableCell, { className: "py-3", children: ["$", pago.monto.toLocaleString()] }), _jsx(TableCell, { className: "py-3", children: pago.fecha }), _jsx(TableCell, { className: "py-3", children: _jsx("span", { className: `px-2 py-1 rounded-full text-xs ${pago.estado === 'Pagado'
                                                                                ? 'bg-green-100 text-green-800'
                                                                                : 'bg-orange-100 text-orange-800'}`, children: pago.estado }) }), _jsxs(TableCell, { className: "py-3", children: [_jsx("button", { className: "text-blue-600 hover:text-blue-800 mr-2", children: "Ver" }), _jsx("button", { className: "text-green-600 hover:text-green-800", children: "Editar" })] })] }, pago.id))) })] }) })] }) })] }) })] })] }));
}
