import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Card = ({ children, title, icon, className = '' }) => {
    return (_jsxs("div", { className: `bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`, children: [(title || icon) && (_jsxs("div", { className: "flex items-center space-x-3 mb-4", children: [icon && (_jsx("div", { className: "text-gray-500", children: icon })), title && (_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: title }))] })), children] }));
};
export default Card;
