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
import { getProjects, deleteProject } from '@/services/projectService';
export default function ProjectListPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        search: '',
    });
    const fetchProjects = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const data = yield getProjects(filters);
            setProjects(data);
        }
        catch (error) {
            console.error('Error fetching projects:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar los proyectos.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    }), [filters, toast]);
    useEffect(() => {
        if (!authLoading && user) {
            fetchProjects();
        }
    }, [authLoading, user, fetchProjects]);
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleDeleteProject = (id) => __awaiter(this, void 0, void 0, function* () {
        if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
            try {
                yield deleteProject(id);
                toast({
                    title: 'Éxito',
                    description: 'Proyecto eliminado correctamente.',
                });
                fetchProjects();
            }
            catch (error) {
                console.error('Error deleting project:', error);
                toast({
                    title: 'Error',
                    description: 'Error al eliminar el proyecto.',
                    variant: 'destructive',
                });
            }
        }
    });
    if (authLoading || loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    if (!user || (user.role !== 'ADMIN' && user.role !== 'COMPLEX_ADMIN')) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Acceso Denegado" }), _jsx("p", { className: "text-gray-600", children: "No tienes permisos para acceder a esta p\u00E1gina." })] }) }));
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Gesti\u00F3n de Proyectos" }), _jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsxs("div", { className: "flex space-x-4", children: [_jsx(Input, { type: "text", placeholder: "Buscar por nombre o descripci\u00F3n...", name: "search", value: filters.search, onChange: handleFilterChange, className: "w-64" }), _jsxs("select", { name: "status", value: filters.status, onChange: handleFilterChange, className: "p-2 border rounded-md", children: [_jsx("option", { value: "", children: "Todos los estados" }), _jsx("option", { value: "PENDING", children: "Pendiente" }), _jsx("option", { value: "IN_PROGRESS", children: "En Progreso" }), _jsx("option", { value: "COMPLETED", children: "Completado" }), _jsx("option", { value: "CANCELLED", children: "Cancelado" })] }), _jsxs(Button, { onClick: fetchProjects, children: [_jsx(Filter, { className: "mr-2 h-4 w-4" }), " Aplicar Filtros"] })] }), _jsx(Link, { href: "/admin/projects/create", children: _jsxs(Button, { children: [_jsx(PlusCircle, { className: "mr-2 h-4 w-4" }), " Crear Proyecto"] }) })] }), _jsx("div", { className: "bg-white shadow-md rounded-lg overflow-hidden", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Nombre" }), _jsx(TableHead, { children: "Estado" }), _jsx(TableHead, { children: "Fecha Inicio" }), _jsx(TableHead, { children: "Fecha Fin" }), _jsx(TableHead, { children: "Asignado A" }), _jsx(TableHead, { children: "Creado Por" }), _jsx(TableHead, {})] }) }), _jsx(TableBody, { children: projects.length > 0 ? (projects.map((project) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: project.name }), _jsx(TableCell, { children: _jsx(Badge, { variant: project.status === 'COMPLETED' ? 'default' : project.status === 'PENDING' ? 'secondary' : 'outline', children: project.status }) }), _jsx(TableCell, { children: new Date(project.startDate).toLocaleDateString() }), _jsx(TableCell, { children: project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A' }), _jsx(TableCell, { children: project.assignedToName || 'N/A' }), _jsx(TableCell, { children: project.createdByName }), _jsxs(TableCell, { className: "text-right", children: [_jsx(Link, { href: `/admin/projects/${project.id}/view`, children: _jsx(Button, { variant: "ghost", size: "sm", className: "mr-2", children: _jsx(Eye, { className: "h-4 w-4" }) }) }), _jsx(Link, { href: `/admin/projects/${project.id}/edit`, children: _jsx(Button, { variant: "ghost", size: "sm", className: "mr-2", children: _jsx(Edit, { className: "h-4 w-4" }) }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDeleteProject(project.id), children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }, project.id)))) : (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 7, className: "text-center py-5", children: "No hay proyectos registrados." }) })) })] }) })] }));
}
