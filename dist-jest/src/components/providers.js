'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { TranslationProvider } from '@/context/TranslationContext';
import { ToastProvider } from '@/components/ui/use-toast';
export function Providers({ children }) {
    return (_jsx(TranslationProvider, { children: _jsx(ToastProvider, { children: children }) }));
}
