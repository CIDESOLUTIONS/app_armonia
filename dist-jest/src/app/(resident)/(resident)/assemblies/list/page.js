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
import { Loader2, Eye, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { getAssemblies } from '@/services/assemblyService';
export default function ResidentAssembliesPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [assemblies, setAssemblies] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchAssemblies = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const response = yield getAssemblies(); // Fetch all assemblies for the complex
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
    if (authLoading || loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    if (!user) {
        return null; // Redirect handled by AuthLayout
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Asambleas del Conjunto" }), _jsx("div", { className: "bg-white shadow-md rounded-lg overflow-hidden", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "T\u00EDtulo" }), _jsx(TableHead, { children: "Fecha" }), _jsx(TableHead, { children: "Ubicaci\u00F3n" }), _jsx(TableHead, { children: "Tipo" }), _jsx(TableHead, { children: "Estado" }), _jsx(TableHead, {})] }) }), _jsx(TableBody, { children: assemblies.length > 0 ? (assemblies.map((assembly) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: assembly.title }), _jsx(TableCell, { children: new Date(assembly.scheduledDate).toLocaleDateString() }), _jsx(TableCell, { children: assembly.location }), _jsx(TableCell, { children: assembly.type === 'ORDINARY' ? 'Ordinaria' : 'Extraordinaria' }), _jsx(TableCell, { children: _jsx(Badge, { variant: assembly.status === 'PLANNED' ? 'secondary' : assembly.status === 'COMPLETED' ? 'default' : 'outline', children: assembly.status }) }), _jsxs(TableCell, { className: "text-right", children: [_jsx(Link, { href: `/resident/assemblies/${assembly.id}/view`, children: _jsxs(Button, { variant: "ghost", size: "sm", children: [_jsx(Eye, { className: "h-4 w-4" }), " Ver Detalles"] }) }), assembly.status === 'IN_PROGRESS' && (_jsxs(Button, { variant: "ghost", size: "sm", className: "ml-2", children: [_jsx(CheckCircle, { className: "h-4 w-4 text-green-600" }), " Votar"] }))] })] }, assembly.id)))) : (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 6, className: "text-center py-5", children: "No hay asambleas registradas." }) })) })] }) })] }));
}
