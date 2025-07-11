"use client";
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
const formSchema = z.object({
    complexName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    adminName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(7, 'Teléfono inválido'),
});
export function RegisterComplexForm() {
    const [loading, setLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            complexName: '',
            adminName: '',
            email: '',
            phone: '',
        },
    });
    const onSubmit = (data) => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            // Aquí se haría la llamada a la API para registrar el conjunto
            console.log('Registrando conjunto:', data);
            yield new Promise(resolve => setTimeout(resolve, 1500)); // Simular llamada a API
            toast({
                title: '¡Registro Exitoso!',
                description: 'Hemos recibido tu solicitud. Pronto nos pondremos en contacto contigo.',
            });
            form.reset();
        }
        catch (error) {
            toast({
                title: 'Error en el Registro',
                description: 'No pudimos procesar tu solicitud. Por favor, inténtalo de nuevo.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    });
    return (_jsxs("div", { className: "w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg dark:bg-gray-800", children: [_jsx("h2", { className: "text-2xl font-bold text-center", children: "Registra tu Conjunto Residencial" }), _jsx("p", { className: "text-center text-gray-600 dark:text-gray-400", children: "Inicia hoy y descubre una nueva forma de administrar." }), _jsx(Form, Object.assign({}, form, { children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6", children: [_jsx(FormField, { control: form.control, name: "complexName", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Nombre del Conjunto" }), _jsx(FormControl, { children: _jsx(Input, Object.assign({ placeholder: "Ej: Conjunto Residencial El Bosque" }, field)) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "adminName", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Tu Nombre Completo" }), _jsx(FormControl, { children: _jsx(Input, Object.assign({ placeholder: "Ej: Ana P\u00E9rez" }, field)) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "email", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Email de Contacto" }), _jsx(FormControl, { children: _jsx(Input, Object.assign({ placeholder: "tu@email.com" }, field)) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "phone", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Tel\u00E9fono de Contacto" }), _jsx(FormControl, { children: _jsx(Input, Object.assign({ placeholder: "300 123 4567" }, field)) }), _jsx(FormMessage, {})] })) }), _jsx(Button, { type: "submit", className: "w-full", disabled: loading, children: loading ? 'Enviando...' : t('freeTrialButton') })] }) }))] }));
}
