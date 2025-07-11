"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { usePassiveEvent } from '@/hooks/use-passive-event';
import { BarChart2, Calendar, DollarSign, Home, AlertCircle, MessageSquare, User, ChevronDown, ChevronLeft, ChevronRight, Coffee } from 'lucide-react';
export default function ResidentSidebar({ language, theme, currency, residentName, complexName, logout, isCollapsed, setIsCollapsed, addToast }) {
    const _router = useRouter();
    const [expandedMenu, setExpandedMenu] = useState(null);
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };
    const handleItemClick = (label, path) => {
        console.log(`[ResidentSidebar] Click en ${label}, path: ${path}`);
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
        { icon: _jsx(BarChart2, { className: "w-6 h-6" }), label: language === "Español" ? "Dashboard" : "Dashboard", path: "/resident/dashboard" },
        {
            icon: _jsx(Home, { className: "w-6 h-6" }),
            label: language === "Español" ? "Mi Propiedad" : "My Property",
            subitems: [
                { label: language === "Español" ? "Información General" : "General Information", path: "/resident/property" },
                { label: language === "Español" ? "Familia" : "Family", path: "/resident/property/family" },
                { label: language === "Español" ? "Vehículos" : "Vehicles", path: "/resident/property/vehicles" },
                { label: language === "Español" ? "Mascotas" : "Pets", path: "/resident/property/pets" },
            ]
        },
        {
            icon: _jsx(DollarSign, { className: "w-6 h-6" }),
            label: language === "Español" ? "Pagos" : "Payments",
            subitems: [
                { label: language === "Español" ? "Estado de Cuenta" : "Account Status", path: "/resident/payments/status" },
                { label: language === "Español" ? "Historial de Pagos" : "Payment History", path: "/resident/payments/history" },
                { label: language === "Español" ? "Realizar Pago" : "Make Payment", path: "/resident/payments/new" },
            ],
        },
        {
            icon: _jsx(Coffee, { className: "w-6 h-6" }),
            label: language === "Español" ? "Servicios" : "Services",
            subitems: [
                { label: language === "Español" ? "Disponibilidad" : "Availability", path: "/resident/services" },
                { label: language === "Español" ? "Mis Reservas" : "My Reservations", path: "/resident/services/my-reservations" },
                { label: language === "Español" ? "Nueva Reserva" : "New Reservation", path: "/resident/services/new-reservation" },
            ],
        },
        {
            icon: _jsx(Calendar, { className: "w-6 h-6" }),
            label: language === "Español" ? "Asambleas" : "Assemblies",
            path: "/resident/assemblies",
        },
        {
            icon: _jsx(AlertCircle, { className: "w-6 h-6" }),
            label: language === "Español" ? "PQR" : "PQR",
            subitems: [
                { label: language === "Español" ? "Mis Solicitudes" : "My Requests", path: "/resident/pqr" },
                { label: language === "Español" ? "Nueva Solicitud" : "New Request", path: "/resident/pqr/new" },
            ],
        },
        {
            icon: _jsx(MessageSquare, { className: "w-6 h-6" }),
            label: language === "Español" ? "Comunicaciones" : "Communications",
            subitems: [
                { label: language === "Español" ? "Anuncios" : "Announcements", path: "/resident/communications" },
                { label: language === "Español" ? "Mensajes" : "Messages", path: "/resident/communications/messages" },
                { label: language === "Español" ? "Contactos" : "Contacts", path: "/resident/communications/contacts" },
            ],
        },
        {
            icon: _jsx(User, { className: "w-6 h-6" }),
            label: language === "Español" ? "Mi Perfil" : "My Profile",
            path: "/resident/profile",
        },
    ];
    usePassiveEvent(typeof window !== 'undefined' ? window : null, 'touchstart', (e) => {
        if (isCollapsed && e.target.closest('.sidebar')) {
            e.preventDefault();
        }
    });
    return (_jsxs("aside", { className: `sidebar bg-indigo-600 text-white transition-all duration-300 h-screen ${isCollapsed ? "w-16" : "w-64"}`, children: [_jsxs("div", { className: "p-4 flex justify-between items-center", children: [!isCollapsed && _jsx("span", { className: "text-xl font-bold", children: "Armon\u00EDa" }), _jsx(Button, { variant: "ghost", size: "icon", onClick: toggleSidebar, className: "text-white hover:bg-indigo-700", children: isCollapsed ? _jsx(ChevronRight, { className: "w-6 h-6" }) : _jsx(ChevronLeft, { className: "w-6 h-6" }) })] }), !isCollapsed && (_jsxs("div", { className: "px-4 py-2", children: [_jsx("div", { className: "text-sm text-indigo-200", children: language === "Español" ? "Conjunto" : "Complex" }), _jsx("div", { className: "font-medium truncate", children: complexName || '-' }), _jsx("div", { className: "mt-1 text-sm text-indigo-200", children: language === "Español" ? "Residente" : "Resident" }), _jsx("div", { className: "font-medium truncate", children: residentName || 'Residente' })] })), _jsx("nav", { className: "mt-4", children: sidebarItems.map((item, index) => (_jsxs("div", { children: [_jsxs(Button, { variant: "ghost", className: "w-full flex items-center justify-start p-4 hover:bg-indigo-700", onClick: () => handleItemClick(item.label, item.path), children: [item.icon, !isCollapsed && _jsx("span", { className: "ml-4", children: item.label }), !isCollapsed && item.subitems && (_jsx(ChevronDown, { className: `ml-auto w-4 h-4 transform ${expandedMenu === item.label ? "rotate-180" : ""}` }))] }), !isCollapsed && item.subitems && expandedMenu === item.label && (_jsx("div", { className: "ml-8", children: item.subitems.map((subitem, subIndex) => (_jsx(Button, { variant: "ghost", className: "w-full flex items-center justify-start p-2 hover:bg-indigo-600", onClick: () => handleItemClick(subitem.label, subitem.path), children: _jsx("span", { children: subitem.label }) }, subIndex))) }))] }, index))) })] }));
}
