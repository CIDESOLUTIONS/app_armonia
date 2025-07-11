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
import { useAuthStore } from '@/store/authStore';
import { Loader2, Fingerprint, Lock, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
export default function AccessControlPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const handleBiometricEnrollment = () => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            // Placeholder for actual biometric enrollment logic
            console.log('Initiating biometric enrollment...');
            yield new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
            toast({
                title: 'Éxito',
                description: 'Proceso de enrolamiento biométrico iniciado (simulado).',
            });
        }
        catch (error) {
            console.error('Error during biometric enrollment:', error);
            toast({
                title: 'Error',
                description: 'Error al iniciar el enrolamiento biométrico.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    });
    const handleAddRestrictedZone = () => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            // Placeholder for actual restricted zone creation logic
            console.log('Adding restricted zone...');
            yield new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
            toast({
                title: 'Éxito',
                description: 'Zona restringida añadida (simulado).',
            });
        }
        catch (error) {
            console.error('Error adding restricted zone:', error);
            toast({
                title: 'Error',
                description: 'Error al añadir zona restringida.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    });
    if (authLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    if (!user || (user.role !== 'ADMIN' && user.role !== 'COMPLEX_ADMIN')) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Acceso Denegado" }), _jsx("p", { className: "text-gray-600", children: "No tienes permisos para acceder a esta p\u00E1gina." })] }) }));
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Control de Acceso y Biometr\u00EDa" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white shadow-md rounded-lg p-6", children: [_jsxs("h2", { className: "text-xl font-semibold mb-4 flex items-center", children: [_jsx(Fingerprint, { className: "mr-2" }), " Enrolamiento Biom\u00E9trico"] }), _jsx("p", { className: "text-gray-600 mb-4", children: "Gestione el enrolamiento de huellas dactilares o reconocimiento facial para el personal autorizado." }), _jsxs(Button, { onClick: handleBiometricEnrollment, disabled: loading, children: [loading ? _jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : _jsx(PlusCircle, { className: "mr-2 h-4 w-4" }), " Iniciar Enrolamiento"] })] }), _jsxs("div", { className: "bg-white shadow-md rounded-lg p-6", children: [_jsxs("h2", { className: "text-xl font-semibold mb-4 flex items-center", children: [_jsx(Lock, { className: "mr-2" }), " Zonas Restringidas"] }), _jsx("p", { className: "text-gray-600 mb-4", children: "Defina y gestione zonas de acceso restringido dentro del conjunto residencial." }), _jsxs(Button, { onClick: handleAddRestrictedZone, disabled: loading, children: [loading ? _jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : _jsx(PlusCircle, { className: "mr-2 h-4 w-4" }), " A\u00F1adir Zona Restringida"] })] })] }), _jsxs("div", { className: "mt-8 bg-white shadow-md rounded-lg p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Historial de Accesos (Pr\u00F3ximamente)" }), _jsx("p", { className: "text-gray-600", children: "El historial detallado de accesos y eventos de seguridad se mostrar\u00E1 aqu\u00ED." })] })] }));
}
