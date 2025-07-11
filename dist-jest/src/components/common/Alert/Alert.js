import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';
const Alert = ({ type = 'info', title, children, onClose, className = '' }) => {
    const styles = {
        info: {
            container: 'bg-blue-50 border-blue-200',
            icon: 'text-blue-400',
            title: 'text-blue-800',
            text: 'text-blue-700',
            closeButton: 'text-blue-500 hover:bg-blue-100'
        },
        success: {
            container: 'bg-green-50 border-green-200',
            icon: 'text-green-400',
            title: 'text-green-800',
            text: 'text-green-700',
            closeButton: 'text-green-500 hover:bg-green-100'
        },
        warning: {
            container: 'bg-yellow-50 border-yellow-200',
            icon: 'text-yellow-400',
            title: 'text-yellow-800',
            text: 'text-yellow-700',
            closeButton: 'text-yellow-500 hover:bg-yellow-100'
        },
        error: {
            container: 'bg-red-50 border-red-200',
            icon: 'text-red-400',
            title: 'text-red-800',
            text: 'text-red-700',
            closeButton: 'text-red-500 hover:bg-red-100'
        }
    };
    const icons = {
        info: _jsx(Info, { className: "h-5 w-5" }),
        success: _jsx(CheckCircle, { className: "h-5 w-5" }),
        warning: _jsx(AlertTriangle, { className: "h-5 w-5" }),
        error: _jsx(AlertCircle, { className: "h-5 w-5" })
    };
    return (_jsx("div", { className: `
        rounded-lg border p-4 ${styles[type].container} ${className}
      `, role: "alert", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: `flex-shrink-0 ${styles[type].icon}`, children: icons[type] }), _jsxs("div", { className: "ml-3 flex-1", children: [title && (_jsx("h3", { className: `text-sm font-medium ${styles[type].title}`, children: title })), _jsx("div", { className: `text-sm ${styles[type].text} ${title ? 'mt-2' : ''}`, children: children })] }), onClose && (_jsx("div", { className: "ml-auto pl-3", children: _jsxs("button", { type: "button", className: `
                inline-flex rounded-md p-1.5 focus:outline-none 
                focus:ring-2 focus:ring-offset-2 
                ${styles[type].closeButton}
              `, onClick: onClose, children: [_jsx("span", { className: "sr-only", children: "Cerrar" }), _jsx(X, { className: "h-5 w-5" })] }) }))] }) }));
};
export default Alert;
