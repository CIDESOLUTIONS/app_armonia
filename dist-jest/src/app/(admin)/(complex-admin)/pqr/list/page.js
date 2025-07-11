'use client';
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
import { useAuthStore } from '@/store/authStore';
import { Filter, Loader2, PlusCircle, Eye, Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { getPQRs, deletePQR } from '@/services/pqrService';
export default function PQRListPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [pqrs, setPqrs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        search: '',
    });
    const fetchPQRs = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const data = yield getPQRs(filters);
            setPqrs(data);
        }
        catch (error) {
            console.error('Error fetching PQRs:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar las PQRs.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    }), [filters, toast]);
    useEffect(() => {
        if (!authLoading && user) {
            fetchPQRs();
        }
    }, [authLoading, user, fetchPQRs]);
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleDeletePQR = (id) => __awaiter(this, void 0, void 0, function* () {
        if (confirm('¿Estás seguro de que quieres eliminar esta PQR?')) {
            try {
                yield deletePQR(id);
                toast({
                    title: 'Éxito',
                    description: 'PQR eliminada correctamente.',
                });
                fetchPQRs();
            }
            catch (error) {
                console.error('Error deleting PQR:', error);
                toast({
                    title: 'Error',
                    description: 'Error al eliminar la PQR.',
                    variant: 'destructive',
                });
            }
        }
    });
    if (authLoading || loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    if (!user || (user.role !== 'ADMIN' && user.role !== 'COMPLEX_ADMIN' && user.role !== 'STAFF')) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Acceso Denegado" }), _jsx("p", { className: "text-gray-600", children: "No tienes permisos para acceder a esta p\u00E1gina." })] }) }));
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Gesti\u00F3n de PQR" }), _jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsxs("div", { className: "flex space-x-4", children: [_jsx(Input, { type: "text", placeholder: "Buscar por asunto o descripci\u00F3n...", name: "search", value: filters.search, onChange: handleFilterChange, className: "w-64" }), _jsxs("select", { name: "status", value: filters.status, onChange: handleFilterChange, className: "p-2 border rounded-md", children: [_jsx("option", { value: "", children: "Todos los estados" }), _jsx("option", { value: "OPEN", children: "Abierta" }), _jsx("option", { value: "IN_PROGRESS", children: "En Progreso" }), _jsx("option", { value: "CLOSED", children: "Cerrada" }), _jsx("option", { value: "REJECTED", children: "Rechazada" })] }), _jsxs("select", { name: "priority", value: filters.priority, onChange: handleFilterChange, className: "p-2 border rounded-md", children: [_jsx("option", { value: "", children: "Todas las prioridades" }), _jsx("option", { value: "LOW", children: "Baja" }), _jsx("option", { value: "MEDIUM", children: "Media" }), _jsx("option", { value: "HIGH", children: "Alta" })] }), _jsxs(Button, { onClick: fetchPQRs, children: [_jsx(Filter, { className: "mr-2 h-4 w-4" }), " Aplicar Filtros"] })] }), _jsx(Link, { href: "/admin/pqr/create", children: _jsxs(Button, { children: [_jsx(PlusCircle, { className: "mr-2 h-4 w-4" }), " Crear PQR"] }) })] }), _jsx("div", { className: "bg-white shadow-md rounded-lg overflow-hidden", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Asunto" }), _jsx(TableHead, { children: "Reportado Por" }), _jsx(TableHead, { children: "Asignado A" }), _jsx(TableHead, { children: "Estado" }), _jsx(TableHead, { children: "Prioridad" }), _jsx(TableHead, { children: "Fecha Creaci\u00F3n" }), _jsx(TableHead, {})] }) }), _jsx(TableBody, { children: pqrs.length > 0 ? (pqrs.map((pqr) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: pqr.subject }), _jsx(TableCell, { children: pqr.reportedByName }), _jsx(TableCell, { children: pqr.assignedToName || 'N/A' }), _jsx(TableCell, { children: _jsx(Badge, { variant: pqr.status === 'OPEN' ? 'destructive' : pqr.status === 'IN_PROGRESS' ? 'secondary' : 'default', children: pqr.status }) }), _jsx(TableCell, { children: _jsx(Badge, { variant: pqr.priority === 'HIGH' ? 'destructive' : pqr.priority === 'MEDIUM' ? 'secondary' : 'default', children: pqr.priority }) }), _jsx(TableCell, { children: new Date(pqr.createdAt).toLocaleDateString() }), _jsxs(TableCell, { className: "text-right", children: [_jsx(Link, { href: `/admin/pqr/${pqr.id}/view`, children: _jsx(Button, { variant: "ghost", size: "sm", className: "mr-2", children: _jsx(Eye, { className: "h-4 w-4" }) }) }), _jsx(Link, { href: `/admin/pqr/${pqr.id}/edit`, children: _jsx(Button, { variant: "ghost", size: "sm", className: "mr-2", children: _jsx(Edit, { className: "h-4 w-4" }) }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDeletePQR(pqr.id), children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }, pqr.id)))) : (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 7, className: "text-center py-5", children: "No hay PQRs registradas." }) })) })] }) })] }));
}
