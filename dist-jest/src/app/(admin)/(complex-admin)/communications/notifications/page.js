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
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { sendNotification } from '@/services/notificationService';
export default function NotificationsPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        recipientType: 'ALL', // ALL, RESIDENT, PROPERTY, USER
        recipientId: '', // ID of specific recipient if type is not ALL
    });
    const [loading, setLoading] = useState(false);
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
        try {
            yield sendNotification(formData);
            toast({
                title: 'Éxito',
                description: 'Notificación enviada correctamente.',
            });
            setFormData({
                title: '',
                message: '',
                recipientType: 'ALL',
                recipientId: '',
            });
        }
        catch (error) {
            console.error('Error sending notification:', error);
            toast({
                title: 'Error',
                description: 'Error al enviar la notificación.',
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
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Enviar Notificaciones" }), _jsxs("form", { onSubmit: handleSubmit, className: "grid gap-6 md:grid-cols-2", children: [_jsxs("div", { className: "grid gap-2 col-span-full", children: [_jsx(Label, { htmlFor: "title", children: "T\u00EDtulo de la Notificaci\u00F3n" }), _jsx(Input, { id: "title", name: "title", value: formData.title, onChange: handleInputChange, required: true })] }), _jsxs("div", { className: "grid gap-2 col-span-full", children: [_jsx(Label, { htmlFor: "message", children: "Mensaje" }), _jsx(Textarea, { id: "message", name: "message", value: formData.message, onChange: handleInputChange, rows: 5, required: true })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "recipientType", children: "Tipo de Destinatario" }), _jsxs(Select, { name: "recipientType", value: formData.recipientType, onValueChange: (value) => handleSelectChange('recipientType', value), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Seleccionar tipo" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "ALL", children: "Todos los Residentes" }), _jsx(SelectItem, { value: "RESIDENT", children: "Residente Espec\u00EDfico" }), _jsx(SelectItem, { value: "PROPERTY", children: "Propiedad Espec\u00EDfica" }), _jsx(SelectItem, { value: "USER", children: "Usuario Espec\u00EDfico (por ID)" })] })] })] }), (formData.recipientType === 'RESIDENT' || formData.recipientType === 'PROPERTY' || formData.recipientType === 'USER') && (_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "recipientId", children: "ID del Destinatario" }), _jsx(Input, { id: "recipientId", name: "recipientId", value: formData.recipientId, onChange: handleInputChange, placeholder: "Ingrese el ID" })] })), _jsx("div", { className: "col-span-full flex justify-end", children: _jsxs(Button, { type: "submit", disabled: loading, children: [loading ? _jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : _jsx(Send, { className: "mr-2 h-4 w-4" }), " Enviar Notificaci\u00F3n"] }) })] })] }));
}
