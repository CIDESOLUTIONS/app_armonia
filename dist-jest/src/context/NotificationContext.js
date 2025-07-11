// src/context/NotificationContext.tsx
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback } from 'react';
import { Toast } from '@/components/ui/toast';
const NotificationContext = createContext(undefined);
export function NotificationProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const addToast = useCallback((message, type = 'info') => {
        const newToast = {
            id: Date.now(),
            message,
            type
        };
        setToasts(current => [...current, newToast]);
        setTimeout(() => {
            setToasts(current => current.filter(t => t.id !== newToast.id));
        }, 3000);
    }, []);
    return (_jsxs(NotificationContext.Provider, { value: { addToast }, children: [children, _jsx(Toast, { toasts: toasts })] }));
}
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
