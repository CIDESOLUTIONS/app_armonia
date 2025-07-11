import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Table = ({ columns, data, loading = false, onRowClick, className = '', emptyText = 'No hay datos disponibles' }) => {
    return (_jsx("div", { className: `w-full overflow-x-auto ${className}`, children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsx("tr", { children: columns.map((column) => (_jsx("th", { className: `
                  px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                  ${column.width ? `w-[${column.width}]` : ''}
                `, children: column.title }, column.key))) }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: loading ? (_jsx("tr", { children: _jsx("td", { colSpan: columns.length, className: "px-6 py-4 text-center text-sm text-gray-500", children: "Cargando..." }) })) : data.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: columns.length, className: "px-6 py-4 text-center text-sm text-gray-500", children: emptyText }) })) : (data.map((record, index) => (_jsx("tr", { onClick: () => onRowClick === null || onRowClick === void 0 ? void 0 : onRowClick(record), className: onRowClick ? 'cursor-pointer hover:bg-gray-50' : '', children: columns.map((column) => (_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: column.render
                                ? column.render(record[column.key], record)
                                : record[column.key] }, column.key))) }, index)))) })] }) }));
};
export default Table;
