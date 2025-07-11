import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
/**
 * Componente de carga con diferentes tamaños y opciones
 */
export function Loading({ size = 'medium', withText = true, text = 'Cargando...', className = '', fullScreen = false, }) {
    const sizeMap = {
        small: 'h-4 w-4',
        medium: 'h-8 w-8',
        large: 'h-12 w-12',
    };
    const containerClass = cn('flex flex-col items-center justify-center', fullScreen && 'fixed inset-0 bg-white bg-opacity-70 dark:bg-gray-900 dark:bg-opacity-70 z-50', className);
    return (_jsxs("div", { className: containerClass, children: [_jsx(Loader2, { className: cn(sizeMap[size], 'animate-spin text-indigo-600 dark:text-indigo-400') }), withText && (_jsx("p", { className: cn('mt-2 text-gray-600 dark:text-gray-400', size === 'small' && 'text-xs', size === 'large' && 'text-lg'), children: text }))] }));
}
export function Spinner({ size = 24, className = '' }) {
    return _jsx(Loader2, { className: cn(`h-${size} w-${size} animate-spin`, className) });
}
