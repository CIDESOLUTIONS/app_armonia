import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/inventory/PropertiesTable.tsx
import { useState } from 'react';
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash } from 'lucide-react';
export function PropertiesTable({ properties, onAdd, onEdit, onDelete }) {
    const [sortBy, setSortBy] = useState('unitNumber');
    const [sortOrder, setSortOrder] = useState('asc');
    const sortedProperties = [...properties].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a[sortBy] > b[sortBy] ? 1 : -1;
        }
        return a[sortBy] < b[sortBy] ? 1 : -1;
    });
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Inmuebles" }), _jsxs(Button, { onClick: onAdd, className: "flex items-center gap-2", children: [_jsx(Plus, { className: "w-4 h-4" }), "Agregar Inmueble"] })] }), _jsx("div", { className: "border rounded-lg", children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableHeader, { className: "cursor-pointer", onClick: () => {
                                            if (sortBy === 'unitNumber') {
                                                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                            }
                                            setSortBy('unitNumber');
                                        }, children: "N\u00FAmero/Nomenclatura" }), _jsx(TableHeader, { children: "Tipo" }), _jsx(TableHeader, { children: "Estado" }), _jsx(TableHeader, { children: "\u00C1rea" }), _jsx(TableHeader, { children: "Bloque" }), _jsx(TableHeader, { children: "Zona" }), _jsx(TableHeader, { children: "Propietario" }), _jsx(TableHeader, { children: "Acciones" })] }) }), _jsx(TableBody, { children: sortedProperties.map((property) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: property.unitNumber }), _jsx(TableCell, { children: property.type }), _jsx(TableCell, { children: _jsx("span", { className: `px-2 py-1 rounded-full text-xs ${property.status === 'AVAILABLE'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-blue-100 text-blue-800'}`, children: property.status }) }), _jsxs(TableCell, { children: [property.area, " m\u00B2"] }), _jsx(TableCell, { children: property.block }), _jsx(TableCell, { children: property.zone }), _jsx(TableCell, { children: property.ownerName ? (_jsxs("div", { children: [_jsx("div", { children: property.ownerName }), _jsx("div", { className: "text-sm text-gray-500", children: property.ownerEmail })] })) : (_jsx("span", { className: "text-gray-400", children: "Sin asignar" })) }), _jsx(TableCell, { children: _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => onEdit === null || onEdit === void 0 ? void 0 : onEdit(property), children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "outline", size: "sm", className: "text-red-600", onClick: () => onDelete === null || onDelete === void 0 ? void 0 : onDelete(property.id), children: _jsx(Trash, { className: "w-4 h-4" }) })] }) })] }, property.id))) })] }) })] }));
}
