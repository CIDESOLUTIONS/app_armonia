'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import AdminHeader from '@/components/admin/layout/AdminHeader'; // Reutilizar el header de admin por ahora
import AdminSidebar from '@/components/admin/layout/AdminSidebar'; // Reutilizar el sidebar de admin por ahora
import { ReceptionDashboardContent } from '@/components/reception/dashboard/ReceptionDashboardContent';
import { Loader2 } from 'lucide-react';
export default function ReceptionDashboard() {
    const { user, loading, logout } = useAuthStore();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    // Asumiendo que el rol para recepción es 'STAFF' o similar
    if (!user || (user.role !== 'STAFF' && user.role !== 'RECEPTION')) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Acceso Denegado" }), _jsx("p", { className: "text-gray-600", children: "No tienes permisos para acceder a esta p\u00E1gina." })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(AdminHeader, { adminName: (user === null || user === void 0 ? void 0 : user.name) || "Recepción", complexName: "Conjunto Residencial Armon\u00EDa", onLogout: logout }), _jsxs("div", { className: "flex", children: [_jsx(AdminSidebar, { collapsed: sidebarCollapsed, onToggle: () => setSidebarCollapsed(!sidebarCollapsed) }), _jsx("main", { className: `flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`, children: _jsx("div", { className: "p-6", children: _jsx(ReceptionDashboardContent, {}) }) })] })] }));
}
