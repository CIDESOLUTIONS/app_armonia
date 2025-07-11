"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, UserPlus, Shield, ArrowLeft, User } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { Header } from '@/components/layout/header';
export default function PortalSelector() {
    const router = useRouter();
    const [language, setLanguage] = useState("Español");
    const [theme, setTheme] = useState("Claro");
    const [currency, setCurrency] = useState("Pesos");
    // Textos según el idioma
    const texts = {
        es: {
            title: "Seleccionar Portal",
            subtitle: "Elija el tipo de acceso que necesita",
            adminPortal: "Portal Administración",
            adminDesc: "Gestión completa del conjunto residencial",
            adminFeatures: [
                "Gestión de propiedades y residentes",
                "Administración financiera",
                "Gestión de asambleas",
                "Configuración del sistema",
                "Control de seguridad y accesos"
            ],
            adminButton: "Acceder como Administrador",
            residentPortal: "Portal Residentes",
            residentDesc: "Acceso para propietarios y residentes",
            residentFeatures: [
                "Consulta de estado de cuenta",
                "Reserva de servicios comunes",
                "Participación en asambleas",
                "Gestión de PQR",
                "Acceso a documentos del conjunto"
            ],
            residentButton: "Acceder como Residente",
            receptionPortal: "Portal Recepción",
            receptionDesc: "Acceso para personal de recepción y vigilancia",
            receptionFeatures: [
                "Registro de visitantes",
                "Control de correspondencia",
                "Registro de incidentes",
                "Monitoreo de vigilancia",
                "Gestión de paquetería"
            ],
            receptionButton: "Acceder como Recepción",
            registerQuestion: "¿Necesita registrar un nuevo conjunto?",
            registerButton: "Registrar Conjunto",
            backButton: "Volver a Inicio"
        },
        en: {
            title: "Select Portal",
            subtitle: "Choose the type of access you need",
            adminPortal: "Administration Portal",
            adminDesc: "Complete management of the residential complex",
            adminFeatures: [
                "Property and resident management",
                "Financial administration",
                "Assembly management",
                "System configuration",
                "Security and access control"
            ],
            adminButton: "Access as Administrator",
            residentPortal: "Resident Portal",
            residentDesc: "Access for owners and residents",
            residentFeatures: [
                "View account status",
                "Book common services",
                "Participate in assemblies",
                "Manage requests and complaints",
                "Access to complex documents"
            ],
            residentButton: "Access as Resident",
            receptionPortal: "Reception Portal",
            receptionDesc: "Access for reception and security staff",
            receptionFeatures: [
                "Visitor registration",
                "Mail control",
                "Incident logging",
                "Security monitoring",
                "Package management"
            ],
            receptionButton: "Access as Reception",
            registerQuestion: "Need to register a new complex?",
            registerButton: "Register Complex",
            backButton: "Back to Home"
        }
    };
    const t = language === "Español" ? texts.es : texts.en;
    // Efecto para aplicar el tema en la interfaz
    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.body.classList.toggle('dark-mode', theme === 'Oscuro');
        }
    }, [theme]);
    const navigateToLogin = (portalType) => {
        // Redirigir a la página de login con el parámetro del tipo de portal
        router.push(`/login?portal=${portalType}`);
    };
    return (_jsxs("div", { className: `flex flex-col min-h-screen ${theme === "Oscuro" ? "bg-gray-900 text-white" : "bg-gradient-to-b from-indigo-50 to-gray-100 text-gray-900"}`, children: [_jsx(Header, { theme: theme, setTheme: setTheme, language: language, setLanguage: setLanguage, currency: currency, setCurrency: setCurrency, hideNavLinks: true }), _jsxs("div", { className: "container max-w-5xl px-4 py-8 mx-auto mt-6 flex-grow", children: [_jsx("div", { className: "flex items-center mb-6", children: _jsxs(Button, { variant: "ghost", onClick: () => router.push('/'), className: `${theme === "Oscuro" ? "text-indigo-400 hover:bg-indigo-950" : "text-indigo-600 hover:bg-indigo-50"}`, children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), t.backButton] }) }), _jsxs("div", { className: "mb-10 text-center", children: [_jsx("h1", { className: `text-4xl font-bold ${theme === "Oscuro" ? "text-indigo-400" : "text-indigo-600"} mb-3`, children: t.title }), _jsx("p", { className: `text-xl ${theme === "Oscuro" ? "text-gray-300" : "text-gray-600"}`, children: t.subtitle })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [_jsxs(Card, { className: `overflow-hidden transition-all hover:shadow-xl ${theme === "Oscuro" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} transform hover:-translate-y-1 duration-300`, children: [_jsxs(CardHeader, { className: "bg-indigo-600 text-white pb-6", children: [_jsxs(CardTitle, { className: "flex items-center text-xl", children: [_jsx(Building, { className: "w-6 h-6 mr-2" }), t.adminPortal] }), _jsx(CardDescription, { className: "text-indigo-100", children: t.adminDesc })] }), _jsx(CardContent, { className: "pt-6", children: _jsx("ul", { className: `space-y-2 ${theme === "Oscuro" ? "text-gray-300" : "text-gray-600"}`, children: t.adminFeatures.map((feature, index) => (_jsxs("li", { className: "flex items-start mb-2", children: [_jsx("span", { className: "w-2 h-2 bg-indigo-500 rounded-full mr-2 mt-1.5" }), _jsx("span", { children: feature })] }, `admin-feature-${index}`))) }) }), _jsx(CardFooter, { children: _jsx(Button, { className: "w-full bg-indigo-600 hover:bg-indigo-700", onClick: () => navigateToLogin('admin'), children: t.adminButton }) })] }), _jsxs(Card, { className: `overflow-hidden transition-all hover:shadow-xl ${theme === "Oscuro" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} transform hover:-translate-y-1 duration-300`, children: [_jsxs(CardHeader, { className: "bg-green-600 text-white pb-6", children: [_jsxs(CardTitle, { className: "flex items-center text-xl", children: [_jsx(User, { className: "w-6 h-6 mr-2" }), t.residentPortal] }), _jsx(CardDescription, { className: "text-green-100", children: t.residentDesc })] }), _jsx(CardContent, { className: "pt-6", children: _jsx("ul", { className: `space-y-2 ${theme === "Oscuro" ? "text-gray-300" : "text-gray-600"}`, children: t.residentFeatures.map((feature, index) => (_jsxs("li", { className: "flex items-start mb-2", children: [_jsx("span", { className: "w-2 h-2 bg-green-500 rounded-full mr-2 mt-1.5" }), _jsx("span", { children: feature })] }, `resident-feature-${index}`))) }) }), _jsx(CardFooter, { children: _jsx(Button, { className: "w-full bg-green-600 hover:bg-green-700", onClick: () => navigateToLogin('resident'), children: t.residentButton }) })] }), _jsxs(Card, { className: `overflow-hidden transition-all hover:shadow-xl ${theme === "Oscuro" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} transform hover:-translate-y-1 duration-300`, children: [_jsxs(CardHeader, { className: "bg-amber-600 text-white pb-6", children: [_jsxs(CardTitle, { className: "flex items-center text-xl", children: [_jsx(Shield, { className: "w-6 h-6 mr-2" }), t.receptionPortal] }), _jsx(CardDescription, { className: "text-amber-100", children: t.receptionDesc })] }), _jsx(CardContent, { className: "pt-6", children: _jsx("ul", { className: `space-y-2 ${theme === "Oscuro" ? "text-gray-300" : "text-gray-600"}`, children: t.receptionFeatures.map((feature, index) => (_jsxs("li", { className: "flex items-start mb-2", children: [_jsx("span", { className: "w-2 h-2 bg-amber-500 rounded-full mr-2 mt-1.5" }), _jsx("span", { children: feature })] }, `reception-feature-${index}`))) }) }), _jsx(CardFooter, { children: _jsx(Button, { className: "w-full bg-amber-600 hover:bg-amber-700", onClick: () => navigateToLogin('reception'), children: t.receptionButton }) })] })] }), _jsx("div", { className: "mt-10 text-center", children: _jsxs("div", { className: `max-w-md mx-auto p-6 rounded-lg ${theme === "Oscuro" ? "bg-gray-800" : "bg-white"} shadow-lg`, children: [_jsx("p", { className: `mb-4 ${theme === "Oscuro" ? "text-gray-300" : "text-gray-600"} font-medium`, children: t.registerQuestion }), _jsxs(Button, { variant: "outline", className: `${theme === "Oscuro" ? "border-indigo-400 text-indigo-400 hover:bg-indigo-950" : "border-indigo-600 text-indigo-600 hover:bg-indigo-50"} py-2 px-4 transform transition-transform hover:scale-105 duration-200`, onClick: () => router.push(ROUTES.REGISTER_COMPLEX), children: [_jsx(UserPlus, { className: "w-4 h-4 mr-2" }), t.registerButton] })] }) })] }), _jsx("footer", { className: `py-6 ${theme === "Oscuro" ? "bg-gray-800 text-gray-400" : "bg-gray-900 text-gray-400"}`, children: _jsx("div", { className: "container mx-auto px-4 text-center", children: _jsxs("p", { children: ["\u00A9 2025 Armon\u00EDa. ", language === "Español" ? "Todos los derechos reservados" : "All rights reserved", "."] }) }) })] }));
}
