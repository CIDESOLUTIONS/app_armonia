// src/components/pqr/PQRList.tsx
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Search, SlidersHorizontal, X, RefreshCw } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { usePQR } from '@/hooks/usePQR';
// PQR Enums
var PQRStatus;
(function (PQRStatus) {
    PQRStatus["OPEN"] = "OPEN";
    PQRStatus["IN_PROGRESS"] = "IN_PROGRESS";
    PQRStatus["RESOLVED"] = "RESOLVED";
    PQRStatus["CLOSED"] = "CLOSED";
    PQRStatus["REJECTED"] = "REJECTED";
})(PQRStatus || (PQRStatus = {}));
var PQRPriority;
(function (PQRPriority) {
    PQRPriority["LOW"] = "LOW";
    PQRPriority["MEDIUM"] = "MEDIUM";
    PQRPriority["HIGH"] = "HIGH";
    PQRPriority["URGENT"] = "URGENT";
})(PQRPriority || (PQRPriority = {}));
var PQRType;
(function (PQRType) {
    PQRType["PETITION"] = "PETITION";
    PQRType["COMPLAINT"] = "COMPLAINT";
    PQRType["CLAIM"] = "CLAIM";
})(PQRType || (PQRType = {}));
import { PQRDetailDialog } from './PQRDetailDialog';
import { CreatePQRForm } from './CreatePQRForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ErrorMessage } from '@/components/ui/error/ErrorBoundary';
export function PQRList({ initialLimit = 10, showFilters = true, showPagination = true, showCreate = true, title = "Solicitudes", description = "Lista de peticiones, quejas y reclamos", }) {
    // Estados para filtros
    const [filters, setFilters] = useState({
        status: "",
        priority: "",
        type: "",
        search: "",
        showFilters: false,
    });
    // Hook PQR con filtros
    const { pqrs, loading, error, pagination, refresh, loadPage, createPQR, } = usePQR({
        page: 1,
        limit: initialLimit,
        status: filters.status || undefined,
        autoLoad: true,
    });
    // Estados para diálogos
    const [selectedPQR, setSelectedPQR] = useState(null);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    // Handle filter changes with debouncing
    useEffect(() => {
        const handler = setTimeout(() => {
            refresh();
        }, 300);
        return () => clearTimeout(handler);
    }, [filters.status, filters.priority, filters.type, filters.search, refresh]);
    // Función para obtener el color de badge según el estado
    const getStatusColor = (status) => {
        switch (status) {
            case PQRStatus.PENDING:
                return "bg-yellow-500";
            case PQRStatus.IN_PROGRESS:
                return "bg-blue-500";
            case PQRStatus.RESOLVED:
                return "bg-green-500";
            case PQRStatus.CLOSED:
                return "bg-gray-500";
            case PQRStatus.CANCELLED:
                return "bg-red-500";
            default:
                return "bg-gray-400";
        }
    };
    // Función para obtener el texto del estado
    const getStatusText = (status) => {
        switch (status) {
            case PQRStatus.PENDING:
                return "Pendiente";
            case PQRStatus.IN_PROGRESS:
                return "En proceso";
            case PQRStatus.RESOLVED:
                return "Resuelto";
            case PQRStatus.CLOSED:
                return "Cerrado";
            case PQRStatus.CANCELLED:
                return "Cancelado";
            default:
                return status;
        }
    };
    // Función para obtener el texto de la prioridad
    const getPriorityText = (priority) => {
        switch (priority) {
            case PQRPriority.LOW:
                return "Baja";
            case PQRPriority.MEDIUM:
                return "Media";
            case PQRPriority.HIGH:
                return "Alta";
            case PQRPriority.URGENT:
                return "Urgente";
            default:
                return priority;
        }
    };
    // Función para obtener el color de la prioridad
    const getPriorityColor = (priority) => {
        switch (priority) {
            case PQRPriority.LOW:
                return "bg-blue-400";
            case PQRPriority.MEDIUM:
                return "bg-yellow-400";
            case PQRPriority.HIGH:
                return "bg-orange-500";
            case PQRPriority.URGENT:
                return "bg-red-600";
            default:
                return "bg-gray-400";
        }
    };
    // Función para obtener el texto del tipo
    const getTypeText = (type) => {
        switch (type) {
            case PQRType.PETITION:
                return "Petición";
            case PQRType.COMPLAINT:
                return "Queja";
            case PQRType.CLAIM:
                return "Reclamo";
            default:
                return type;
        }
    };
    // Función para abrir el detalle de un PQR
    const handleViewDetail = (pqrId) => {
        setSelectedPQR(pqrId);
        setShowDetailDialog(true);
    };
    // Función para manejar cambio de página
    const handlePageChange = (page) => {
        loadPage(page);
    };
    // Función para limpiar los filtros
    const clearFilters = () => {
        setFilters({
            status: "",
            priority: "",
            type: "",
            search: "",
            showFilters: false,
        });
    };
    return (_jsxs(Card, { className: "w-full", children: [_jsxs(CardHeader, { children: [_jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start gap-4", children: [_jsxs("div", { children: [_jsx(CardTitle, { children: title }), _jsx(CardDescription, { children: description })] }), _jsxs("div", { className: "flex items-center gap-2 self-end", children: [showCreate && (_jsxs(Button, { variant: "default", className: "flex items-center gap-1", onClick: () => setShowCreateDialog(true), children: [_jsx(PlusCircle, { className: "h-4 w-4" }), "Nueva solicitud"] })), showFilters && (_jsxs(Button, { variant: filters.showFilters ? "default" : "outline", className: "flex items-center gap-1", onClick: () => setFilters(prev => (Object.assign(Object.assign({}, prev), { showFilters: !prev.showFilters }))), children: [_jsx(SlidersHorizontal, { className: "h-4 w-4" }), filters.showFilters ? "Ocultar filtros" : "Filtros"] })), _jsx(Button, { variant: "outline", size: "icon", onClick: () => refresh(), title: "Refrescar", children: _jsx(RefreshCw, { className: "h-4 w-4" }) })] })] }), showFilters && filters.showFilters && (_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "filter-status", children: "Estado" }), _jsxs(Select, { value: filters.status, onValueChange: (value) => setFilters(prev => (Object.assign(Object.assign({}, prev), { status: value }))), children: [_jsx(SelectTrigger, { id: "filter-status", children: _jsx(SelectValue, { placeholder: "Todos los estados" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "", children: "Todos los estados" }), _jsx(SelectItem, { value: PQRStatus.PENDING, children: "Pendiente" }), _jsx(SelectItem, { value: PQRStatus.IN_PROGRESS, children: "En proceso" }), _jsx(SelectItem, { value: PQRStatus.RESOLVED, children: "Resuelto" }), _jsx(SelectItem, { value: PQRStatus.CLOSED, children: "Cerrado" }), _jsx(SelectItem, { value: PQRStatus.CANCELLED, children: "Cancelado" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "filter-priority", children: "Prioridad" }), _jsxs(Select, { value: filters.priority, onValueChange: (value) => setFilters(prev => (Object.assign(Object.assign({}, prev), { priority: value }))), children: [_jsx(SelectTrigger, { id: "filter-priority", children: _jsx(SelectValue, { placeholder: "Todas las prioridades" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "", children: "Todas las prioridades" }), _jsx(SelectItem, { value: PQRPriority.LOW, children: "Baja" }), _jsx(SelectItem, { value: PQRPriority.MEDIUM, children: "Media" }), _jsx(SelectItem, { value: PQRPriority.HIGH, children: "Alta" }), _jsx(SelectItem, { value: PQRPriority.URGENT, children: "Urgente" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "filter-type", children: "Tipo" }), _jsxs(Select, { value: filters.type, onValueChange: (value) => setFilters(prev => (Object.assign(Object.assign({}, prev), { type: value }))), children: [_jsx(SelectTrigger, { id: "filter-type", children: _jsx(SelectValue, { placeholder: "Todos los tipos" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "", children: "Todos los tipos" }), _jsx(SelectItem, { value: PQRType.PETITION, children: "Petici\u00F3n" }), _jsx(SelectItem, { value: PQRType.COMPLAINT, children: "Queja" }), _jsx(SelectItem, { value: PQRType.CLAIM, children: "Reclamo" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "filter-search", children: "Buscar" }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx(Input, { id: "filter-search", placeholder: "Buscar por t\u00EDtulo o descripci\u00F3n...", className: "pl-8", value: filters.search, onChange: (e) => setFilters(prev => (Object.assign(Object.assign({}, prev), { search: e.target.value }))) }), filters.search && (_jsx("button", { className: "absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600", onClick: () => setFilters(prev => (Object.assign(Object.assign({}, prev), { search: "" }))), "aria-label": "Borrar b\u00FAsqueda", children: _jsx(X, { className: "h-4 w-4" }) }))] })] }), _jsx("div", { className: "col-span-full flex justify-end", children: _jsxs(Button, { variant: "ghost", size: "sm", onClick: clearFilters, className: "flex items-center gap-1 text-gray-500 hover:text-gray-700", children: [_jsx(X, { className: "h-3.5 w-3.5" }), "Limpiar filtros"] }) })] }))] }), _jsxs(CardContent, { children: [error && (_jsx(ErrorMessage, { message: error, retry: () => refresh() })), _jsx("div", { className: "relative overflow-x-auto", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "ID" }), _jsx(TableHead, { children: "T\u00EDtulo" }), _jsx(TableHead, { children: "Estado" }), _jsx(TableHead, { children: "Prioridad" }), _jsx(TableHead, { children: "Tipo" }), _jsx(TableHead, { children: "Fecha" }), _jsx(TableHead, { className: "text-right", children: "Acci\u00F3n" })] }) }), _jsx(TableBody, { children: loading ? (
                                    // Fila de carga
                                    _jsx(TableRow, { children: _jsx(TableCell, { colSpan: 7, className: "text-center py-10", children: _jsxs("div", { className: "flex justify-center items-center", children: [_jsx("div", { className: "animate-spin h-6 w-6 border-4 border-indigo-600 rounded-full border-t-transparent" }), _jsx("span", { className: "ml-2", children: "Cargando..." })] }) }) })) : pqrs.length === 0 ? (
                                    // Fila de no resultados
                                    _jsx(TableRow, { children: _jsxs(TableCell, { colSpan: 7, className: "text-center py-10", children: [_jsx("p", { className: "text-gray-500", children: "No se encontraron solicitudes" }), _jsx(Button, { variant: "outline", size: "sm", onClick: clearFilters, className: "mt-2", children: "Limpiar filtros" })] }) })) : (
                                    // Filas de datos
                                    pqrs.map((item) => (_jsxs(TableRow, { className: "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900", children: [_jsx(TableCell, { onClick: () => handleViewDetail(item.id), children: item.id }), _jsx(TableCell, { onClick: () => handleViewDetail(item.id), className: "font-medium", children: item.title }), _jsx(TableCell, { onClick: () => handleViewDetail(item.id), children: _jsx(Badge, { variant: "outline", className: getStatusColor(item.status), children: getStatusText(item.status) }) }), _jsx(TableCell, { onClick: () => handleViewDetail(item.id), children: _jsx(Badge, { variant: "outline", className: getPriorityColor(item.priority), children: getPriorityText(item.priority) }) }), _jsx(TableCell, { onClick: () => handleViewDetail(item.id), children: getTypeText(item.type) }), _jsx(TableCell, { onClick: () => handleViewDetail(item.id), children: formatDistanceToNow(new Date(item.createdAt), {
                                                    addSuffix: true,
                                                    locale: es
                                                }) }), _jsx(TableCell, { className: "text-right", children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleViewDetail(item.id), children: "Ver" }) })] }, item.id)))) })] }) }), showPagination && pqrs.length > 0 && pagination && (_jsx("div", { className: "mt-4", children: _jsx(Pagination, { currentPage: pagination.page, totalPages: pagination.totalPages, onPageChange: handlePageChange }) }))] }), _jsx(PQRDetailDialog, { isOpen: showDetailDialog, onClose: () => setShowDetailDialog(false), pqrId: selectedPQR, onStatusChange: () => refresh() }), _jsx(Dialog, { open: showCreateDialog, onOpenChange: setShowCreateDialog, children: _jsxs(DialogContent, { className: "max-w-2xl", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Nueva Solicitud" }) }), _jsx(CreatePQRForm, { onSuccess: () => {
                                setShowCreateDialog(false);
                                refresh();
                            }, onCancel: () => setShowCreateDialog(false) })] }) })] }));
}
