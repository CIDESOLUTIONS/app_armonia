import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Input = ({ name, type = 'text', value, onChange, onBlur, label, placeholder, error, required = false, disabled = false, className = '' }) => {
    const baseInputStyles = 'w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors duration-200';
    const inputStyles = `
    ${baseInputStyles}
    ${error
        ? 'border-red-300 focus:ring-red-200 bg-red-50'
        : 'border-gray-300 focus:ring-blue-200'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
    ${className}
  `;
    return (_jsxs("div", { className: "space-y-1", children: [label && (_jsxs("label", { htmlFor: name, className: "block text-sm font-medium text-gray-700", children: [label, required && _jsx("span", { className: "text-red-500 ml-1", children: "*" })] })), _jsx("input", { id: name, name: name, type: type, value: value, onChange: onChange, onBlur: onBlur, placeholder: placeholder, disabled: disabled, required: required, className: inputStyles, "aria-invalid": !!error }), error && (_jsx("p", { className: "text-sm text-red-600", children: error }))] }));
};
export default Input;
