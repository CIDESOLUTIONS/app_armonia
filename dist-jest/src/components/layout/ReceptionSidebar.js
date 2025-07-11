"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { usePassiveEvent } from '@/hooks/use-passive-event';
import { BarChart2, UserPlus, Package, ClipboardList, ShieldAlert, User, ChevronDown, ChevronLeft, ChevronRight, BellRing, Camera, Users } from 'lucide-react';
export default function ReceptionSidebar({ language, theme, currency, receptionName, complexName, logout, isCollapsed, setIsCollapsed, addToast }) {
    const _router = useRouter();
    const [expandedMenu, setExpandedMenu] = useState(null);
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };
    const handleItemClick = (label, path) => {
        console.log(`[ReceptionSidebar] Click en ${label}, path: ${path}`);
        if (path) {
            router.push(path);
        }
        else {
            setExpandedMenu(expandedMenu === label ? null : label);
            if (isCollapsed) {
                setIsCollapsed(false); // Expande para mostrar submenús
            }
        }
    };
    const sidebarItems = [
        { icon: _jsx(BarChart2, { className: "w-6 h-6" }), label: language === "Español" ? "Dashboard" : "Dashboard", path: "/reception/dashboard" },
        {
            icon: _jsx(UserPlus, { className: "w-6 h-6" }),
            label: language === "Español" ? "Visitantes" : "Visitors",
            subitems: [
                { label: language === "Español" ? "Registro de Entrada" : "Check-in", path: "/reception/visitors/check-in" },
                { label: language === "Español" ? "Registro de Salida" : "Check-out", path: "/reception/visitors/check-out" },
                { label: language === "Español" ? "Historial" : "History", path: "/reception/visitors/history" },
                { label: language === "Español" ? "Visitantes Frecuentes" : "Regular Visitors", path: "/reception/visitors/regular" },
            ]
        },
        {
            icon: _jsx(Package, { className: "w-6 h-6" }),
            label: language === "Español" ? "Paquetería" : "Packages",
            subitems: [
                { label: language === "Español" ? "Recepción de Paquetes" : "Package Reception", path: "/reception/packages/reception" },
                { label: language === "Español" ? "Entrega a Residentes" : "Delivery to Residents", path: "/reception/packages/delivery" },
                { label: language === "Español" ? "Historial" : "History", path: "/reception/packages/history" },
            ],
        },
        {
            icon: _jsx(ClipboardList, { className: "w-6 h-6" }),
            label: language === "Español" ? "Bitácora" : "Log",
            subitems: [
                { label: language === "Español" ? "Registrar Incidente" : "Log Incident", path: "/reception/log/incident" },
                { label: language === "Español" ? "Novedades del Día" : "Daily Updates", path: "/reception/log/daily" },
                { label: language === "Español" ? "Historial" : "History", path: "/reception/log/history" },
            ],
        },
        {
            icon: _jsx(Camera, { className: "w-6 h-6" }),
            label: language === "Español" ? "Vigilancia" : "Surveillance",
            path: "/reception/surveillance",
        },
        {
            icon: _jsx(BellRing, { className: "w-6 h-6" }),
            label: language === "Español" ? "Comunicaciones" : "Communications",
            subitems: [
                { label: language === "Español" ? "Anuncios" : "Announcements", path: "/reception/communications" },
                { label: language === "Español" ? "Citofonía" : "Intercom", path: "/reception/communications/intercom" },
                { label: language === "Español" ? "Mensajes" : "Messages", path: "/reception/communications/messages" },
            ],
        },
        {
            icon: _jsx(Users, { className: "w-6 h-6" }),
            label: language === "Español" ? "Directorio" : "Directory",
            path: "/reception/directory",
        },
        {
            icon: _jsx(ShieldAlert, { className: "w-6 h-6" }),
            label: language === "Español" ? "Emergencias" : "Emergencies",
            path: "/reception/emergencies",
        },
        {
            icon: _jsx(User, { className: "w-6 h-6" }),
            label: language === "Español" ? "Mi Perfil" : "My Profile",
            path: "/reception/profile",
        },
    ];
    usePassiveEvent(typeof window !== 'undefined' ? window : null, 'touchstart', (e) => {
        if (isCollapsed && e.target.closest('.sidebar')) {
            e.preventDefault();
        }
    });
    return (_jsxs("aside", { className: `sidebar bg-indigo-600 text-white transition-all duration-300 h-screen ${isCollapsed ? "w-16" : "w-64"}`, children: [_jsxs("div", { className: "p-4 flex justify-between items-center", children: [!isCollapsed && _jsx("span", { className: "text-xl font-bold", children: "Armon\u00EDa" }), _jsx(Button, { variant: "ghost", size: "icon", onClick: toggleSidebar, className: "text-white hover:bg-indigo-700", children: isCollapsed ? _jsx(ChevronRight, { className: "w-6 h-6" }) : _jsx(ChevronLeft, { className: "w-6 h-6" }) })] }), !isCollapsed && (_jsxs("div", { className: "px-4 py-2", children: [_jsx("div", { className: "text-sm text-indigo-200", children: language === "Español" ? "Conjunto" : "Complex" }), _jsx("div", { className: "font-medium truncate", children: complexName || '-' }), _jsx("div", { className: "mt-1 text-sm text-indigo-200", children: language === "Español" ? "Recepcionista" : "Reception" }), _jsx("div", { className: "font-medium truncate", children: receptionName || 'Recepcionista' })] })), _jsx("nav", { className: "mt-4", children: sidebarItems.map((item, index) => (_jsxs("div", { children: [_jsxs(Button, { variant: "ghost", className: "w-full flex items-center justify-start p-4 hover:bg-indigo-700", onClick: () => handleItemClick(item.label, item.path), children: [item.icon, !isCollapsed && _jsx("span", { className: "ml-4", children: item.label }), !isCollapsed && item.subitems && (_jsx(ChevronDown, { className: `ml-auto w-4 h-4 transform ${expandedMenu === item.label ? "rotate-180" : ""}` }))] }), !isCollapsed && item.subitems && expandedMenu === item.label && (_jsx("div", { className: "ml-8", children: item.subitems.map((subitem, subIndex) => (_jsx(Button, { variant: "ghost", className: "w-full flex items-center justify-start p-2 hover:bg-indigo-600", onClick: () => handleItemClick(subitem.label, subitem.path), children: _jsx("span", { children: subitem.label }) }, subIndex))) }))] }, index))) })] }));
}
