"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Clock, Edit, Trash2, Users, DollarSign, Info } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
export default function ServiceList({ services, onEdit, onDelete }) {
    if (!services.length) {
        return (_jsx(Card, { className: "mb-8", children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "text-center py-8", children: [_jsx(Info, { className: "w-12 h-12 mx-auto mb-4 text-gray-400" }), _jsx("h3", { className: "text-lg font-medium mb-2", children: "No hay servicios registrados" }), _jsx("p", { className: "text-gray-500", children: "Agregue servicios para que los residentes puedan utilizarlos." })] }) }) }));
    }
    return (_jsx("div", { className: "overflow-x-auto rounded-md border", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Nombre" }), _jsx(TableHead, { children: "Descripci\u00F3n" }), _jsx(TableHead, { children: "Horario" }), _jsx(TableHead, { children: "Capacidad" }), _jsx(TableHead, { children: "Costo" }), _jsx(TableHead, { children: "Estado" }), _jsx(TableHead, { className: "text-right", children: "Acciones" })] }) }), _jsx(TableBody, { children: services.map((service) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium", children: service.name }), _jsx(TableCell, { className: "max-w-xs truncate", children: service.description || "Sin descripción" }), _jsx(TableCell, { children: _jsxs("div", { className: "flex items-center", children: [_jsx(Clock, { className: "w-4 h-4 mr-2 text-gray-500" }), _jsxs("span", { children: [service.startTime, " - ", service.endTime] })] }) }), _jsx(TableCell, { children: _jsxs("div", { className: "flex items-center", children: [_jsx(Users, { className: "w-4 h-4 mr-2 text-gray-500" }), _jsxs("span", { children: [service.capacity, " personas"] })] }) }), _jsx(TableCell, { children: _jsxs("div", { className: "flex items-center", children: [_jsx(DollarSign, { className: "w-4 h-4 mr-1 text-gray-500" }), _jsx("span", { children: service.cost ? `$${service.cost.toLocaleString()}` : "Gratuito" })] }) }), _jsx(TableCell, { children: _jsx(Badge, { className: service.status === "active"
                                        ? "bg-green-500"
                                        : service.status === "inactive"
                                            ? "bg-red-500"
                                            : "bg-yellow-500", children: service.status === "active"
                                        ? "Activo"
                                        : service.status === "inactive"
                                            ? "Inactivo"
                                            : "Mantenimiento" }) }), _jsx(TableCell, { className: "text-right", children: _jsxs("div", { className: "flex justify-end", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => onEdit(service), className: "text-blue-600 hover:text-blue-800 hover:bg-blue-100", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => onDelete(service.id), className: "text-red-600 hover:text-red-800 hover:bg-red-100", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, service.id))) })] }) }));
}
