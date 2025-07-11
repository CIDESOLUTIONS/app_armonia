'use client';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Home, Building2, Users, Car, PawPrint, Calendar, DollarSign, MessageSquare, Settings, BarChart3, ClipboardList, Megaphone, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const menuItems = [
    {
        title: 'Dashboard',
        icon: Home,
        href: '/admin',
        description: 'Panel principal'
    },
    {
        title: 'Inventario',
        icon: Building2,
        href: '/admin/inventory',
        description: 'Gestión de inventario',
        submenu: [
            { title: 'Propiedades', href: '/admin/inventory/properties', icon: Building2 },
            { title: 'Residentes', href: '/admin/inventory/residents', icon: Users },
            { title: 'Vehículos', href: '/admin/inventory/vehicles', icon: Car },
            { title: 'Mascotas', href: '/admin/inventory/pets', icon: PawPrint }
        ]
    },
    {
        title: 'Asambleas',
        icon: Calendar,
        href: '/admin/assemblies',
        description: 'Gestión de asambleas',
    },
    {
        title: 'Finanzas',
        icon: DollarSign,
        href: '/(auth)/dashboard/finances',
        description: 'Gestión financiera'
    },
    {
        title: 'PQR',
        icon: MessageSquare,
        href: '/(auth)/dashboard/pqr',
        description: 'Peticiones, quejas y reclamos'
    },
    {
        title: 'Servicios',
        icon: ClipboardList,
        href: '/(auth)/dashboard/services',
        description: 'Servicios comunes'
    },
    {
        title: 'Comunicaciones',
        icon: Megaphone,
        href: '/(auth)/dashboard/communications',
        description: 'Comunicaciones'
    },
    {
        title: 'Seguridad',
        icon: Shield,
        href: '/(auth)/dashboard/security',
        description: 'Seguridad'
    },
    {
        title: 'Reportes',
        icon: BarChart3,
        href: '/(auth)/dashboard/reports',
        description: 'Reportes y estadísticas'
    },
    {
        title: 'Configuración',
        icon: Settings,
        href: '/(auth)/dashboard/settings',
        description: 'Configuración del sistema'
    }
];
export default function AdminSidebar({ collapsed, onToggle }) {
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = useState([]);
    const toggleExpanded = (title) => {
        if (collapsed)
            return;
        setExpandedItems(prev => prev.includes(title)
            ? prev.filter(item => item !== title)
            : [...prev, title]);
    };
    const isActive = (href) => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(href);
    };
    return (_jsxs("div", { className: cn("fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-40", collapsed ? "w-16" : "w-64"), children: [_jsx("div", { className: "flex items-center justify-end p-4 border-b border-gray-200", children: _jsx(Button, { variant: "ghost", size: "sm", onClick: onToggle, className: "h-8 w-8 p-0", children: _jsx(ChevronLeft, { className: cn("h-4 w-4 transition-transform", collapsed && "rotate-180") }) }) }), _jsx("nav", { className: "p-2 space-y-1 overflow-y-auto h-[calc(100%-5rem)]", children: menuItems.map((item) => {
                    const Icon = item.icon;
                    const hasSubmenu = item.submenu && item.submenu.length > 0;
                    const isExpanded = expandedItems.includes(item.title);
                    const itemIsActive = isActive(item.href);
                    return (_jsxs("div", { children: [_jsx("div", { className: cn("flex items-center rounded-lg transition-colors cursor-pointer", itemIsActive
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-gray-700 hover:bg-gray-100"), onClick: () => hasSubmenu ? toggleExpanded(item.title) : null, children: hasSubmenu ? (_jsxs("div", { className: "flex items-center w-full p-2", children: [_jsx(Icon, { className: "h-5 w-5 flex-shrink-0" }), !collapsed && (_jsxs(_Fragment, { children: [_jsx("span", { className: "ml-3 text-sm font-medium flex-1", children: item.title }), _jsx(ChevronLeft, { className: cn("h-4 w-4 transition-transform", isExpanded && "rotate-90") })] }))] })) : (_jsxs(Link, { href: item.href, className: "flex items-center w-full p-2", children: [_jsx(Icon, { className: "h-5 w-5 flex-shrink-0" }), !collapsed && (_jsx("span", { className: "ml-3 text-sm font-medium", children: item.title }))] })) }), hasSubmenu && isExpanded && !collapsed && (_jsx("div", { className: "ml-4 mt-1 space-y-1", children: item.submenu.map((subItem) => {
                                    const SubIcon = subItem.icon;
                                    const subIsActive = isActive(subItem.href);
                                    return (_jsxs(Link, { href: subItem.href, className: cn("flex items-center p-2 rounded-lg text-sm transition-colors", subIsActive
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "text-gray-600 hover:bg-gray-100"), children: [_jsx(SubIcon, { className: "h-4 w-4 flex-shrink-0" }), _jsx("span", { className: "ml-3", children: subItem.title })] }, subItem.href));
                                }) })), collapsed && (_jsxs("div", { className: "absolute left-16 top-0 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50", children: [item.title, item.description && (_jsx("div", { className: "text-gray-300", children: item.description }))] }))] }, item.title));
                }) })] }));
}
