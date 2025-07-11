// src/app/(auth)/layout.tsx
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
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import Sidebar from "@/components/layout/Sidebar";
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useToast } from '@/components/ui/use-toast';
export default function AuthLayout({ children }) {
    const { isLoggedIn, loading, adminName, complexName, logout: authLogout, initializeAuth } = useAuthStore();
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [language, _setLanguage] = useState("Español");
    const [_theme, _setTheme] = useState("Claro");
    const [_currency, _setCurrency] = useState("Pesos");
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);
    useEffect(() => {
        console.log('[AuthLayout] useEffect ejecutado');
        console.log('[AuthLayout] Estado de autenticación:', isLoggedIn);
        console.log('[AuthLayout] Estado de carga:', loading);
        console.log('[AuthLayout] URL actual:', window.location.pathname);
        if (!loading) {
            if (!isLoggedIn) {
                console.log('[AuthLayout] No autenticado, redirigiendo a portal selector');
                router.push(ROUTES.PORTAL_SELECTOR);
            }
            else {
                console.log('[AuthLayout] Autenticado, mostrando layout');
                setIsLoading(false);
            }
        }
    }, [isLoggedIn, loading, router]);
    const handleLogout = () => __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('[AuthLayout] Iniciando proceso de logout');
            const response = yield fetch('/api/auth/logout', { method: 'POST' });
            if (response.ok) {
                console.log('[AuthLayout] Logout exitoso en el API');
                yield authLogout();
                toast({
                    description: "Sesión cerrada exitosamente",
                    variant: "default"
                });
            }
            else {
                console.error("[AuthLayout] Error al cerrar sesión");
                toast({
                    title: "Error",
                    description: "Error al cerrar sesión",
                    variant: "destructive"
                });
            }
        }
        catch (error) {
            console.error("[AuthLayout] Error en logout:", error);
            toast({
                title: "Error",
                description: "Error en el proceso de cierre de sesión",
                variant: "destructive"
            });
        }
    });
    if (loading || isLoading) {
        return (_jsxs("div", { className: "flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900", children: [_jsx(Loader2, { className: "w-8 h-8 animate-spin text-indigo-600" }), _jsx("span", { className: "ml-2 text-gray-700 dark:text-gray-300", children: "Cargando..." })] }));
    }
    if (!isLoggedIn) {
        return null;
    }
    return (_jsxs("div", { className: "flex h-screen bg-gray-100 dark:bg-gray-900", children: [_jsx("div", { className: `fixed z-20 h-full ${isSidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300`, children: _jsx(Sidebar, { language: language, theme: theme || 'light', currency: currency, adminName: adminName, complexName: complexName, logout: handleLogout, isCollapsed: isSidebarCollapsed, setIsCollapsed: setIsSidebarCollapsed }) }), _jsxs("div", { className: `flex-1 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300 flex flex-col min-h-screen`, children: [_jsx(Header, { theme: theme, setTheme: setTheme, language: language, setLanguage: setLanguage, currency: currency, setCurrency: setCurrency, logout: handleLogout, isLoggedIn: isLoggedIn, complexName: complexName, adminName: adminName }), _jsx("main", { className: "pt-16 px-6 flex-1 overflow-y-auto", children: children })] })] }));
}
