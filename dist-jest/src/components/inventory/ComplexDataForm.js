// src/components/inventory/ComplexDataForm.tsx
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
export function ComplexDataForm({ initialData, onSave, onCancel }) {
    const [_formData, _setFormData] = useState({
        name: (initialData === null || initialData === void 0 ? void 0 : initialData.name) || '',
        address: (initialData === null || initialData === void 0 ? void 0 : initialData.address) || '',
        city: (initialData === null || initialData === void 0 ? void 0 : initialData.city) || '',
        state: (initialData === null || initialData === void 0 ? void 0 : initialData.state) || '',
        country: (initialData === null || initialData === void 0 ? void 0 : initialData.country) || '',
        adminName: (initialData === null || initialData === void 0 ? void 0 : initialData.adminName) || '',
        adminEmail: (initialData === null || initialData === void 0 ? void 0 : initialData.adminEmail) || '',
        adminPhone: (initialData === null || initialData === void 0 ? void 0 : initialData.adminPhone) || '',
        adminDNI: (initialData === null || initialData === void 0 ? void 0 : initialData.adminDNI) || '',
        adminAddress: (initialData === null || initialData === void 0 ? void 0 : initialData.adminAddress) || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, _setError] = useState('');
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            yield onSave(formData);
        }
        catch (err) {
            console.error('Error al guardar:', err);
            setError(err instanceof Error ? err.message : 'Error al guardar datos');
        }
        finally {
            setLoading(false);
        }
    });
    return (_jsxs("form", { onSubmit: handleSubmit, className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow", children: [_jsx("h2", { className: "text-xl font-bold mb-6", children: "Datos del Conjunto" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Informaci\u00F3n General" }), _jsxs("div", { className: "mb-4", children: [_jsx(Label, { htmlFor: "name", children: "Nombre del Conjunto" }), _jsx(Input, { id: "name", name: "name", value: formData.name, onChange: handleChange, required: true, disabled: loading })] }), _jsxs("div", { className: "mb-4", children: [_jsx(Label, { htmlFor: "address", children: "Direcci\u00F3n" }), _jsx(Input, { id: "address", name: "address", value: formData.address, onChange: handleChange, required: true, disabled: loading })] }), _jsxs("div", { className: "mb-4", children: [_jsx(Label, { htmlFor: "city", children: "Ciudad" }), _jsx(Input, { id: "city", name: "city", value: formData.city, onChange: handleChange, required: true, disabled: loading })] }), _jsxs("div", { className: "mb-4", children: [_jsx(Label, { htmlFor: "state", children: "Estado/Provincia" }), _jsx(Input, { id: "state", name: "state", value: formData.state, onChange: handleChange, required: true, disabled: loading })] }), _jsxs("div", { className: "mb-4", children: [_jsx(Label, { htmlFor: "country", children: "Pa\u00EDs" }), _jsx(Input, { id: "country", name: "country", value: formData.country, onChange: handleChange, required: true, disabled: loading })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Informaci\u00F3n del Administrador" }), _jsxs("div", { className: "mb-4", children: [_jsx(Label, { htmlFor: "adminName", children: "Nombre" }), _jsx(Input, { id: "adminName", name: "adminName", value: formData.adminName, onChange: handleChange, required: true, disabled: loading })] }), _jsxs("div", { className: "mb-4", children: [_jsx(Label, { htmlFor: "adminDNI", children: "DNI/Identificaci\u00F3n" }), _jsx(Input, { id: "adminDNI", name: "adminDNI", value: formData.adminDNI, onChange: handleChange, required: true, disabled: loading })] }), _jsxs("div", { className: "mb-4", children: [_jsx(Label, { htmlFor: "adminEmail", children: "Email" }), _jsx(Input, { id: "adminEmail", name: "adminEmail", type: "email", value: formData.adminEmail, onChange: handleChange, required: true, disabled: loading })] }), _jsxs("div", { className: "mb-4", children: [_jsx(Label, { htmlFor: "adminPhone", children: "Tel\u00E9fono" }), _jsx(Input, { id: "adminPhone", name: "adminPhone", value: formData.adminPhone, onChange: handleChange, required: true, disabled: loading })] }), _jsxs("div", { className: "mb-4", children: [_jsx(Label, { htmlFor: "adminAddress", children: "Direcci\u00F3n" }), _jsx(Input, { id: "adminAddress", name: "adminAddress", value: formData.adminAddress, onChange: handleChange, required: true, disabled: loading })] })] })] }), error && (_jsx("div", { className: "mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded", children: error })), _jsxs("div", { className: "mt-6 flex justify-end space-x-4", children: [_jsx(Button, { type: "button", onClick: onCancel, variant: "outline", disabled: loading, children: "Cancelar" }), _jsx(Button, { type: "submit", className: "bg-indigo-600 hover:bg-indigo-700 text-white", disabled: loading, children: loading ? 'Guardando...' : 'Guardar Cambios' })] })] }));
}
