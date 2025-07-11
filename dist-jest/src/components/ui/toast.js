import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/ui/toast.tsx
import { AnimatePresence, motion } from 'framer-motion';
import { XCircle, CheckCircle, Info } from 'lucide-react';
export function Toast({ variant, title, description, onClose }) {
    const icons = {
        success: _jsx(CheckCircle, { className: "w-5 h-5 text-white" }),
        error: _jsx(XCircle, { className: "w-5 h-5 text-white" }),
        info: _jsx(Info, { className: "w-5 h-5 text-white" })
    };
    const bgColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 }, className: `${bgColors[variant]} rounded-lg shadow-lg p-4 flex items-start gap-3 min-w-[300px]`, children: [icons[variant], _jsxs("div", { className: "flex-1", children: [title && _jsx("h4", { className: "font-medium text-white", children: title }), _jsx("p", { className: "text-white text-sm", children: description })] }), _jsx("button", { onClick: onClose, className: "text-white hover:opacity-80", children: _jsx(XCircle, { className: "w-5 h-5" }) })] }));
}
export function ToastContainer({ toasts }) {
    return (_jsx("div", { className: "fixed bottom-4 right-4 z-50 flex flex-col gap-2", children: _jsx(AnimatePresence, { children: toasts.map((toast, index) => (_jsx(Toast, Object.assign({}, toast), index))) }) }));
}
