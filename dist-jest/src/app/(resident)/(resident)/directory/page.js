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
import { Loader2, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { getResidents } from '@/services/residentService';
export default function ResidentDirectoryPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const fetchResidents = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            // Fetch all residents, then filter on client-side for simplicity
            // In a large application, filtering would be done on the server
            const data = yield getResidents();
            setResidents(data);
        }
        catch (error) {
            console.error('Error fetching residents for directory:', error);
            toast({
                title: 'Error',
                description: 'No se pudo cargar el directorio de residentes.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    }), [toast]);
    useEffect(() => {
        if (!authLoading && user) {
            fetchResidents();
        }
    }, [authLoading, user, fetchResidents]);
    const filteredResidents = residents.filter(resident => resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.email.toLowerCase().includes(searchTerm.toLowerCase()));
    if (authLoading || loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    if (!user) {
        return null; // Redirect handled by AuthLayout
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Directorio de Residentes" }), _jsx("div", { className: "mb-6", children: _jsx(Input, { type: "text", placeholder: "Buscar residente por nombre, unidad o email...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full md:w-1/2" }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredResidents.length > 0 ? (filteredResidents.map(resident => (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(User, { className: "mr-2 h-5 w-5" }), " ", resident.name] }) }), _jsxs(CardContent, { children: [_jsxs("p", { className: "text-sm text-gray-600", children: [_jsx("strong", { children: "Unidad:" }), " ", resident.unitNumber] }), _jsxs("p", { className: "text-sm text-gray-600", children: [_jsx("strong", { children: "Email:" }), " ", resident.email] }), _jsxs("p", { className: "text-sm text-gray-600", children: [_jsx("strong", { children: "Tel\u00E9fono:" }), " ", resident.phone || 'N/A'] })] })] }, resident.id)))) : (_jsx("p", { className: "col-span-full text-center text-gray-500", children: "No se encontraron residentes." })) })] }));
}
