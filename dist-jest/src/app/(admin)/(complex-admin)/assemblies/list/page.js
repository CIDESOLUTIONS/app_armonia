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
import AdminHeader from '@/components/admin/layout/AdminHeader';
import AdminSidebar from '@/components/admin/layout/AdminSidebar';
import { Loader2, PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { getAssemblies, deleteAssembly } from '@/services/assemblyService';
import { useToast } from '@/components/ui/use-toast';
export default function AssembliesPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [assemblies, setAssemblies] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchAssemblies = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const response = yield getAssemblies();
            setAssemblies(response.data);
        }
        catch (error) {
            console.error('Error fetching assemblies:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar las asambleas.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    }), [toast]);
    useEffect(() => {
        if (!authLoading && user) {
            fetchAssemblies();
        }
    }, [authLoading, user, fetchAssemblies]);
    const handleDeleteAssembly = (id) => __awaiter(this, void 0, void 0, function* () {
        if (confirm('¿Estás seguro de que quieres eliminar esta asamblea?')) {
            try {
                yield deleteAssembly(id);
                toast({
                    title: 'Éxito',
                    description: 'Asamblea eliminada correctamente.',
                });
                fetchAssemblies();
            }
            catch (error) {
                console.error('Error deleting assembly:', error);
                toast({
                    title: 'Error',
                    description: 'Error al eliminar la asamblea.',
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
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(AdminHeader, { adminName: (user === null || user === void 0 ? void 0 : user.name) || "Administrador", complexName: "Conjunto Residencial Armon\u00EDa", onLogout: user === null || user === void 0 ? void 0 : user.logout }), _jsxs("div", { className: "flex", children: [_jsx(AdminSidebar, { collapsed: false, onToggle: () => { } }), _jsx("main", { className: `flex-1 transition-all duration-300 ml-64 mt-16 p-6`, children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Gesti\u00F3n de Asambleas" }), _jsx(Link, { href: "/admin/assemblies/create", children: _jsxs(Button, { children: [_jsx(PlusCircle, { className: "mr-2 h-4 w-4" }), " Nueva Asamblea"] }) })] }), _jsx("div", { className: "bg-white shadow-md rounded-lg overflow-hidden", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "T\u00EDtulo" }), _jsx(TableHead, { children: "Fecha" }), _jsx(TableHead, { children: "Ubicaci\u00F3n" }), _jsx(TableHead, { children: "Tipo" }), _jsx(TableHead, { children: "Estado" }), _jsx(TableHead, {})] }) }), _jsx(TableBody, { children: assemblies.length > 0 ? (assemblies.map((assembly) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: assembly.title }), _jsx(TableCell, { children: new Date(assembly.scheduledDate).toLocaleDateString() }), _jsx(TableCell, { children: assembly.location }), _jsx(TableCell, { children: assembly.type === 'ORDINARY' ? 'Ordinaria' : 'Extraordinaria' }), _jsx(TableCell, { children: _jsx(Badge, { variant: assembly.status === 'PLANNED' ? 'secondary' : assembly.status === 'COMPLETED' ? 'default' : 'outline', children: assembly.status }) }), _jsxs(TableCell, { className: "text-right", children: [_jsx(Link, { href: `/admin/assemblies/${assembly.id}/view`, children: _jsx(Button, { variant: "ghost", size: "sm", className: "mr-2", children: _jsx(Eye, { className: "h-4 w-4" }) }) }), _jsx(Link, { href: `/admin/assemblies/${assembly.id}/edit`, children: _jsx(Button, { variant: "ghost", size: "sm", className: "mr-2", children: _jsx(Edit, { className: "h-4 w-4" }) }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDeleteAssembly(assembly.id), children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }, assembly.id)))) : (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 7, className: "text-center py-5", children: "No hay asambleas registradas." }) })) })] }) })] }) })] })] }));
}
