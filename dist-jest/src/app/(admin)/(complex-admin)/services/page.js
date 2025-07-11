'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import AdminSidebar from '@/components/admin/layout/AdminSidebar';
import { Loader2 } from 'lucide-react';
export default function ServicesPage() {
    const { user, loading, logout } = useAuthStore();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    if (loading) {
        return _jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) });
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(AdminHeader, { user: user, onLogout: logout, sidebarCollapsed: sidebarCollapsed, setSidebarCollapsed: setSidebarCollapsed }), _jsxs("div", { className: "flex", children: [_jsx(AdminSidebar, { collapsed: sidebarCollapsed }), _jsx("main", { className: `flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`, children: _jsxs("div", { className: "p-6", children: [_jsx("h1", { className: "text-2xl font-bold mb-6", children: "Gesti\u00F3n de Servicios" }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsx("p", { children: "Administraci\u00F3n de servicios comunes del conjunto" }) })] }) })] })] }));
}
