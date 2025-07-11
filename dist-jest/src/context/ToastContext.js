// src/context/ToastContext.tsx
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer } from '@/components/ui/toast';
const ToastContext = createContext(undefined);
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const showToast = useCallback(({ variant, title, description }) => {
        const id = Date.now();
        setToasts(current => [...current, { id, variant, title, description }]);
        setTimeout(() => {
            setToasts(current => current.filter(toast => toast.id !== id));
        }, 3000);
    }, []);
    return (_jsxs(ToastContext.Provider, { value: { showToast }, children: [children, _jsx(ToastContainer, { toasts: toasts })] }));
}
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
