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
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { Loader2, PlusCircle, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
export default function ApiKeysPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [apiKeys, setApiKeys] = useState([
        // Mock data
        { id: '1', name: 'Integración Pasarela Pagos', key: 'sk_live_xxxxxxxxxxxx', createdAt: '2023-01-01', lastUsed: '2024-06-30', isActive: true },
        { id: '2', name: 'Servicio SMS Twilio', key: 'ac_test_yyyyyyyyyyyy', createdAt: '2023-03-10', lastUsed: '2024-07-01', isActive: true },
    ]);
    const [newKeyName, setNewKeyName] = useState('');
    const [loading, setLoading] = useState(false);
    const handleGenerateKey = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        if (!newKeyName.trim()) {
            toast({
                title: 'Error',
                description: 'Por favor, ingrese un nombre para la nueva clave API.',
                variant: 'destructive',
            });
            return;
        }
        setLoading(true);
        try {
            // Placeholder for API call to generate new key
            console.log('Generating new API key for:', newKeyName);
            yield new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
            const newKey = {
                id: String(apiKeys.length + 1),
                name: newKeyName,
                key: `sk_test_${Math.random().toString(36).substring(2, 15)}`,
                createdAt: new Date().toISOString().split('T')[0],
                isActive: true,
            };
            setApiKeys(prev => [...prev, newKey]);
            setNewKeyName('');
            toast({
                title: 'Éxito',
                description: 'Clave API generada correctamente (simulado).',
            });
        }
        catch (error) {
            console.error('Error generating API key:', error);
            toast({
                title: 'Error',
                description: 'Error al generar la clave API.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    });
    const handleDeleteKey = (id) => __awaiter(this, void 0, void 0, function* () {
        if (confirm('¿Estás seguro de que quieres eliminar esta clave API?')) {
            setLoading(true);
            try {
                // Placeholder for API call to delete key
                console.log('Deleting API key with ID:', id);
                yield new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
                setApiKeys(prev => prev.filter(key => key.id !== id));
                toast({
                    title: 'Éxito',
                    description: 'Clave API eliminada correctamente (simulado).',
                });
            }
            catch (error) {
                console.error('Error deleting API key:', error);
                toast({
                    title: 'Error',
                    description: 'Error al eliminar la clave API.',
                    variant: 'destructive',
                });
            }
            finally {
                setLoading(false);
            }
        }
    });
    const handleCopyKey = (key) => {
        navigator.clipboard.writeText(key);
        toast({
            title: 'Copiado',
            description: 'Clave API copiada al portapapeles.',
        });
    };
    if (authLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    if (!user || (user.role !== 'ADMIN' && user.role !== 'COMPLEX_ADMIN')) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Acceso Denegado" }), _jsx("p", { className: "text-gray-600", children: "No tienes permisos para acceder a esta p\u00E1gina." })] }) }));
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Configuraci\u00F3n de Claves API" }), _jsxs("div", { className: "bg-white shadow-md rounded-lg p-6 mb-8", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Generar Nueva Clave API" }), _jsxs("form", { onSubmit: handleGenerateKey, className: "grid gap-4 md:grid-cols-2", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "newKeyName", children: "Nombre de la Clave" }), _jsx(Input, { id: "newKeyName", value: newKeyName, onChange: (e) => setNewKeyName(e.target.value), required: true })] }), _jsx("div", { className: "flex items-end", children: _jsxs(Button, { type: "submit", disabled: loading, children: [loading ? _jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : _jsx(PlusCircle, { className: "mr-2 h-4 w-4" }), " Generar Clave"] }) })] })] }), _jsxs("div", { className: "bg-white shadow-md rounded-lg p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Claves API Existentes" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Nombre" }), _jsx(TableHead, { children: "Clave" }), _jsx(TableHead, { children: "Creada" }), _jsx(TableHead, { children: "\u00DAltimo Uso" }), _jsx(TableHead, { children: "Activa" }), _jsx(TableHead, {})] }) }), _jsx(TableBody, { children: apiKeys.length > 0 ? (apiKeys.map((key) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: key.name }), _jsxs(TableCell, { className: "flex items-center", children: [_jsxs("span", { className: "font-mono text-gray-700 mr-2", children: [key.key.substring(0, 8), "..."] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleCopyKey(key.key), children: _jsx(Copy, { className: "h-4 w-4" }) })] }), _jsx(TableCell, { children: key.createdAt }), _jsx(TableCell, { children: key.lastUsed || 'Nunca' }), _jsx(TableCell, { children: key.isActive ? _jsx(Badge, { variant: "default", children: "S\u00ED" }) : _jsx(Badge, { variant: "destructive", children: "No" }) }), _jsx(TableCell, { className: "text-right", children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDeleteKey(key.id), children: _jsx(Trash2, { className: "h-4 w-4" }) }) })] }, key.id)))) : (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 6, className: "text-center py-5", children: "No hay claves API registradas." }) })) })] }) })] })] }));
}
