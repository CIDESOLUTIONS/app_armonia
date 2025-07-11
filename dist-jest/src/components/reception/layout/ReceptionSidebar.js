"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Home, Users, Package, AlertTriangle, Camera, FileText, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
const sidebarItems = [
    {
        title: 'Dashboard',
        href: '/reception-dashboard',
        icon: Home,
        description: 'Panel principal de recepción'
    },
    {
        title: 'Visitantes',
        href: '/visitors',
        icon: Users,
        description: 'Registro y control de visitantes'
    },
    {
        title: 'Paquetería',
        href: '/packages',
        icon: Package,
        description: 'Gestión de paquetes y correspondencia'
    },
    {
        title: 'Incidentes',
        href: '/incidents',
        icon: AlertTriangle,
        description: 'Registro de incidentes y novedades'
    },
    {
        title: 'Vigilancia',
        href: '/surveillance',
        icon: Camera,
        description: 'Monitoreo y cámaras de seguridad'
    },
    {
        title: 'Reportes',
        href: '/reports',
        icon: FileText,
        description: 'Reportes y estadísticas'
    }
];
export default function ReceptionSidebar({ className }) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    return (_jsxs("div", { className: cn("flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300", collapsed ? "w-16" : "w-64", className), children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-gray-200", children: [!collapsed && (_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Portal Recepci\u00F3n" }), _jsx("p", { className: "text-sm text-gray-500", children: "Control de accesos" })] })), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setCollapsed(!collapsed), className: "h-8 w-8 p-0", children: collapsed ? (_jsx(ChevronRight, { className: "h-4 w-4" })) : (_jsx(ChevronLeft, { className: "h-4 w-4" })) })] }), _jsx("nav", { className: "flex-1 p-4 space-y-2", children: sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (_jsx(Link, { href: item.href, children: _jsxs(Button, { variant: isActive ? "default" : "ghost", className: cn("w-full justify-start h-auto p-3", collapsed && "px-2", isActive && "bg-orange-100 text-orange-700 hover:bg-orange-200"), children: [_jsx(Icon, { className: cn("h-5 w-5", !collapsed && "mr-3") }), !collapsed && (_jsxs("div", { className: "text-left", children: [_jsx("div", { className: "font-medium", children: item.title }), _jsx("div", { className: "text-xs text-gray-500 mt-1", children: item.description })] }))] }) }, item.href));
                }) }), _jsx("div", { className: "p-4 border-t border-gray-200", children: _jsxs(Button, { variant: "ghost", className: cn("w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50", collapsed && "px-2"), onClick: () => {
                        // Implementar logout
                        window.location.href = '/portal-selector';
                    }, children: [_jsx(LogOut, { className: cn("h-5 w-5", !collapsed && "mr-3") }), !collapsed && "Cerrar Sesión"] }) })] }));
}
