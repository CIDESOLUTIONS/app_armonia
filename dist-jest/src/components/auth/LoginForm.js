// src/components/auth/LoginForm.tsx
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
import { useRouter } from 'next/navigation';
export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { setUser } = useAuthStore();
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setError('');
        try {
            const response = yield fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = yield response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error al iniciar sesión');
            }
            // Guardar el token y la información del usuario en el store de Zustand
            setUser(data.user, data.token);
            toast({
                title: 'Inicio de sesión exitoso',
                description: 'Redirigiendo...',
            });
            // Redirigir según el rol del usuario
            switch (data.user.role) {
                case 'ADMIN':
                case 'COMPLEX_ADMIN':
                    router.push('/admin/dashboard');
                    break;
                case 'RESIDENT':
                    router.push('/resident/dashboard');
                    break;
                case 'RECEPTION':
                    router.push('/reception/dashboard');
                    break;
                case 'APP_ADMIN':
                    router.push('/app-admin/dashboard');
                    break;
                default:
                    router.push('/portal-selector');
            }
        }
        catch (err) {
            console.error('Error:', err);
            setError(err.message || 'Error al iniciar sesión');
            toast({
                title: 'Error',
                description: err.message || 'Error al iniciar sesión',
                variant: 'destructive',
            });
        }
    });
    return (_jsxs("form", { onSubmit: handleSubmit, className: "mt-8 space-y-6", children: [error && (_jsx("div", { "data-testid": "error-message", className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded", children: error })), _jsx("div", { children: _jsx("input", { "data-testid": "email-input", type: "email", required: true, className: "appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm", placeholder: "Correo electr\u00F3nico", value: email, onChange: (e) => setEmail(e.target.value) }) }), _jsx("div", { children: _jsx("input", { "data-testid": "password-input", type: "password", required: true, className: "appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm", placeholder: "Contrase\u00F1a", value: password, onChange: (e) => setPassword(e.target.value) }) }), _jsx("div", { children: _jsx("button", { "data-testid": "login-button", type: "submit", className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500", children: "Iniciar sesi\u00F3n" }) })] }));
}
