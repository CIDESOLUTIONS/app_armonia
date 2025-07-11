// src/components/inventory/ResidentForm.tsx
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
export function ResidentForm({ resident, onSave, onCancel, properties }) {
    const [_formData, _setFormData] = useState(resident || {
        name: '',
        email: '',
        dni: '',
        birthDate: '',
        whatsapp: '',
        residentType: 'permanente',
        startDate: new Date().toISOString().split('T')[0],
        status: 'activo',
        propertyNumber: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, _setError] = useState('');
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            yield onSave(formData);
        }
        catch (err) {
            console.error('Error al guardar residente:', err);
            setError(err instanceof Error ? err.message : 'Error al guardar residente');
        }
        finally {
            setLoading(false);
        }
    });
    const isTemporary = formData.residentType === 'temporal';
    return (_jsx(Dialog, { open: true, onOpenChange: () => onCancel(), children: _jsxs(DialogContent, { className: "sm:max-w-md", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: resident ? 'Editar Residente' : 'Nuevo Residente' }) }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 mt-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "name", children: "Nombre Completo" }), _jsx(Input, { id: "name", name: "name", value: formData.name, onChange: handleChange, required: true, disabled: loading })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "dni", children: "DNI/Identificaci\u00F3n" }), _jsx(Input, { id: "dni", name: "dni", value: formData.dni, onChange: handleChange, required: true, disabled: loading })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", name: "email", type: "email", value: formData.email, onChange: handleChange, required: true, disabled: loading })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "whatsapp", children: "WhatsApp" }), _jsx(Input, { id: "whatsapp", name: "whatsapp", value: formData.whatsapp, onChange: handleChange, disabled: loading })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "birthDate", children: "Fecha de Nacimiento" }), _jsx(Input, { id: "birthDate", name: "birthDate", type: "date", value: formData.birthDate, onChange: handleChange, required: true, disabled: loading })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "propertyNumber", children: "Propiedad" }), _jsxs("select", { id: "propertyNumber", name: "propertyNumber", value: formData.propertyNumber, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md", required: true, disabled: loading, children: [_jsx("option", { value: "", children: "Seleccione una propiedad" }), properties.map((property) => (_jsxs("option", { value: property.unitNumber, children: [property.unitNumber, " - ", property.ownerName] }, property.id)))] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "residentType", children: "Tipo de Residente" }), _jsxs("select", { id: "residentType", name: "residentType", value: formData.residentType, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md", required: true, disabled: loading, children: [_jsx("option", { value: "permanente", children: "Permanente" }), _jsx("option", { value: "temporal", children: "Temporal" })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "startDate", children: "Fecha de Inicio" }), _jsx(Input, { id: "startDate", name: "startDate", type: "date", value: formData.startDate, onChange: handleChange, required: true, disabled: loading })] }), isTemporary && (_jsxs("div", { children: [_jsx(Label, { htmlFor: "endDate", children: "Fecha de Finalizaci\u00F3n" }), _jsx(Input, { id: "endDate", name: "endDate", type: "date", value: formData.endDate || '', onChange: handleChange, required: isTemporary, disabled: loading })] })), _jsxs("div", { children: [_jsx(Label, { htmlFor: "status", children: "Estado" }), _jsxs("select", { id: "status", name: "status", value: formData.status, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md", required: true, disabled: loading, children: [_jsx("option", { value: "activo", children: "Activo" }), _jsx("option", { value: "inactivo", children: "Inactivo" })] })] }), error && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded", children: error })), _jsxs("div", { className: "flex justify-end space-x-4 pt-4", children: [_jsx(Button, { type: "button", onClick: onCancel, variant: "outline", disabled: loading, children: "Cancelar" }), _jsx(Button, { type: "submit", className: "bg-indigo-600 hover:bg-indigo-700 text-white", disabled: loading, children: loading ? 'Guardando...' : 'Guardar' })] })] })] }) }));
}
