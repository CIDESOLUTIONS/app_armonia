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
import { useToast } from '@/components/ui/use-toast';
export default function BrandingSettingsPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [logoFile, setLogoFile] = useState(null);
    const [primaryColor, setPrimaryColor] = useState('#4f46e5'); // Default indigo-600
    const [secondaryColor, setSecondaryColor] = useState('#ffffff'); // Default white
    const [loading, setLoading] = useState(false);
    const handleLogoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setLogoFile(e.target.files[0]);
        }
    };
    const handleSaveBranding = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setLoading(true);
        try {
            // Placeholder for API call to save branding settings
            console.log('Saving branding settings:', { logoFile, primaryColor, secondaryColor });
            yield new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
            toast({
                title: 'Éxito',
                description: 'Configuración de marca guardada correctamente (simulado).',
            });
        }
        catch (error) {
            console.error('Error saving branding settings:', error);
            toast({
                title: 'Error',
                description: 'Error al guardar la configuración de marca.',
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
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Personalizaci\u00F3n Visual y Logotipo" }), _jsx("div", { className: "bg-white shadow-md rounded-lg p-6", children: _jsxs("form", { onSubmit: handleSaveBranding, className: "grid gap-6 md:grid-cols-2", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "logo", children: "Logotipo del Conjunto" }), _jsx(Input, { id: "logo", type: "file", onChange: handleLogoChange, accept: "image/*" }), logoFile && _jsxs("p", { className: "text-sm text-gray-500", children: ["Archivo seleccionado: ", logoFile.name] })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "primaryColor", children: "Color Principal" }), _jsx(Input, { id: "primaryColor", type: "color", value: primaryColor, onChange: (e) => setPrimaryColor(e.target.value) })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "secondaryColor", children: "Color Secundario" }), _jsx(Input, { id: "secondaryColor", type: "color", value: secondaryColor, onChange: (e) => setSecondaryColor(e.target.value) })] }), _jsx("div", { className: "col-span-full flex justify-end", children: _jsxs(Button, { type: "submit", disabled: loading, children: [loading ? _jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : null, " Guardar Cambios"] }) })] }) })] }));
}
