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
import { Loader2, FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { getAssemblies } from '@/services/assemblyService';
export default function ViewResidentAssemblyPage() {
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
                // Add mock voting data for demonstration
                setAssembly(Object.assign(Object.assign({}, foundAssembly), { votingActive: foundAssembly.status === 'IN_PROGRESS', votingOptions: [
                        { id: 1, text: 'A favor', votes: 0 },
                        { id: 2, text: 'En contra', votes: 0 },
                        { id: 3, text: 'Abstención', votes: 0 },
                    ], userVote: null }));
            }
            else {
                toast({
                    title: 'Error',
                    description: 'Asamblea no encontrada.',
                    variant: 'destructive',
                });
                router.push('/resident/assemblies');
            }
        }
        catch (error) {
            console.error('Error fetching assembly:', error);
            toast({
                title: 'Error',
                description: 'No se pudo cargar la asamblea.',
                variant: 'destructive',
            });
            router.push('/resident/assemblies');
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
    const handleVote = (optionId) => __awaiter(this, void 0, void 0, function* () {
        if (!assembly || !user)
            return;
        setLoading(true);
        try {
            // Placeholder for API call to register vote
            console.log(`User ${user.id} voted for option ${optionId} in assembly ${assembly.id}`);
            yield new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            setAssembly(prev => {
                var _a;
                if (!prev)
                    return null;
                const updatedOptions = (_a = prev.votingOptions) === null || _a === void 0 ? void 0 : _a.map(opt => opt.id === optionId ? Object.assign(Object.assign({}, opt), { votes: opt.votes + 1 }) : opt);
                return Object.assign(Object.assign({}, prev), { votingOptions: updatedOptions, userVote: optionId });
            });
            toast({
                title: 'Éxito',
                description: 'Voto registrado correctamente (simulado).',
            });
        }
        catch (error) {
            console.error('Error registering vote:', error);
            toast({
                title: 'Error',
                description: 'Error al registrar el voto.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    });
    if (authLoading || loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    if (!user) {
        return null; // Redirect handled by AuthLayout
    }
    if (!assembly) {
        return null; // Should not happen due to redirects above
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("div", { className: "flex justify-between items-center mb-6", children: _jsxs("h1", { className: "text-3xl font-bold text-gray-900", children: ["Detalles de la Asamblea: ", assembly.title] }) }), _jsxs(Card, { className: "mb-6", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Informaci\u00F3n de la Asamblea" }) }), _jsxs(CardContent, { className: "grid gap-4", children: [_jsxs("p", { children: [_jsx("strong", { children: "Descripci\u00F3n:" }), " ", assembly.description || 'No hay descripción disponible.'] }), _jsxs("p", { children: [_jsx("strong", { children: "Fecha:" }), " ", new Date(assembly.scheduledDate).toLocaleDateString()] }), _jsxs("p", { children: [_jsx("strong", { children: "Hora:" }), " ", new Date(assembly.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })] }), _jsxs("p", { children: [_jsx("strong", { children: "Ubicaci\u00F3n:" }), " ", assembly.location] }), _jsxs("p", { children: [_jsx("strong", { children: "Tipo:" }), " ", assembly.type === 'ORDINARY' ? 'Ordinaria' : 'Extraordinaria'] }), _jsxs("p", { children: [_jsx("strong", { children: "Estado:" }), " ", _jsx(Badge, { children: assembly.status })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold mt-4 mb-2", children: "Agenda:" }), _jsx("div", { className: "whitespace-pre-wrap border p-4 rounded-md bg-gray-50", children: assembly.agenda })] })] })] }), assembly.votingActive && assembly.votingOptions && (_jsxs(Card, { className: "mb-6", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Users, { className: "mr-2 h-5 w-5" }), " Participar en Votaci\u00F3n"] }) }), _jsxs(CardContent, { children: [assembly.userVote ? (_jsx("p", { className: "text-green-600 font-semibold", children: "\u00A1Ya has votado en esta asamblea!" })) : (_jsxs("div", { className: "space-y-3", children: [_jsx("p", { className: "text-gray-700", children: "Selecciona tu opci\u00F3n:" }), assembly.votingOptions.map(option => (_jsx(Button, { variant: "outline", className: "w-full justify-start", onClick: () => handleVote(option.id), disabled: loading, children: option.text }, option.id)))] })), assembly.userVote && (_jsxs("div", { className: "mt-4", children: [_jsx("h4", { className: "font-semibold mb-2", children: "Resultados Parciales:" }), assembly.votingOptions.map(option => (_jsxs("p", { className: "text-sm", children: [option.text, ": ", option.votes, " votos"] }, option.id)))] }))] })] })), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(FileText, { className: "mr-2 h-5 w-5" }), " Actas y Documentos"] }) }), _jsxs(CardContent, { children: [_jsx("p", { className: "text-gray-600", children: "Las actas y documentos relacionados con esta asamblea se publicar\u00E1n aqu\u00ED." }), _jsx(Button, { variant: "outline", className: "mt-4", children: "Ver Documentos" })] })] })] }));
}
