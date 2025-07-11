import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const TrendChart = ({ data, title, yAxisLabel, className = '' }) => {
    var _a;
    return (_jsxs("div", { className: `bg-white p-6 rounded-lg border border-gray-200 ${className}`, children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: title }), _jsx("div", { className: "h-80", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: data, margin: {
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#E5E7EB" }), _jsx(XAxis, { dataKey: "name", stroke: "#6B7280", fontSize: 12 }), _jsx(YAxis, { stroke: "#6B7280", fontSize: 12, label: yAxisLabel ? {
                                    value: yAxisLabel,
                                    angle: -90,
                                    position: 'insideLeft'
                                } : undefined }), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "value", fill: "#3B82F6", radius: [4, 4, 0, 0] }), ((_a = data[0]) === null || _a === void 0 ? void 0 : _a.target) && (_jsx(Bar, { dataKey: "target", fill: "#E5E7EB", radius: [4, 4, 0, 0] }))] }) }) })] }));
};
export default TrendChart;
