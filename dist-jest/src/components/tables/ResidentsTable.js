// src/components/tables/ResidentsTable.tsx
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
export function ResidentsTable({ residents = [], onEdit, onDelete, onView }) {
    const [_searchTerm, _setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    // Filtrar residentes según término de búsqueda
    const filteredResidents = residents.filter((resident) => {
        const searchValue = searchTerm.toLowerCase();
        return (resident.name.toLowerCase().includes(searchValue) ||
            resident.email.toLowerCase().includes(searchValue) ||
            resident.dni.toLowerCase().includes(searchValue) ||
            resident.propertyNumber.toLowerCase().includes(searchValue));
    });
    // Calcular paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredResidents.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredResidents.length / itemsPerPage);
    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    // Formatear fecha
    const formatDate = (dateString) => {
        if (!dateString)
            return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
        catch (e) {
            return dateString;
        }
    };
    // Traducir tipo de residente
    const translateResidentType = (type) => {
        const typeMap = {
            'permanente': 'Permanente',
            'temporal': 'Temporal'
        };
        return typeMap[type] || type;
    };
    // Traducir estado
    const translateStatus = (status) => {
        const statusMap = {
            'activo': 'Activo',
            'inactivo': 'Inactivo',
            'suspendido': 'Suspendido'
        };
        return statusMap[status] || status;
    };
    return (_jsxs("div", { children: [_jsx("div", { className: "mb-4", children: _jsx(Input, { placeholder: "Buscar por nombre, email, DNI o unidad...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "max-w-sm" }) }), _jsx("div", { className: "rounded-md border", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Nombre" }), _jsx(TableHead, { children: "DNI" }), _jsx(TableHead, { children: "Email" }), _jsx(TableHead, { children: "WhatsApp" }), _jsx(TableHead, { children: "Tipo" }), _jsx(TableHead, { children: "Unidad" }), _jsx(TableHead, { children: "Estado" }), _jsx(TableHead, { className: "text-right", children: "Acciones" })] }) }), _jsx(TableBody, { children: currentItems.length > 0 ? (currentItems.map((resident) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium", children: resident.name }), _jsx(TableCell, { children: resident.dni }), _jsx(TableCell, { children: resident.email }), _jsx(TableCell, { children: resident.whatsapp || '-' }), _jsx(TableCell, { children: _jsxs("span", { className: `px-2 py-1 rounded-full text-xs ${resident.residentType === 'permanente'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-purple-100 text-purple-800'}`, children: [translateResidentType(resident.residentType), resident.residentType === 'temporal' && resident.endDate && (_jsxs("span", { className: "ml-1", children: ["(", formatDate(resident.endDate), ")"] }))] }) }), _jsx(TableCell, { children: resident.propertyNumber }), _jsx(TableCell, { children: _jsx("span", { className: `px-2 py-1 rounded-full text-xs ${resident.status === 'activo'
                                                ? 'bg-green-100 text-green-800'
                                                : resident.status === 'inactivo'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-gray-100 text-gray-800'}`, children: translateStatus(resident.status) }) }), _jsx(TableCell, { className: "text-right", children: _jsxs("div", { className: "flex justify-end space-x-2", children: [onView && (_jsx(Button, { onClick: () => onView(resident), size: "sm", variant: "ghost", className: "h-8 w-8 p-0", children: _jsx(Eye, { className: "h-4 w-4" }) })), onEdit && (_jsx(Button, { onClick: () => onEdit(resident), size: "sm", variant: "ghost", className: "h-8 w-8 p-0", children: _jsx(Edit, { className: "h-4 w-4" }) })), onDelete && (_jsx(Button, { onClick: () => onDelete(resident.id), size: "sm", variant: "ghost", className: "h-8 w-8 p-0 text-red-500 hover:text-red-700", children: _jsx(Trash, { className: "h-4 w-4" }) }))] }) })] }, resident.id)))) : (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 8, className: "text-center py-6", children: "No se encontraron residentes" }) })) })] }) }), totalPages > 1 && (_jsxs("div", { className: "flex justify-between items-center mt-4", children: [_jsxs("div", { className: "text-sm text-gray-600", children: ["Mostrando ", indexOfFirstItem + 1, "-", Math.min(indexOfLastItem, filteredResidents.length), " de", ' ', filteredResidents.length, " residentes"] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx(Button, { onClick: () => paginate(currentPage - 1), disabled: currentPage === 1, variant: "outline", size: "sm", children: "Anterior" }), Array.from({ length: totalPages }).map((_, index) => (_jsx(Button, { onClick: () => paginate(index + 1), variant: currentPage === index + 1 ? "default" : "outline", size: "sm", children: index + 1 }, index))), _jsx(Button, { onClick: () => paginate(currentPage + 1), disabled: currentPage === totalPages, variant: "outline", size: "sm", children: "Siguiente" })] })] }))] }));
}
