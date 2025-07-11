import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
const Modal = ({ isOpen, onClose, title, children, footer, size = 'md', closeOnOverlayClick = true, className = '' }) => {
    // Manejar la tecla Escape
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg'
    };
    return (_jsxs("div", { className: "fixed inset-0 z-50 overflow-y-auto", "aria-labelledby": "modal-title", role: "dialog", "aria-modal": "true", children: [_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 transition-opacity", onClick: closeOnOverlayClick ? onClose : undefined }), _jsx("div", { className: "flex min-h-screen items-center justify-center p-4", children: _jsxs("div", { className: `
            relative transform overflow-hidden rounded-lg bg-white shadow-xl
            transition-all w-full ${sizeClasses[size]} ${className}
          `, children: [title && (_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h3", { className: "text-lg font-medium text-gray-900", id: "modal-title", children: title }) })), _jsx("div", { className: "px-6 py-4", children: children }), footer && (_jsx("div", { className: "px-6 py-4 border-t border-gray-200 bg-gray-50", children: footer }))] }) })] }));
};
export default Modal;
