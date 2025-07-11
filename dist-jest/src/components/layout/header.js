// src/components/layout/header.tsx
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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, Sun, Moon, DollarSign, User, LogOut, Menu, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store/authStore';
// Traducciones para el header
const headerTexts = {
    es: {
        features: "Funcionalidades",
        plans: "Planes",
        contact: "Contáctenos",
        login: "Iniciar Sesión",
        logout: "Cerrar Sesión",
        roleSelector: "Seleccionar Rol"
    },
    en: {
        features: "Features",
        plans: "Plans",
        contact: "Contact Us",
        login: "Login",
        logout: "Logout",
        roleSelector: "Select Role"
    }
};
export function Header({ theme, setTheme, langlanguage, setLanglanguage, currency, setCurrency, logout, isLoggedIn = false, complexName = null, adminName = null, hideNavLinks = false, }) {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
    const t = useTranslations('Header');
    const { user, changeUserRole } = useAuthStore(); // Obtener el usuario y la función changeUserRole
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState((user === null || user === void 0 ? void 0 : user.role) || '');
    const toggleLanguage = () => {
        const nextLocale = locale === 'es' ? 'en' : 'es';
        router.replace(pathname, { locale: nextLocale });
    };
    const toggleTheme = () => {
        setTheme(theme === 'Claro' ? 'Oscuro' : 'Claro');
        // Aplicar el tema en el body
        if (typeof document !== 'undefined') {
            document.body.classList.toggle('dark-mode', theme === 'Claro');
        }
    };
    const toggleCurrency = () => {
        setCurrency(currency === 'Pesos' ? 'Dólares' : 'Pesos');
    };
    const handleLogin = () => {
        setIsDropdownOpen(false);
        router.push(ROUTES.PORTAL_SELECTOR);
    };
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMobileMenuOpen(false);
    };
    const handleRoleChange = (event) => __awaiter(this, void 0, void 0, function* () {
        const newRole = event.target.value;
        setSelectedRole(newRole);
        if (user && user.id) {
            try {
                yield changeUserRole(newRole);
            }
            catch (error) {
                console.error('Error al cambiar el rol desde el Header:', error);
                // Revertir el rol seleccionado en caso de error
                setSelectedRole(user.role);
            }
        }
    });
    return (_jsxs("header", { className: "fixed top-0 left-0 right-0 z-50 bg-indigo-600 py-4 px-4 sm:px-6 lg:px-8 shadow-md", "data-testid": "main-header", children: [_jsxs("div", { className: "container mx-auto flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-extrabold italic text-white", children: "Armon\u00EDa" }), isLoggedIn && complexName && (_jsx("p", { className: "text-sm text-white opacity-75 ml-2", children: complexName }))] }), _jsxs("nav", { className: "hidden md:flex items-center space-x-6", children: [!hideNavLinks && (_jsxs(_Fragment, { children: [_jsx("a", { href: "#funcionalidades", className: "text-white hover:text-indigo-200 focus:outline-none", children: t.features }), _jsx("a", { href: "#planes", className: "text-white hover:text-indigo-200 focus:outline-none", children: t.plans }), _jsx("a", { href: "#contacto", className: "text-white hover:text-indigo-200 focus:outline-none", children: t.contact })] })), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("button", { onClick: toggleLanguage, className: "text-white hover:text-indigo-200 focus:outline-none flex items-center gap-1", title: langlanguage === 'Español' ? 'Cambiar a Inglés' : 'Switch to Spanish', children: [_jsx(Globe, { className: "w-5 h-5" }), _jsx("span", { className: "text-xs", children: locale.toUpperCase() })] }), _jsxs("button", { onClick: toggleTheme, className: "text-white hover:text-indigo-200 focus:outline-none flex items-center gap-1", title: theme === 'Claro' ? 'Cambiar a Oscuro' : 'Cambiar a Claro', children: [theme === 'Claro' ? _jsx(Sun, { className: "w-5 h-5" }) : _jsx(Moon, { className: "w-5 h-5" }), _jsx("span", { className: "text-xs", children: (theme === null || theme === void 0 ? void 0 : theme.substring(0, 1)) || 'C' })] }), _jsxs("button", { onClick: toggleCurrency, className: "text-white hover:text-indigo-200 focus:outline-none flex items-center gap-1", title: currency === 'Dólares' ? 'Cambiar a Pesos' : 'Switch to Dollars', children: [_jsx(DollarSign, { className: "w-5 h-5" }), _jsx("span", { className: "text-xs", children: (currency === null || currency === void 0 ? void 0 : currency.substring(0, 1)) || 'P' })] })] }), isLoggedIn ? (_jsxs("div", { className: "relative flex items-center gap-4", children: [user && user.isGlobalAdmin && (_jsxs("div", { className: "relative", children: [_jsxs("select", { value: selectedRole, onChange: handleRoleChange, className: "bg-indigo-700 text-white text-sm py-1 px-2 rounded-md appearance-none pr-8 cursor-pointer", children: [_jsx("option", { value: "ADMIN", children: "Administrador" }), _jsx("option", { value: "RESIDENT", children: "Residente" }), _jsx("option", { value: "STAFF", children: "Recepci\u00F3n/Vigilancia" }), _jsx("option", { value: "APP_ADMIN", children: "Admin App" })] }), _jsx(ChevronDown, { className: "absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" })] })), _jsxs("div", { className: "relative", children: [_jsx("button", { className: "text-white hover:text-indigo-200 focus:outline-none", onClick: () => setIsDropdownOpen(!isDropdownOpen), children: _jsx(User, { className: "w-6 h-6" }) }), isDropdownOpen && (_jsx("div", { className: "absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg", children: _jsxs("button", { className: "w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-700 flex items-center", onClick: () => {
                                                        if (logout)
                                                            logout();
                                                        setIsDropdownOpen(false);
                                                    }, children: [_jsx(LogOut, { className: "w-4 h-4 mr-2" }), t.logout] }) }))] })] })) : (_jsx(Link, { href: ROUTES.PORTAL_SELECTOR, className: "text-white hover:text-indigo-200 transition-colors px-4 py-2 border border-white rounded hover:bg-indigo-700", children: t.login }))] }), _jsx("button", { className: "md:hidden text-white focus:outline-none", onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen), "data-testid": "mobile-menu-button", children: _jsx(Menu, { className: "h-6 w-6" }) })] }), isMobileMenuOpen && (_jsx("div", { className: "md:hidden mt-4 pb-4", children: _jsxs("div", { className: "flex flex-col space-y-4 border-t border-indigo-500 pt-4", children: [!hideNavLinks && (_jsxs(_Fragment, { children: [_jsx("a", { href: "#funcionalidades", className: "text-white hover:text-indigo-200 px-4", onClick: () => scrollToSection('funcionalidades'), children: t.features }), _jsx("a", { href: "#planes", className: "text-white hover:text-indigo-200 px-4", onClick: () => scrollToSection('planes'), children: t.plans }), _jsx("a", { href: "#contacto", className: "text-white hover:text-indigo-200 px-4", onClick: () => scrollToSection('contacto'), children: t.contact })] })), _jsxs("div", { className: "flex items-center gap-4 px-4", children: [_jsxs("button", { onClick: toggleLanguage, className: "text-white hover:text-indigo-200 focus:outline-none flex items-center gap-1", children: [_jsx(Globe, { className: "w-5 h-5" }), _jsx("span", { className: "text-xs", children: locale.toUpperCase() })] }), _jsxs("button", { onClick: toggleTheme, className: "text-white hover:text-indigo-200 focus:outline-none flex items-center gap-1", children: [theme === 'Claro' ? _jsx(Sun, { className: "w-5 h-5" }) : _jsx(Moon, { className: "w-5 h-5" }), _jsx("span", { className: "text-xs", children: theme.substring(0, 1) })] }), _jsxs("button", { onClick: toggleCurrency, className: "text-white hover:text-indigo-200 focus:outline-none flex items-center gap-1", children: [_jsx(DollarSign, { className: "w-5 h-5" }), _jsx("span", { className: "text-xs", children: currency.substring(0, 1) })] })] }), _jsx("div", { className: "flex flex-col space-y-2 px-4", children: _jsx(Link, { href: ROUTES.PORTAL_SELECTOR, className: "text-white hover:text-indigo-200 transition-colors px-4 py-2 border border-white rounded hover:bg-indigo-700 text-center", onClick: () => setIsMobileMenuOpen(false), children: t.login }) })] }) }))] }));
}
