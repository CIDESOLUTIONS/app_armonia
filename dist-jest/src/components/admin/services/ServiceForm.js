"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Save, Clock, Users, DollarSign } from 'lucide-react';
export default function ServiceForm({ initialData, onSubmit, onCancel, isEditing, }) {
    const { complexId } = useAuthStore();
    const [_formData, _setFormData] = useState({
        name: "",
        description: "",
        capacity: 10,
        startTime: "08:00",
        endTime: "18:00",
        rules: "",
        status: "active",
        cost: 0,
        complexId: complexId || 0,
    });
    useEffect(() => {
        if (initialData) {
            setFormData(Object.assign(Object.assign({}, initialData), { 
                // Asegurarse de que estos campos estén en el formato correcto
                cost: initialData.cost || 0, capacity: initialData.capacity || 10 }));
        }
    }, [initialData]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;
        // Convertir a número para campos numéricos
        if (name === "capacity" || name === "cost") {
            processedValue = value === "" ? 0 : Number(value);
        }
        setFormData(Object.assign(Object.assign({}, formData), { [name]: processedValue }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };
    return (_jsxs(Card, { className: "mb-6", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: isEditing ? "Editar Servicio" : "Nuevo Servicio" }) }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "name", children: "Nombre del Servicio" }), _jsx(Input, { id: "name", name: "name", value: formData.name, onChange: handleChange, required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "status", children: "Estado" }), _jsxs("select", { id: "status", name: "status", value: formData.status, onChange: handleChange, className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", children: [_jsx("option", { value: "active", children: "Activo" }), _jsx("option", { value: "inactive", children: "Inactivo" }), _jsx("option", { value: "maintenance", children: "En Mantenimiento" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "capacity", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Users, { className: "w-4 h-4 mr-2" }), _jsx("span", { children: "Capacidad (personas)" })] }) }), _jsx(Input, { id: "capacity", name: "capacity", type: "number", min: "1", value: formData.capacity, onChange: handleChange, required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "startTime", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Clock, { className: "w-4 h-4 mr-2" }), _jsx("span", { children: "Hora de Inicio" })] }) }), _jsx(Input, { id: "startTime", name: "startTime", type: "time", value: formData.startTime, onChange: handleChange, required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "endTime", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Clock, { className: "w-4 h-4 mr-2" }), _jsx("span", { children: "Hora de Fin" })] }) }), _jsx(Input, { id: "endTime", name: "endTime", type: "time", value: formData.endTime, onChange: handleChange, required: true })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "cost", children: _jsxs("div", { className: "flex items-center", children: [_jsx(DollarSign, { className: "w-4 h-4 mr-2" }), _jsx("span", { children: "Costo (0 para gratuito)" })] }) }), _jsx(Input, { id: "cost", name: "cost", type: "number", min: "0", step: "0.01", value: formData.cost, onChange: handleChange })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "description", children: "Descripci\u00F3n" }), _jsx(Textarea, { id: "description", name: "description", value: formData.description, onChange: handleChange, className: "min-h-[80px]" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "rules", children: "Reglas y Recomendaciones" }), _jsx(Textarea, { id: "rules", name: "rules", value: formData.rules, onChange: handleChange, className: "min-h-[120px]", placeholder: "Ingrese las reglas y recomendaciones para el uso del servicio..." })] }), _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsxs(Button, { type: "button", variant: "outline", onClick: onCancel, className: "flex items-center", children: [_jsx(X, { className: "w-4 h-4 mr-2" }), " Cancelar"] }), _jsxs(Button, { type: "submit", className: "bg-indigo-600 hover:bg-indigo-700 flex items-center", children: [_jsx(Save, { className: "w-4 h-4 mr-2" }), " Guardar"] })] })] }) })] }));
}
