var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { History as HistoryIcon, Filter as FilterIcon, CheckCircle, XCircle, Hourglass, Loader2 } from 'lucide-react';
import { intercomService } from '../../lib/services/intercom-service';
import { VisitStatus } from '@prisma/client';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
// Componente principal
const VisitHistory = () => {
    // Estados
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [filters, setFilters] = useState({
        status: undefined,
        startDate: null,
        endDate: null
    });
    // Función para obtener visitas
    const fetchVisits = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        try {
            // En un caso real, esto vendría de la API con el ID de la unidad del usuario actual
            const unitId = 1; // Ejemplo
            const options = {
                status: filters.status,
                startDate: filters.startDate ? format(filters.startDate, 'yyyy-MM-dd') : undefined,
                endDate: filters.endDate ? format(filters.endDate, 'yyyy-MM-dd') : undefined,
                page: page,
                pageSize: rowsPerPage
            };
            const result = yield intercomService.getVisitHistory(unitId, options);
            setVisits(result.data);
            setTotalRows(result.pagination.total);
        }
        catch (error) {
            console.error('Error al cargar visitas:', error);
        }
        finally {
            setLoading(false);
        }
    }), [filters, page, rowsPerPage]);
    // Cargar datos
    useEffect(() => {
        fetchVisits();
    }, [fetchVisits]);
    // Manejar cambio de página
    const handleChangePage = (newPage) => {
        setPage(newPage);
    };
    // Manejar cambio de filas por página
    const handleChangeRowsPerPage = (value) => {
        setRowsPerPage(parseInt(value, 10));
        setPage(1);
    };
    // Manejar cambio de filtros
    const handleFilterChange = (field, value) => {
        setFilters(prev => (Object.assign(Object.assign({}, prev), { [field]: value })));
    };
    // Resetear filtros
    const handleResetFilters = () => {
        setFilters({
            status: undefined,
            startDate: null,
            endDate: null
        });
        setPage(1);
    };
    // Renderizar badge de estado
    const renderStatusBadge = (status) => {
        const statusConfig = {
            [VisitStatus.PENDING]: {
                label: 'Pendiente',
                variant: 'secondary',
                icon: _jsx(Hourglass, { className: "h-3 w-3 mr-1" })
            },
            [VisitStatus.NOTIFIED]: {
                label: 'Notificado',
                variant: 'outline',
                icon: _jsx(Hourglass, { className: "h-3 w-3 mr-1" })
            },
            [VisitStatus.APPROVED]: {
                label: 'Aprobado',
                variant: 'default',
                icon: _jsx(CheckCircle, { className: "h-3 w-3 mr-1" })
            },
            [VisitStatus.REJECTED]: {
                label: 'Rechazado',
                variant: 'destructive',
                icon: _jsx(XCircle, { className: "h-3 w-3 mr-1" })
            },
            [VisitStatus.IN_PROGRESS]: {
                label: 'En progreso',
                variant: 'default',
                icon: _jsx(Hourglass, { className: "h-3 w-3 mr-1" })
            },
            [VisitStatus.COMPLETED]: {
                label: 'Completado',
                variant: 'default',
                icon: _jsx(CheckCircle, { className: "h-3 w-3 mr-1" })
            },
            [VisitStatus.CANCELLED]: {
                label: 'Cancelado',
                variant: 'destructive',
                icon: _jsx(XCircle, { className: "h-3 w-3 mr-1" })
            }
        };
        const config = statusConfig[status];
        return (_jsxs(Badge, { variant: config.variant, className: "flex items-center w-fit", children: [config.icon, config.label] }));
    };
    return (_jsxs(Card, { className: "shadow-sm", children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center", children: [_jsx(HistoryIcon, { className: "mr-2 h-5 w-5" }), "Historial de Visitas"] }), _jsx(CardDescription, { children: "Consulte el registro de ingresos y salidas de visitantes." })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-4", children: [_jsxs(Select, { value: filters.status || '', onValueChange: (value) => handleFilterChange('status', value || undefined), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Filtrar por estado" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "", children: "Todos" }), Object.values(VisitStatus).map(status => (_jsx(SelectItem, { value: status, children: status }, status)))] })] }), _jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", className: cn("w-full justify-start text-left font-normal", !filters.startDate && "text-muted-foreground"), children: [_jsx(CalendarIcon, { className: "mr-2 h-4 w-4" }), filters.startDate ? format(filters.startDate, "PPP", { locale: es }) : _jsx("span", { children: "Fecha inicio" })] }) }), _jsx(PopoverContent, { className: "w-auto p-0", children: _jsx(CalendarIcon, { mode: "single", selected: filters.startDate || undefined, onSelect: (date) => handleFilterChange('startDate', date), initialFocus: true, locale: es }) })] }), _jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", className: cn("w-full justify-start text-left font-normal", !filters.endDate && "text-muted-foreground"), children: [_jsx(CalendarIcon, { className: "mr-2 h-4 w-4" }), filters.endDate ? format(filters.endDate, "PPP", { locale: es }) : _jsx("span", { children: "Fecha fin" })] }) }), _jsx(PopoverContent, { className: "w-auto p-0", children: _jsx(CalendarIcon, { mode: "single", selected: filters.endDate || undefined, onSelect: (date) => handleFilterChange('endDate', date), initialFocus: true, locale: es }) })] }), _jsxs(Button, { onClick: handleResetFilters, variant: "outline", children: [_jsx(FilterIcon, { className: "mr-2 h-4 w-4" }), "Limpiar filtros"] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Visitante" }), _jsx(TableHead, { children: "Tipo" }), _jsx(TableHead, { children: "Prop\u00F3sito" }), _jsx(TableHead, { children: "Fecha" }), _jsx(TableHead, { children: "Estado" }), _jsx(TableHead, { children: "Entrada/Salida" })] }) }), _jsx(TableBody, { children: loading ? (_jsx(TableRow, { children: _jsxs(TableCell, { colSpan: 6, className: "text-center py-8", children: [_jsx(Loader2, { className: "h-8 w-8 animate-spin mx-auto" }), _jsx("p", { className: "mt-2", children: "Cargando visitas..." })] }) })) : visits.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 6, className: "text-center py-8 text-gray-500", children: "No se encontraron visitas con los filtros seleccionados" }) })) : (visits.map((visit) => (_jsxs(TableRow, { children: [_jsxs(TableCell, { children: [_jsx("p", { className: "font-medium", children: visit.visitor.name }), visit.visitor.identification && (_jsxs("p", { className: "text-xs text-gray-500", children: ["ID: ", visit.visitor.identification] }))] }), _jsx(TableCell, { children: visit.visitor.type.name }), _jsx(TableCell, { children: visit.purpose }), _jsx(TableCell, { children: format(new Date(visit.createdAt), 'dd/MM/yyyy HH:mm', { locale: es }) }), _jsx(TableCell, { children: renderStatusBadge(visit.status) }), _jsx(TableCell, { children: visit.entryTime && (_jsxs("div", { className: "text-sm", children: [_jsxs("p", { children: ["Entrada: ", format(new Date(visit.entryTime), 'HH:mm')] }), visit.exitTime && (_jsxs("p", { children: ["Salida: ", format(new Date(visit.exitTime), 'HH:mm')] }))] })) })] }, visit.id)))) })] }) }), _jsxs("div", { className: "flex justify-end items-center space-x-2 mt-4", children: [_jsxs(Select, { value: String(rowsPerPage), onValueChange: handleChangeRowsPerPage, children: [_jsx(SelectTrigger, { className: "w-[180px]", children: _jsx(SelectValue, { placeholder: "Filas por p\u00E1gina" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "5", children: "5 por p\u00E1gina" }), _jsx(SelectItem, { value: "10", children: "10 por p\u00E1gina" }), _jsx(SelectItem, { value: "25", children: "25 por p\u00E1gina" }), _jsx(SelectItem, { value: "50", children: "50 por p\u00E1gina" })] })] }), _jsx(Pagination, { children: _jsxs(PaginationContent, { children: [_jsx(PaginationItem, { children: _jsx(Button, { variant: "ghost", onClick: () => handleChangePage(page - 1), disabled: page === 1, children: "Anterior" }) }), Array.from({ length: Math.ceil(totalRows / rowsPerPage) }, (_, i) => i + 1).map(p => (_jsx(PaginationItem, { children: _jsx(Button, { variant: p === page ? "default" : "ghost", onClick: () => handleChangePage(p), children: p }) }, p))), _jsx(PaginationItem, { children: _jsx(Button, { variant: "ghost", onClick: () => handleChangePage(page + 1), disabled: page === Math.ceil(totalRows / rowsPerPage), children: "Siguiente" }) })] }) })] })] })] }));
};
export default VisitHistory;
