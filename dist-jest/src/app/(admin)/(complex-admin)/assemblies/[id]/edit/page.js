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
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { getAssemblies, updateAssembly } from '@/services/assemblyService';
export default function EditAssemblyPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const assemblyId = params.id ? parseInt(params.id) : null;
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        scheduledDate: '',
        location: '',
        type: 'ORDINARY',
        agenda: '',
        status: 'PLANNED',
    });
    const [loading, setLoading] = useState(true);
    const fetchAssembly = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const response = yield getAssemblies(); // Fetch all to find by ID for now
            const assembly = response.data.find((a) => a.id === assemblyId);
            if (assembly) {
                setFormData({
                    title: assembly.title,
                    description: assembly.description || '',
                    scheduledDate: new Date(assembly.scheduledDate).toISOString().slice(0, 16), // Format for datetime-local
                    location: assembly.location,
                    type: assembly.type,
                    agenda: assembly.agenda,
                    status: assembly.status,
                });
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
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleSelectChange = (name, value) => {
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setLoading(true);
        if (!assemblyId)
            return;
        try {
            yield updateAssembly(assemblyId, formData);
            toast({
                title: 'Éxito',
                description: 'Asamblea actualizada correctamente.',
            });
            router.push('/admin/assemblies');
        }
        catch (error) {
            console.error('Error updating assembly:', error);
            toast({
                title: 'Error',
                description: 'Error al actualizar la asamblea.',
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
    if (!user || (user.role !== 'ADMIN' && user.role !== 'COMPLEX_ADMIN')) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Acceso Denegado" }), _jsx("p", { className: "text-gray-600", children: "No tienes permisos para acceder a esta p\u00E1gina." })] }) }));
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Editar Asamblea" }), assemblyId && (_jsxs("form", { onSubmit: handleSubmit, className: "grid gap-6 md:grid-cols-2", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "title", children: "T\u00EDtulo" }), _jsx(Input, { id: "title", name: "title", value: formData.title, onChange: handleInputChange, required: true })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "scheduledDate", children: "Fecha y Hora" }), _jsx(Input, { id: "scheduledDate", name: "scheduledDate", type: "datetime-local", value: formData.scheduledDate, onChange: handleInputChange, required: true })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "location", children: "Ubicaci\u00F3n" }), _jsx(Input, { id: "location", name: "location", value: formData.location, onChange: handleInputChange, required: true })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "type", children: "Tipo de Asamblea" }), _jsxs(Select, { name: "type", value: formData.type, onValueChange: (value) => handleSelectChange('type', value), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Seleccionar tipo" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "ORDINARY", children: "Ordinaria" }), _jsx(SelectItem, { value: "EXTRAORDINARY", children: "Extraordinaria" })] })] })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "status", children: "Estado" }), _jsxs(Select, { name: "status", value: formData.status, onValueChange: (value) => handleSelectChange('status', value), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Seleccionar estado" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "PLANNED", children: "Planificada" }), _jsx(SelectItem, { value: "IN_PROGRESS", children: "En Progreso" }), _jsx(SelectItem, { value: "COMPLETED", children: "Completada" }), _jsx(SelectItem, { value: "CANCELLED", children: "Cancelada" })] })] })] }), _jsxs("div", { className: "grid gap-2 col-span-full", children: [_jsx(Label, { htmlFor: "description", children: "Descripci\u00F3n" }), _jsx(Textarea, { id: "description", name: "description", value: formData.description, onChange: handleInputChange, rows: 3 })] }), _jsxs("div", { className: "grid gap-2 col-span-full", children: [_jsx(Label, { htmlFor: "agenda", children: "Agenda" }), _jsx(Textarea, { id: "agenda", name: "agenda", value: formData.agenda, onChange: handleInputChange, rows: 5, required: true })] }), _jsx("div", { className: "col-span-full flex justify-end", children: _jsxs(Button, { type: "submit", disabled: loading, children: [loading ? _jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : null, " Guardar Cambios"] }) })] }))] }));
}
