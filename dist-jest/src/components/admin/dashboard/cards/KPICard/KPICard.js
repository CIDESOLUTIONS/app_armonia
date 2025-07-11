import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowUp, ArrowDown } from 'lucide-react';
const KPICard = ({ title, value, description, trend, icon, className = '' }) => {
    return (_jsxs("div", { className: `
      bg-white rounded-lg border border-gray-200 p-6
      ${className}
    `, children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: title }), _jsx("h3", { className: "mt-2 text-3xl font-semibold text-gray-900", children: value })] }), icon && (_jsx("div", { className: "rounded-lg bg-blue-50 p-3 text-blue-600", children: icon }))] }), (description || trend) && (_jsxs("div", { className: "mt-4 flex items-center space-x-2", children: [trend && (_jsxs("span", { className: `
              inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
              ${trend.isPositive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'}
            `, children: [trend.isPositive
                                ? _jsx(ArrowUp, { className: "w-3 h-3 mr-1" })
                                : _jsx(ArrowDown, { className: "w-3 h-3 mr-1" }), trend.value, "%"] })), description && (_jsx("span", { className: "text-sm text-gray-600", children: description }))] }))] }));
};
export default KPICard;
