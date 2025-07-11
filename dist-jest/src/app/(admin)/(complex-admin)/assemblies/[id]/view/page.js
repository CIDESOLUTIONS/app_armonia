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
import { Loader2, Calendar, MapPin, FileText, Users, CheckCircle, XCircle, Edit, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { getAssemblies } from '@/services/assemblyService';
import { useToast } from '@/components/ui/use-toast';
export default function ViewAssemblyPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const assemblyId = params.id ? parseInt(params.id) : null;
    const [assembly, setAssembly] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchAssembly = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            // For simplicity, fetching all and filtering. In a real app, you'd have a getAssemblyById endpoint.
            const response = yield getAssemblies();
            const foundAssembly = response.data.find((a) => a.id === assemblyId);
            if (foundAssembly) {
                setAssembly(foundAssembly);
            }
            else {
                toast({
                    title: 'Error',
                    description: 'Asamblea no encontrada.',
                    variant: 'destructive',
                });
                router.push('/admin/assemblies');
            }
        }
        catch (error) {
            console.error('Error fetching assembly:', error);
            toast({
                title: 'Error',
                description: 'No se pudo cargar la asamblea.',
                variant: 'destructive',
            });
            router.push('/admin/assemblies');
        }
        finally {
            setLoading(false);
        }
    }), [assemblyId, router, toast]);
    useEffect(() => {
        if (!authLoading && user && assemblyId) {
            fetchAssembly();
        }
    }, [authLoading, user, assemblyId, fetchAssembly]);
    if (authLoading || loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    if (!user || (user.role !== 'ADMIN' && user.role !== 'COMPLEX_ADMIN' && user.role !== 'RESIDENT')) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Acceso Denegado" }), _jsx("p", { className: "text-gray-600", children: "No tienes permisos para acceder a esta p\u00E1gina." })] }) }));
    }
    if (!assembly) {
        return null; // Should not happen due to redirects above
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Detalles de la Asamblea" }), _jsx(Link, { href: `/admin/assemblies/${assembly.id}/edit`, children: _jsxs(Button, { variant: "outline", children: [_jsx(Edit, { className: "mr-2 h-4 w-4" }), " Editar Asamblea"] }) })] }), _jsxs(Card, { className: "mb-6", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: assembly.title }) }), _jsxs(CardContent, { className: "grid gap-4", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Calendar, { className: "mr-2 h-5 w-5 text-gray-600" }), _jsxs("span", { children: ["Fecha: ", new Date(assembly.scheduledDate).toLocaleDateString()] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Clock, { className: "mr-2 h-5 w-5 text-gray-600" }), _jsxs("span", { children: ["Hora: ", new Date(assembly.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx(MapPin, { className: "mr-2 h-5 w-5 text-gray-600" }), _jsxs("span", { children: ["Ubicaci\u00F3n: ", assembly.location] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx(FileText, { className: "mr-2 h-5 w-5 text-gray-600" }), _jsxs("span", { children: ["Tipo: ", assembly.type === 'ORDINARY' ? 'Ordinaria' : 'Extraordinaria'] })] }), _jsxs("div", { className: "flex items-center", children: [assembly.status === 'COMPLETED' ? (_jsx(CheckCircle, { className: "mr-2 h-5 w-5 text-green-600" })) : assembly.status === 'CANCELLED' ? (_jsx(XCircle, { className: "mr-2 h-5 w-5 text-red-600" })) : (_jsx(Clock, { className: "mr-2 h-5 w-5 text-yellow-600" })), _jsxs("span", { children: ["Estado: ", _jsx(Badge, { children: assembly.status })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold mt-4 mb-2", children: "Descripci\u00F3n:" }), _jsx("p", { children: assembly.description || 'No hay descripción disponible.' })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold mt-4 mb-2", children: "Agenda:" }), _jsx("div", { className: "whitespace-pre-wrap border p-4 rounded-md bg-gray-50", children: assembly.agenda })] })] })] }), _jsxs(Card, { className: "mb-6", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Users, { className: "mr-2 h-5 w-5" }), " Qu\u00F3rum y Asistencia"] }) }), _jsxs(CardContent, { children: [_jsx("p", { className: "text-gray-600", children: "La funcionalidad de verificaci\u00F3n de qu\u00F3rum y registro de asistencia se implementar\u00E1 aqu\u00ED." }), _jsx(Button, { variant: "outline", className: "mt-4", children: "Gestionar Asistencia" })] })] }), _jsxs(Card, { className: "mb-6", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(CheckCircle, { className: "mr-2 h-5 w-5" }), " Votaciones"] }) }), _jsxs(CardContent, { children: [_jsx("p", { className: "text-gray-600", children: "El sistema de votaciones en l\u00EDnea y resultados en tiempo real se implementar\u00E1 aqu\u00ED." }), _jsx(Button, { variant: "outline", className: "mt-4", children: "Iniciar Votaci\u00F3n" })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(FileText, { className: "mr-2 h-5 w-5" }), " Actas y Documentos"] }) }), _jsxs(CardContent, { children: [_jsx("p", { className: "text-gray-600", children: "La elaboraci\u00F3n y firma digital de actas, junto con el repositorio de documentos, se implementar\u00E1 aqu\u00ED." }), _jsx(Button, { variant: "outline", className: "mt-4", children: "Ver Actas" })] })] })] }));
}
