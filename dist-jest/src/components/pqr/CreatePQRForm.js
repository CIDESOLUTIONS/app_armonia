// src/components/pqr/CreatePQRForm.tsx
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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
var PQRType;
(function (PQRType) {
    PQRType["PETITION"] = "PETITION";
    PQRType["COMPLAINT"] = "COMPLAINT";
    PQRType["CLAIM"] = "CLAIM";
})(PQRType || (PQRType = {}));
var PQRPriority;
(function (PQRPriority) {
    PQRPriority["LOW"] = "LOW";
    PQRPriority["MEDIUM"] = "MEDIUM";
    PQRPriority["HIGH"] = "HIGH";
    PQRPriority["URGENT"] = "URGENT";
})(PQRPriority || (PQRPriority = {}));
export function CreatePQRForm({ onSuccess, onCancel, isInCard = false }) {
    // Estados para el formulario
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: PQRType.PETITION,
        priority: PQRPriority.MEDIUM,
        category: "",
        propertyUnit: "",
    });
    // Estados para la carga y errores
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // Hook de autenticación
    const { user } = useAuth();
    // Categorías disponibles
    const categories = [
        { id: "infrastructure", name: "Infraestructura" },
        { id: "security", name: "Seguridad" },
        { id: "noise", name: "Ruido" },
        { id: "payments", name: "Pagos" },
        { id: "services", name: "Servicios comunes" },
        { id: "other", name: "Otro" },
    ];
    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    // Manejar cambios en selects
    const handleSelectChange = (name, value) => {
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    // Validar el formulario
    const validateForm = () => {
        if (!formData.title.trim()) {
            setError("El título es obligatorio");
            return false;
        }
        if (!formData.description.trim()) {
            setError("La descripción es obligatoria");
            return false;
        }
        if (!formData.category) {
            setError("La categoría es obligatoria");
            return false;
        }
        return true;
    };
    // Manejar envío del formulario
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        if (!validateForm())
            return;
        setLoading(true);
        setError(null);
        try {
            // Crear PQR usando el cliente API seguro
            const response = yield apiClient.pqr.create({
                title: formData.title.trim(),
                description: formData.description.trim(),
                type: formData.type,
                priority: formData.priority,
                category: formData.category,
                propertyUnit: formData.propertyUnit.trim() || undefined,
                submittedBy: user === null || user === void 0 ? void 0 : user.id,
            });
            console.log("PQR creado exitosamente:", response.data);
            // Limpiar formulario
            setFormData({
                title: "",
                description: "",
                type: PQRType.PETITION,
                priority: PQRPriority.MEDIUM,
                category: "",
                propertyUnit: "",
            });
            // Notificar éxito
            onSuccess();
        }
        catch (err) {
            console.error("Error al crear PQR:", err);
            setError(err instanceof Error ? err.message : "No se pudo crear la solicitud. Intenta nuevamente.");
        }
        finally {
            setLoading(false);
        }
    });
    // Componente del formulario
    const FormContent = (_jsxs(_Fragment, { children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "title", children: "T\u00EDtulo" }), _jsx(Input, { id: "title", name: "title", value: formData.title, onChange: handleChange, placeholder: "Resumen breve del asunto", required: true })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "type", children: "Tipo" }), _jsxs(Select, { value: formData.type, onValueChange: (value) => handleSelectChange("type", value), children: [_jsx(SelectTrigger, { id: "type", children: _jsx(SelectValue, { placeholder: "Selecciona el tipo" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: PQRType.PETITION, children: "Petici\u00F3n" }), _jsx(SelectItem, { value: PQRType.COMPLAINT, children: "Queja" }), _jsx(SelectItem, { value: PQRType.CLAIM, children: "Reclamo" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "priority", children: "Prioridad" }), _jsxs(Select, { value: formData.priority, onValueChange: (value) => handleSelectChange("priority", value), children: [_jsx(SelectTrigger, { id: "priority", children: _jsx(SelectValue, { placeholder: "Selecciona la prioridad" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: PQRPriority.LOW, children: "Baja" }), _jsx(SelectItem, { value: PQRPriority.MEDIUM, children: "Media" }), _jsx(SelectItem, { value: PQRPriority.HIGH, children: "Alta" }), _jsx(SelectItem, { value: PQRPriority.URGENT, children: "Urgente" })] })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "category", children: "Categor\u00EDa" }), _jsxs(Select, { value: formData.category, onValueChange: (value) => handleSelectChange("category", value), children: [_jsx(SelectTrigger, { id: "category", children: _jsx(SelectValue, { placeholder: "Selecciona una categor\u00EDa" }) }), _jsx(SelectContent, { children: categories.map((category) => (_jsx(SelectItem, { value: category.id, children: category.name }, category.id))) })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "propertyUnit", children: "Unidad (opcional)" }), _jsx(Input, { id: "propertyUnit", name: "propertyUnit", value: formData.propertyUnit, onChange: handleChange, placeholder: "Ej: A-101" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "description", children: "Descripci\u00F3n detallada" }), _jsx(Textarea, { id: "description", name: "description", value: formData.description, onChange: handleChange, placeholder: "Describe con detalle tu solicitud, queja o reclamo...", rows: 5, required: true })] }), error && (_jsx(Alert, { variant: "destructive", children: _jsx(AlertDescription, { children: error }) }))] }), _jsxs("div", { className: "flex justify-end gap-2 mt-4", children: [_jsx(Button, { type: "button", variant: "outline", onClick: onCancel, disabled: loading, children: "Cancelar" }), _jsx(Button, { type: "submit", disabled: loading, children: loading ? "Enviando..." : "Enviar solicitud" })] })] }));
    // Si está dentro de una tarjeta, devolver solo el contenido
    if (!isInCard) {
        return (_jsx("form", { onSubmit: handleSubmit, className: "space-y-4", children: FormContent }));
    }
    // Si no, devolver una tarjeta con el formulario
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Nueva solicitud" }), _jsx(CardDescription, { children: "Reporta un problema o realiza una petici\u00F3n" })] }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx(CardContent, { children: FormContent }), _jsxs(CardFooter, { className: "flex justify-end gap-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: onCancel, disabled: loading, children: "Cancelar" }), _jsx(Button, { type: "submit", disabled: loading, children: loading ? "Enviando..." : "Enviar solicitud" })] })] })] }));
}
