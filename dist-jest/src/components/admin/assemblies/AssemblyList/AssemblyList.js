import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Calendar, Users, Clock } from 'lucide-react';
import Table from '@/components/common/Table';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
const AssemblyList = ({ assemblies, onViewDetails, onCreateNew }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'programada': return 'warning';
            case 'en_curso': return 'info';
            case 'finalizada': return 'success';
            case 'cancelada': return 'error';
            default: return 'default';
        }
    };
    const getStatusText = (status) => {
        switch (status) {
            case 'programada': return 'Programada';
            case 'en_curso': return 'En Curso';
            case 'finalizada': return 'Finalizada';
            case 'cancelada': return 'Cancelada';
            default: return status;
        }
    };
    const columns = [
        {
            key: 'tipo',
            title: 'Tipo',
            render: (value) => (_jsx("span", { className: "capitalize", children: value }))
        },
        {
            key: 'fecha',
            title: 'Fecha',
            render: (value, record) => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Calendar, { className: "w-4 h-4 text-gray-500" }), _jsx("span", { children: value }), _jsx(Clock, { className: "w-4 h-4 text-gray-500 ml-2" }), _jsx("span", { children: record.hora })] }))
        },
        {
            key: 'estado',
            title: 'Estado',
            render: (value) => (_jsx(Badge, { variant: getStatusColor(value), children: getStatusText(value) }))
        },
        {
            key: 'quorum',
            title: 'Quórum',
            render: (value, record) => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Users, { className: "w-4 h-4 text-gray-500" }), _jsxs("span", { children: [record.participantes, "/", value, " (", Math.round(record.participantes / value * 100), "%)"] })] }))
        }
    ];
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Asambleas" }), _jsx(Button, { variant: "primary", onClick: onCreateNew, children: "Nueva Asamblea" })] }), _jsx(Table, { columns: columns, data: assemblies, onRowClick: onViewDetails })] }));
};
export default AssemblyList;
