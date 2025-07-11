import { jsx as _jsx } from "react/jsx-runtime";
const Button = ({ children, variant = 'primary', className = '', onClick, type = 'button', disabled = false }) => {
    const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-colors duration-200';
    const variantStyles = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
    };
    return (_jsx("button", { type: type, onClick: onClick, disabled: disabled, className: `
        ${baseStyles}
        ${variantStyles[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `, children: children }));
};
export default Button;
