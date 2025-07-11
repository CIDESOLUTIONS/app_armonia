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
import { Loader2, PlusCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { getPQRs } from '@/services/pqrService';
export default function ResidentPQRPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [pqrs, setPqrs] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchPQRs = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const data = yield getPQRs({ reportedById: user === null || user === void 0 ? void 0 : user.id }); // Fetch PQRs reported by current user
            setPqrs(data);
        }
        catch (error) {
            console.error('Error fetching resident PQRs:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar tus PQRs.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    }), [toast, user === null || user === void 0 ? void 0 : user.id]);
    useEffect(() => {
        if (!authLoading && user) {
            fetchPQRs();
        }
    }, [authLoading, user, fetchPQRs]);
    if (authLoading || loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    if (!user) {
        return null; // Redirect handled by AuthLayout
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Mis Peticiones, Quejas y Reclamos" }), _jsx("div", { className: "flex justify-end mb-4", children: _jsx(Link, { href: "/resident/pqr/create", children: _jsxs(Button, { children: [_jsx(PlusCircle, { className: "mr-2 h-4 w-4" }), " Crear Nueva PQR"] }) }) }), _jsx("div", { className: "bg-white shadow-md rounded-lg overflow-hidden", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Asunto" }), _jsx(TableHead, { children: "Estado" }), _jsx(TableHead, { children: "Prioridad" }), _jsx(TableHead, { children: "Fecha Creaci\u00F3n" }), _jsx(TableHead, {})] }) }), _jsx(TableBody, { children: pqrs.length > 0 ? (pqrs.map((pqr) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: pqr.subject }), _jsx(TableCell, { children: _jsx(Badge, { variant: pqr.status === 'OPEN' ? 'destructive' : pqr.status === 'IN_PROGRESS' ? 'secondary' : 'default', children: pqr.status }) }), _jsx(TableCell, { children: _jsx(Badge, { variant: pqr.priority === 'HIGH' ? 'destructive' : pqr.priority === 'MEDIUM' ? 'secondary' : 'default', children: pqr.priority }) }), _jsx(TableCell, { children: new Date(pqr.createdAt).toLocaleDateString() }), _jsx(TableCell, { className: "text-right", children: _jsx(Link, { href: `/resident/pqr/${pqr.id}/view`, children: _jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Eye, { className: "h-4 w-4" }) }) }) })] }, pqr.id)))) : (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 5, className: "text-center py-5", children: "No has reportado ninguna PQR." }) })) })] }) })] }));
}
