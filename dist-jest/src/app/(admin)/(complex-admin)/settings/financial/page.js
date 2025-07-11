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
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
export default function FinancialSettingsPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        bankName: '',
        accountNumber: '',
        accountType: '',
        nit: '',
        paymentMethods: '',
    });
    const [loading, setLoading] = useState(false);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleSaveFinancialSettings = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setLoading(true);
        try {
            // Placeholder for API call to save financial settings
            console.log('Saving financial settings:', formData);
            yield new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
            toast({
                title: 'Éxito',
                description: 'Configuración financiera guardada correctamente (simulado).',
            });
        }
        catch (error) {
            console.error('Error saving financial settings:', error);
            toast({
                title: 'Error',
                description: 'Error al guardar la configuración financiera.',
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
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Configuraci\u00F3n Financiera" }), _jsx("div", { className: "bg-white shadow-md rounded-lg p-6", children: _jsxs("form", { onSubmit: handleSaveFinancialSettings, className: "grid gap-6 md:grid-cols-2", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "bankName", children: "Nombre del Banco" }), _jsx(Input, { id: "bankName", name: "bankName", value: formData.bankName, onChange: handleInputChange })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "accountNumber", children: "N\u00FAmero de Cuenta" }), _jsx(Input, { id: "accountNumber", name: "accountNumber", value: formData.accountNumber, onChange: handleInputChange })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "accountType", children: "Tipo de Cuenta" }), _jsx(Input, { id: "accountType", name: "accountType", value: formData.accountType, onChange: handleInputChange })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "nit", children: "NIT / Identificaci\u00F3n" }), _jsx(Input, { id: "nit", name: "nit", value: formData.nit, onChange: handleInputChange })] }), _jsxs("div", { className: "grid gap-2 col-span-full", children: [_jsx(Label, { htmlFor: "paymentMethods", children: "M\u00E9todos de Pago (separados por coma)" }), _jsx(Textarea, { id: "paymentMethods", name: "paymentMethods", value: formData.paymentMethods, onChange: handleInputChange, rows: 3 })] }), _jsx("div", { className: "col-span-full flex justify-end", children: _jsxs(Button, { type: "submit", disabled: loading, children: [loading ? _jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : null, " Guardar Cambios"] }) })] }) })] }));
}
