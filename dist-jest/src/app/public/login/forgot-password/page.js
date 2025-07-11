// C:\Users\meciz\Documents\armonia\frontend\src\app\forgot-password\page.tsx
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
export default function ForgotPasswordPage() {
    const _router = useRouter();
    const [uage, _setLanguageUnused] = useState('Español');
    const [_theme, _setTheme] = useState('Claro');
    const [setCurrency] = useState('Dólares');
    const handleLoginRedirect = () => {
        router.push('/(public)/login');
    };
    return (_jsxs("div", { className: `min-h-screen flex flex-col ${theme === 'Claro' ? 'bg-gray-50' : 'bg-gray-900'}`, children: [_jsx(Header, { theme: theme, setTheme: setTheme, language: language, setLanguage: setLanguage, currency: currency, setCurrency: setCurrency }), _jsx("div", { className: "h-16" }), _jsx("main", { className: "flex-1 px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center", children: _jsxs("div", { className: "w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-4", children: uage === 'Español' ? 'Recuperar Contraseña' : 'Recover Password' }), _jsx("p", { className: "text-gray-600 dark:text-gray-300 mb-6", children: uage === 'Español'
                                ? 'Esta funcionalidad estará disponible pronto. Por ahora, vuelve al login.'
                                : 'This feature will be available soon. For now, return to login.' }), _jsx("button", { onClick: handleLoginRedirect, className: "text-indigo-600 dark:text-indigo-400 hover:underline", children: uage === 'Español' ? 'Volver al Login' : 'Back to Login' })] }) })] }));
}
