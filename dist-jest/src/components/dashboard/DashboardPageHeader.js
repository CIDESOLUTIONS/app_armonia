import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function DashboardPageHeader({ title, description, actions }) {
    return (_jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white", children: title }), description && (_jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-3xl", children: description }))] }), actions && (_jsx("div", { className: "flex flex-wrap gap-2 mt-2 sm:mt-0", children: actions }))] }));
}
export default DashboardPageHeader;
