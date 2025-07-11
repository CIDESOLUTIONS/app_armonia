import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const StatisticsChart = ({ data, lines, title, className = '' }) => {
    return (_jsxs("div", { className: `bg-white p-6 rounded-lg border border-gray-200 ${className}`, children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: title }), _jsx("div", { className: "h-80", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(LineChart, { data: data, margin: {
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#E5E7EB" }), _jsx(XAxis, { dataKey: "name", stroke: "#6B7280", fontSize: 12 }), _jsx(YAxis, { stroke: "#6B7280", fontSize: 12 }), _jsx(Tooltip, {}), lines.map(line => (_jsx(Line, { type: "monotone", dataKey: line.key, stroke: line.color, name: line.name, strokeWidth: 2, dot: false }, line.key)))] }) }) })] }));
};
export default StatisticsChart;
