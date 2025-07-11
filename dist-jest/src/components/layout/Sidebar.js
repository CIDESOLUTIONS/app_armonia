// src/components/layout/Sidebar.tsx
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { usePassiveEvent } from '@/hooks/use-passive-event';
import { BarChart2, Calendar, DollarSign, Building, Users, AlertCircle, Settings, ChevronDown, Shield, ChevronLeft, ChevronRight, Coffee } from 'lucide-react';
export default function Sidebar({ language, theme, currency, adminName, complexName, logout, isCollapsed, setIsCollapsed, addToast }) {
    const _router = useRouter();
    const [expandedMenu, setExpandedMenu] = useState(null);
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };
    const handleItemClick = (label, path) => {
        console.log(`[Sidebar] Click en ${label}, path: ${path}`);
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
        { icon: _jsx(BarChart2, { className: "w-6 h-6" }), label: language === "Español" ? "Dashboard" : "Dashboard", path: "/dashboard" },
        {
            icon: _jsx(Building, { className: "w-6 h-6" }),
            label: language === "Español" ? "Inventario" : "Inventory",
            subitems: [
                { label: language === "Español" ? "Datos del Conjunto" : "Complex Data", path: "/dashboard/inventory" },
                { label: language === "Español" ? "Inmuebles" : "Properties", path: "/dashboard/inventory/properties" },
                { label: language === "Español" ? "Vehículos" : "Vehicles", path: "/dashboard/inventory/vehicles" },
                { label: language === "Español" ? "Mascotas" : "Pets", path: "/dashboard/inventory/pets" },
                { label: language === "Español" ? "Servicios Comunes" : "Common Services", path: "/dashboard/inventory/services" },
            ],
        },
        {
            icon: _jsx(Calendar, { className: "w-6 h-6" }),
            label: language === "Español" ? "Asambleas" : "Assemblies",
            subitems: [
                { label: language === "Español" ? "Programación" : "Scheduling", path: "/dashboard/assemblies/scheduling" },
                { label: language === "Español" ? "Control Asistencia" : "Attendance Control", path: "/dashboard/assemblies/attendance" },
                { label: language === "Español" ? "Control Votación" : "Voting Control", path: "/dashboard/assemblies/voting" },
                { label: language === "Español" ? "Actas y Documentos" : "Minutes and Documents", path: "/dashboard/assemblies/documents" },
            ],
        },
        {
            icon: _jsx(DollarSign, { className: "w-6 h-6" }),
            label: language === "Español" ? "Finanzas" : "Finances",
            subitems: [
                { label: language === "Español" ? "Presupuesto" : "Budget", path: "/dashboard/finances/budget" },
                { label: language === "Español" ? "Proyectos" : "Projects", path: "/dashboard/finances/projects" },
                { label: language === "Español" ? "Cuotas Ordinarias" : "Regular Fees", path: "/dashboard/finances/regular-fees" },
                { label: language === "Español" ? "Cuotas Extraordinarias" : "Extraordinary Fees", path: "/dashboard/finances/extra-fees" },
                { label: language === "Español" ? "Certificados" : "Certificates", path: "/dashboard/finances/certificates" },
            ],
        },
        {
            icon: _jsx(Coffee, { className: "w-6 h-6" }),
            label: language === "Español" ? "Servicios" : "Services",
            subitems: [
                { label: language === "Español" ? "Servicios Comunes" : "Common Services", path: "/dashboard/services/common" },
                { label: language === "Español" ? "Reservas" : "Reservations", path: "/dashboard/services/reservations" },
            ],
        },
        {
            icon: _jsx(Users, { className: "w-6 h-6" }),
            label: language === "Español" ? "Residentes" : "Residents",
            subitems: [
                { label: language === "Español" ? "Listado de Residentes" : "Residents List", path: "/dashboard/residents" },
                { label: language === "Español" ? "Registro de Residentes" : "Residents Registry", path: "/dashboard/residents/registry" },
            ],
        },
        {
            icon: _jsx(Shield, { className: "w-6 h-6" }),
            label: language === "Español" ? "Usuarios" : "Users",
            subitems: [
                { label: language === "Español" ? "Registro de Usuarios" : "User Registry", path: "/dashboard/users/registry" },
                { label: language === "Español" ? "Recepcionistas" : "Reception Staff", path: "/dashboard/users/reception" },
                { label: language === "Español" ? "Vigilantes" : "Security Staff", path: "/dashboard/users/security" },
                { label: language === "Español" ? "Servicios Generales" : "Maintenance Staff", path: "/dashboard/users/staff" },
            ],
        },
        {
            icon: _jsx(AlertCircle, { className: "w-6 h-6" }),
            label: language === "Español" ? "PQR" : "PQR",
            subitems: [
                { label: language === "Español" ? "Gestión y Asignación" : "Management and Assignment", path: "/dashboard/pqr/management" },
                { label: language === "Español" ? "Seguimiento" : "Tracking", path: "/dashboard/pqr" },
            ],
        },
        {
            icon: _jsx(Settings, { className: "w-6 h-6" }),
            label: language === "Español" ? "Configuraciones" : "Settings",
            subitems: [
                { label: language === "Español" ? "General" : "General", path: "/dashboard/configuration" },
                { label: language === "Español" ? "APIs de Pagos" : "Payment APIs", path: "/dashboard/configuration/payment-gateway" },
                { label: language === "Español" ? "WhatsApp" : "WhatsApp", path: "/dashboard/configuration/whatsapp" },
                { label: language === "Español" ? "Cámaras" : "Cameras", path: "/dashboard/configuration/cameras" },
            ],
        },
    ];
    usePassiveEvent(typeof window !== 'undefined' ? window : null, 'touchstart', (e) => {
        if (isCollapsed && e.target.closest('.sidebar')) {
            e.preventDefault();
        }
    });
    return (_jsxs("aside", { className: `sidebar bg-indigo-600 text-white transition-all duration-300 h-screen ${isCollapsed ? "w-16" : "w-64"}`, children: [_jsxs("div", { className: "p-4 flex justify-between items-center", children: [!isCollapsed && _jsx("span", { className: "text-xl font-bold", children: "Armon\u00EDa" }), _jsx(Button, { variant: "ghost", size: "icon", onClick: toggleSidebar, className: "text-white hover:bg-indigo-700", children: isCollapsed ? _jsx(ChevronRight, { className: "w-6 h-6" }) : _jsx(ChevronLeft, { className: "w-6 h-6" }) })] }), _jsx("nav", { className: "mt-4", children: sidebarItems.map((item, index) => (_jsxs("div", { children: [_jsxs(Button, { variant: "ghost", className: "w-full flex items-center justify-start p-4 hover:bg-indigo-700", onClick: () => handleItemClick(item.label, item.path), children: [item.icon, !isCollapsed && _jsx("span", { className: "ml-4", children: item.label }), !isCollapsed && item.subitems && (_jsx(ChevronDown, { className: `ml-auto w-4 h-4 transform ${expandedMenu === item.label ? "rotate-180" : ""}` }))] }), !isCollapsed && item.subitems && expandedMenu === item.label && (_jsx("div", { className: "ml-8", children: item.subitems.map((subitem, subIndex) => (_jsx(Button, { variant: "ghost", className: "w-full flex items-center justify-start p-2 hover:bg-indigo-600", onClick: () => handleItemClick(subitem.label, subitem.path), children: _jsx("span", { children: subitem.label }) }, subIndex))) }))] }, index))) })] }));
}
