"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Eye, Trash2, Clock, MessagesSquare } from 'lucide-react';
export default function PQRList({ pqrs, onView, onEdit, onDelete, language }) {
    // Helper to render appropriate status badge
    const renderStatusBadge = (status) => {
        let bgColor = '';
        let textColor = '';
        let label = '';
        switch (status) {
            case 'NEW':
                bgColor = 'bg-blue-100';
                textColor = 'text-blue-800';
                label = language === 'Español' ? 'Nuevo' : 'New';
                break;
            case 'IN_PROGRESS':
                bgColor = 'bg-yellow-100';
                textColor = 'text-yellow-800';
                label = language === 'Español' ? 'En Progreso' : 'In Progress';
                break;
            case 'RESOLVED':
                bgColor = 'bg-green-100';
                textColor = 'text-green-800';
                label = language === 'Español' ? 'Resuelto' : 'Resolved';
                break;
            case 'CLOSED':
                bgColor = 'bg-gray-100';
                textColor = 'text-gray-800';
                label = language === 'Español' ? 'Cerrado' : 'Closed';
                break;
            case 'CANCELLED':
                bgColor = 'bg-red-100';
                textColor = 'text-red-800';
                label = language === 'Español' ? 'Cancelado' : 'Cancelled';
                break;
            default:
                bgColor = 'bg-gray-100';
                textColor = 'text-gray-800';
                label = status;
        }
        return _jsx(Badge, { className: `${bgColor} ${textColor}`, children: label });
    };
    // Helper to render appropriate priority badge
    const renderPriorityBadge = (priority) => {
        let bgColor = '';
        let textColor = '';
        let label = '';
        switch (priority) {
            case 'LOW':
                bgColor = 'bg-green-100';
                textColor = 'text-green-800';
                label = language === 'Español' ? 'Baja' : 'Low';
                break;
            case 'MEDIUM':
                bgColor = 'bg-blue-100';
                textColor = 'text-blue-800';
                label = language === 'Español' ? 'Media' : 'Medium';
                break;
            case 'HIGH':
                bgColor = 'bg-orange-100';
                textColor = 'text-orange-800';
                label = language === 'Español' ? 'Alta' : 'High';
                break;
            case 'URGENT':
                bgColor = 'bg-red-100';
                textColor = 'text-red-800';
                label = language === 'Español' ? 'Urgente' : 'Urgent';
                break;
            default:
                bgColor = 'bg-gray-100';
                textColor = 'text-gray-800';
                label = priority;
        }
        return _jsx(Badge, { className: `${bgColor} ${textColor}`, children: label });
    };
    // Helper to render appropriate type badge
    const renderTypeBadge = (type) => {
        let bgColor = '';
        let textColor = '';
        let label = '';
        switch (type) {
            case 'PETITION':
                bgColor = 'bg-indigo-100';
                textColor = 'text-indigo-800';
                label = language === 'Español' ? 'Petición' : 'Petition';
                break;
            case 'COMPLAINT':
                bgColor = 'bg-purple-100';
                textColor = 'text-purple-800';
                label = language === 'Español' ? 'Queja' : 'Complaint';
                break;
            case 'CLAIM':
                bgColor = 'bg-pink-100';
                textColor = 'text-pink-800';
                label = language === 'Español' ? 'Reclamo' : 'Claim';
                break;
            default:
                bgColor = 'bg-gray-100';
                textColor = 'text-gray-800';
                label = type;
        }
        return _jsx(Badge, { className: `${bgColor} ${textColor}`, children: label });
    };
    if (pqrs.length === 0) {
        return (_jsxs("div", { className: "bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center", children: [_jsx(MessagesSquare, { className: "mx-auto h-12 w-12 text-gray-400" }), _jsx("h3", { className: "mt-2 text-lg font-medium text-gray-900 dark:text-gray-100", children: language === 'Español' ? 'No hay solicitudes' : 'No requests' }), _jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: language === 'Español'
                        ? 'No se encontraron peticiones, quejas o reclamos'
                        : 'No petitions, complaints or claims found' })] }));
    }
    return (_jsx("div", { className: "overflow-x-auto", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "ID" }), _jsx(TableHead, { children: language === 'Español' ? 'Título' : 'Title' }), _jsx(TableHead, { children: language === 'Español' ? 'Tipo' : 'Type' }), _jsx(TableHead, { children: language === 'Español' ? 'Estado' : 'Status' }), _jsx(TableHead, { children: language === 'Español' ? 'Prioridad' : 'Priority' }), _jsx(TableHead, { children: language === 'Español' ? 'Unidad' : 'Unit' }), _jsx(TableHead, { children: language === 'Español' ? 'Residente' : 'Resident' }), _jsx(TableHead, { children: language === 'Español' ? 'Asignado' : 'Assigned' }), _jsx(TableHead, { children: language === 'Español' ? 'Fecha' : 'Date' }), _jsx(TableHead, { className: "text-right", children: language === 'Español' ? 'Acciones' : 'Actions' })] }) }), _jsx(TableBody, { children: pqrs.map((pqr) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium", children: pqr.id }), _jsx(TableCell, { className: "max-w-[150px] truncate", title: pqr.title, children: pqr.title }), _jsx(TableCell, { children: renderTypeBadge(pqr.type) }), _jsx(TableCell, { children: renderStatusBadge(pqr.status) }), _jsx(TableCell, { children: renderPriorityBadge(pqr.priority) }), _jsx(TableCell, { children: pqr.propertyUnit || '-' }), _jsx(TableCell, { children: pqr.residentName || '-' }), _jsx(TableCell, { children: pqr.assignedTo || (_jsx("span", { className: "text-gray-500 italic", children: language === 'Español' ? 'Sin asignar' : 'Unassigned' })) }), _jsx(TableCell, { className: "whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Clock, { className: "h-3 w-3 mr-1 text-gray-500" }), _jsx("span", { children: new Date(pqr.createdAt).toLocaleDateString() })] }) }), _jsxs(TableCell, { className: "text-right", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => onView(pqr), className: "text-gray-600 hover:text-gray-800 hover:bg-gray-100", children: _jsx(Eye, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => onEdit(pqr), className: "text-blue-600 hover:text-blue-800 hover:bg-blue-50", children: _jsx(Pencil, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => onDelete(pqr.id), className: "text-red-600 hover:text-red-800 hover:bg-red-50", children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }, pqr.id))) })] }) }));
}
