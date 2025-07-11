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
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { getComplexInfo, updateComplexInfo } from '@/services/complexService';
export default function GeneralSettingsPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [complexInfo, setComplexInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});
    const fetchComplexInfo = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const data = yield getComplexInfo();
            setComplexInfo(data);
            setFormData(data);
        }
        catch (error) {
            console.error('Error fetching complex info:', error);
            toast({
                title: 'Error',
                description: 'No se pudo cargar la información del conjunto.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    }), [toast]);
    useEffect(() => {
        if (!authLoading && user) {
            fetchComplexInfo();
        }
    }, [authLoading, user, fetchComplexInfo]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        if (!(complexInfo === null || complexInfo === void 0 ? void 0 : complexInfo.id))
            return;
        try {
            yield updateComplexInfo(complexInfo.id, formData);
            toast({
                title: 'Éxito',
                description: 'Información general del conjunto actualizada correctamente.',
            });
            fetchComplexInfo();
        }
        catch (error) {
            console.error('Error saving complex info:', error);
            toast({
                title: 'Error',
                description: 'Error al guardar la información general del conjunto.',
                variant: 'destructive',
            });
        }
    });
    if (authLoading || loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    if (!user || (user.role !== 'ADMIN' && user.role !== 'COMPLEX_ADMIN')) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Acceso Denegado" }), _jsx("p", { className: "text-gray-600", children: "No tienes permisos para acceder a esta p\u00E1gina." })] }) }));
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Configuraci\u00F3n General del Conjunto" }), complexInfo && (_jsxs("form", { onSubmit: handleSubmit, className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "name", children: "Nombre del Conjunto" }), _jsx(Input, { id: "name", name: "name", value: formData.name || '', onChange: handleInputChange, required: true })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "legalName", children: "Raz\u00F3n Social / Nombre Legal" }), _jsx(Input, { id: "legalName", name: "legalName", value: formData.legalName || '', onChange: handleInputChange })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "nit", children: "NIT / Identificaci\u00F3n Tributaria" }), _jsx(Input, { id: "nit", name: "nit", value: formData.nit || '', onChange: handleInputChange })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "registrationDate", children: "Fecha de Registro" }), _jsx(Input, { id: "registrationDate", name: "registrationDate", type: "date", value: formData.registrationDate ? formData.registrationDate.split('T')[0] : '', onChange: handleInputChange })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "totalUnits", children: "Total de Unidades" }), _jsx(Input, { id: "totalUnits", name: "totalUnits", type: "number", value: formData.totalUnits || 0, onChange: handleInputChange })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "adminEmail", children: "Email del Administrador" }), _jsx(Input, { id: "adminEmail", name: "adminEmail", type: "email", value: formData.adminEmail || '', onChange: handleInputChange, required: true })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "adminName", children: "Nombre del Administrador" }), _jsx(Input, { id: "adminName", name: "adminName", value: formData.adminName || '', onChange: handleInputChange, required: true })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "adminPhone", children: "Tel\u00E9fono del Administrador" }), _jsx(Input, { id: "adminPhone", name: "adminPhone", value: formData.adminPhone || '', onChange: handleInputChange })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "address", children: "Direcci\u00F3n" }), _jsx(Input, { id: "address", name: "address", value: formData.address || '', onChange: handleInputChange, required: true })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "city", children: "Ciudad" }), _jsx(Input, { id: "city", name: "city", value: formData.city || '', onChange: handleInputChange, required: true })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "state", children: "Departamento/Estado" }), _jsx(Input, { id: "state", name: "state", value: formData.state || '', onChange: handleInputChange, required: true })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "country", children: "Pa\u00EDs" }), _jsx(Input, { id: "country", name: "country", value: formData.country || '', onChange: handleInputChange, required: true })] }), _jsx("div", { className: "col-span-full flex justify-end", children: _jsx(Button, { type: "submit", children: "Guardar Cambios" }) })] }))] }));
}
