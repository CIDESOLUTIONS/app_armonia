'use client';
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
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/constants/routes';
import { AlertCircle, Building, Shield, ArrowLeft, User } from 'lucide-react';
import { FormField } from '@/components/common/FormField';
export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const portalParam = searchParams.get('portal');
    const { login } = useAuthStore();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState('Español'); // Por defecto en español
    // Obtener información del portal
    const getPortalInfo = () => {
        switch (portalParam) {
            case 'admin':
                return {
                    type: 'admin',
                    title: 'Portal Administración',
                    description: 'Acceda al panel de gestión del conjunto residencial',
                    icon: _jsx(Building, { className: "h-6 w-6" }),
                    color: 'bg-indigo-600',
                    textColor: 'text-indigo-600',
                    redirectTo: ROUTES.DASHBOARD
                };
            case 'resident':
                return {
                    type: 'resident',
                    title: 'Portal Residentes',
                    description: 'Acceda a su información como residente del conjunto',
                    icon: _jsx(User, { className: "h-6 w-6" }),
                    color: 'bg-green-600',
                    textColor: 'text-green-600',
                    redirectTo: ROUTES.RESIDENT_DASHBOARD
                };
            case 'reception':
                return {
                    type: 'reception',
                    title: 'Portal Recepción',
                    description: 'Acceda al sistema de control de acceso y correspondencia',
                    icon: _jsx(Shield, { className: "h-6 w-6" }),
                    color: 'bg-amber-600',
                    textColor: 'text-amber-600',
                    redirectTo: ROUTES.RECEPTION_DASHBOARD
                };
            default:
                return {
                    type: null,
                    title: 'Iniciar Sesión',
                    description: 'Acceda a su cuenta en la plataforma Armonía',
                    icon: _jsx(Building, { className: "h-6 w-6" }),
                    color: 'bg-indigo-600',
                    textColor: 'text-indigo-600',
                    redirectTo: ROUTES.DASHBOARD
                };
        }
    };
    const portalInfo = getPortalInfo();
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setError(language === 'Español'
                ? 'Por favor, completa todos los campos.'
                : 'Please fill in all fields.');
            return;
        }
        try {
            setLoading(true);
            setError(null);
            console.log('[LoginPage] Intentando iniciar sesión para:', formData.email);
            yield login(formData.email, formData.password);
        }
        catch (err) {
            console.error('[LoginPage] Error de autenticación:', err);
            setError(language === 'Español'
                ? 'Credenciales inválidas. Por favor, verifica tu email y contraseña.'
                : 'Invalid credentials. Please verify your email and password.');
        }
        finally {
            setLoading(false);
        }
    });
    return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsx("div", { className: "mb-4 flex", children: _jsxs(Button, { variant: "ghost", onClick: () => router.push(ROUTES.PORTAL_SELECTOR), className: `${portalInfo.textColor}`, children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-1" }), "Volver al selector"] }) }), _jsxs("div", { className: "bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden", children: [_jsxs("div", { className: `${portalInfo.color} p-6 text-white`, children: [_jsxs("div", { className: "flex items-center mb-4", children: [portalInfo.icon, _jsx("h2", { className: "text-2xl font-bold ml-2", children: portalInfo.title })] }), _jsx("p", { children: portalInfo.description })] }), _jsx("div", { className: "p-8", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsx(FormField, { label: language === 'Español' ? 'Email' : 'Email', id: "email", name: "email", type: "email", value: formData.email, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { email: e.target.value })), required: true, disabled: loading, placeholder: language === 'Español' ? 'Tu correo electrónico' : 'Your email' }), _jsx(FormField, { label: language === 'Español' ? 'Contraseña' : 'Password', id: "password", name: "password", type: "password", value: formData.password, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { password: e.target.value })), required: true, disabled: loading, placeholder: language === 'Español' ? 'Tu contraseña' : 'Your password' }), error && (_jsxs("div", { className: "bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm flex items-start", children: [_jsx(AlertCircle, { className: "h-5 w-5 mr-2 flex-shrink-0 mt-0.5" }), _jsx("span", { children: error })] })), _jsx(Button, { type: "submit", className: `w-full ${portalInfo.color} hover:opacity-90 text-white h-10`, disabled: loading, children: loading
                                            ? (language === 'Español' ? 'Iniciando sesión...' : 'Logging in...')
                                            : (language === 'Español' ? 'Iniciar Sesión' : 'Log In') }), _jsx("div", { className: "flex justify-between text-sm", children: _jsx(Button, { type: "button", variant: "link", onClick: () => router.push(ROUTES.HOME), className: `${portalInfo.textColor}`, children: language === 'Español' ? 'Volver al inicio' : 'Back to home' }) })] }) })] })] }) }));
}
