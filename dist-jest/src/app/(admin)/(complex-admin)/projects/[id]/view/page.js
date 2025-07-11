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
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Loader2, Edit, Trash2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { getProjects, deleteProject } from '@/services/projectService';
export default function ViewProjectPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const projectId = params.id ? parseInt(params.id) : null;
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchProject = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            // For simplicity, fetching all and filtering. In a real app, you'd have a getProjectById endpoint.
            const data = yield getProjects();
            const foundProject = data.find((p) => p.id === projectId);
            if (foundProject) {
                setProject(foundProject);
            }
            else {
                toast({
                    title: 'Error',
                    description: 'Proyecto no encontrado.',
                    variant: 'destructive',
                });
                router.push('/admin/projects/list');
            }
        }
        catch (error) {
            console.error('Error fetching project:', error);
            toast({
                title: 'Error',
                description: 'No se pudo cargar el proyecto.',
                variant: 'destructive',
            });
            router.push('/admin/projects/list');
        }
        finally {
            setLoading(false);
        }
    }), [projectId, router, toast]);
    useEffect(() => {
        if (!authLoading && user && projectId) {
            fetchProject();
        }
    }, [authLoading, user, projectId, fetchProject]);
    const handleDeleteProject = () => __awaiter(this, void 0, void 0, function* () {
        if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
            try {
                yield deleteProject(projectId);
                toast({
                    title: 'Éxito',
                    description: 'Proyecto eliminado correctamente.',
                });
                router.push('/admin/projects/list');
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
    if (!project) {
        return null; // Should not happen due to redirects above
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900", children: ["Detalles del Proyecto: ", project.name] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx(Link, { href: `/admin/projects/${project.id}/edit`, children: _jsxs(Button, { variant: "outline", children: [_jsx(Edit, { className: "mr-2 h-4 w-4" }), " Editar Proyecto"] }) }), _jsxs(Button, { variant: "destructive", onClick: handleDeleteProject, children: [_jsx(Trash2, { className: "mr-2 h-4 w-4" }), " Eliminar Proyecto"] })] })] }), _jsxs(Card, { className: "mb-6", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Informaci\u00F3n General" }) }), _jsxs(CardContent, { className: "grid gap-4", children: [_jsxs("p", { children: [_jsx("strong", { children: "Descripci\u00F3n:" }), " ", project.description || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Estado:" }), _jsx(Badge, { variant: project.status === 'COMPLETED' ? 'default' : project.status === 'PENDING' ? 'secondary' : 'outline', children: project.status })] }), _jsxs("p", { children: [_jsx("strong", { children: "Fecha de Inicio:" }), " ", new Date(project.startDate).toLocaleDateString()] }), _jsxs("p", { children: [_jsx("strong", { children: "Fecha de Fin:" }), " ", project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Asignado a:" }), " ", project.assignedToName || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Creado por:" }), " ", project.createdByName] }), _jsxs("p", { children: [_jsx("strong", { children: "Fecha de Creaci\u00F3n:" }), " ", new Date(project.createdAt).toLocaleString()] }), _jsxs("p", { children: [_jsx("strong", { children: "\u00DAltima Actualizaci\u00F3n:" }), " ", new Date(project.updatedAt).toLocaleString()] })] })] }), _jsxs(Card, { className: "mb-6", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Info, { className: "mr-2 h-5 w-5" }), " Tareas del Proyecto"] }) }), _jsxs(CardContent, { children: [_jsx("p", { className: "text-gray-600", children: "La gesti\u00F3n de tareas para este proyecto se implementar\u00E1 aqu\u00ED." }), _jsx(Button, { variant: "outline", className: "mt-4", children: "Ver Tareas" })] })] })] }));
}
