// src/components/ui/error/ErrorBoundary.tsx
"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function ErrorMessage({ message, retry }) {
    return (_jsxs("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex flex-col items-center text-center", children: [_jsx(AlertTriangle, { className: "w-8 h-8 text-red-500 mb-2" }), _jsx("h3", { className: "text-lg font-medium text-red-800 dark:text-red-200", children: "Error" }), _jsx("p", { className: "text-red-600 dark:text-red-300", children: message }), retry && (_jsxs(Button, { onClick: retry, variant: "outline", className: "mt-3 flex items-center gap-1", children: [_jsx(RefreshCw, { className: "w-4 h-4" }), "Reintentar"] }))] }));
}
export function ErrorBoundary({ children, fallback }) {
    const [hasError, setHasError] = useState(false);
    const [error, _setError] = useState(null);
    useEffect(() => {
        const errorHandler = (error) => {
            console.error('Error capturado por ErrorBoundary:', error);
            setError(error.error);
            setHasError(true);
        };
        window.addEventListener('error', errorHandler);
        return () => {
            window.removeEventListener('error', errorHandler);
        };
    }, []);
    if (hasError) {
        return fallback || (_jsx(ErrorMessage, { message: (error === null || error === void 0 ? void 0 : error.message) || 'Se ha producido un error inesperado.', retry: () => setHasError(false) }));
    }
    return _jsx(_Fragment, { children: children });
}
