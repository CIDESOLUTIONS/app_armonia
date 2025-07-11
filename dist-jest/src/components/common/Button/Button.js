import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Loader } from 'lucide-react';
const Button = ({ children, variant = 'primary', size = 'md', type = 'button', fullWidth = false, loading = false, disabled = false, icon, onClick, className = '' }) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
    const variantStyles = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500',
        outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    };
    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
    };
    const classes = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? 'w-full' : ''}
    ${(disabled || loading) ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;
    return (_jsx("button", { type: type, disabled: disabled || loading, onClick: onClick, className: classes, children: loading ? (_jsxs(_Fragment, { children: [_jsx(Loader, { className: "w-4 h-4 mr-2 animate-spin" }), "Cargando..."] })) : (_jsxs(_Fragment, { children: [icon && _jsx("span", { className: "mr-2", children: icon }), children] })) }));
};
export default Button;
