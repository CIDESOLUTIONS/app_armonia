import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
/**
 * Formulario para crear o editar propiedades
 */
export const PropertyForm = ({ initialData, onSubmit, onCancel }) => {
    const [property, setProperty] = useState(initialData || {
        unitNumber: '',
        type: 'APARTMENT',
        block: '',
        zone: '',
        area: '',
        bathrooms: '',
        bedrooms: '',
        parking: '',
        floor: '',
        status: 'AVAILABLE'
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProperty(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(property);
    };
    return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: property.id ? 'Editar Propiedad' : 'Nueva Propiedad' }) }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "N\u00FAmero/Identificador" }), _jsx(Input, { name: "unitNumber", value: property.unitNumber, onChange: handleChange, required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Tipo" }), _jsxs("select", { name: "type", value: property.type, onChange: handleChange, className: "mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md", children: [_jsx("option", { value: "APARTMENT", children: "Apartamento" }), _jsx("option", { value: "HOUSE", children: "Casa" }), _jsx("option", { value: "OFFICE", children: "Oficina" }), _jsx("option", { value: "COMMERCIAL", children: "Local Comercial" }), _jsx("option", { value: "PARKING", children: "Parqueadero" }), _jsx("option", { value: "STORAGE", children: "Dep\u00F3sito" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Bloque/Torre" }), _jsx(Input, { name: "block", value: property.block, onChange: handleChange })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Zona/Sector" }), _jsx(Input, { name: "zone", value: property.zone, onChange: handleChange })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "\u00C1rea (m\u00B2)" }), _jsx(Input, { name: "area", type: "number", value: property.area, onChange: handleChange })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Ba\u00F1os" }), _jsx(Input, { name: "bathrooms", type: "number", value: property.bathrooms, onChange: handleChange })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Habitaciones" }), _jsx(Input, { name: "bedrooms", type: "number", value: property.bedrooms, onChange: handleChange })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Parqueaderos" }), _jsx(Input, { name: "parking", type: "number", value: property.parking, onChange: handleChange })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Piso" }), _jsx(Input, { name: "floor", type: "number", value: property.floor, onChange: handleChange })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Estado" }), _jsxs("select", { name: "status", value: property.status, onChange: handleChange, className: "mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md", children: [_jsx("option", { value: "AVAILABLE", children: "Disponible" }), _jsx("option", { value: "OCCUPIED", children: "Ocupado" }), _jsx("option", { value: "MAINTENANCE", children: "En Mantenimiento" }), _jsx("option", { value: "INACTIVE", children: "Inactivo" })] })] })] }), _jsxs("div", { className: "flex justify-end space-x-3 mt-6", children: [_jsx(Button, { type: "button", variant: "outline", onClick: onCancel, children: "Cancelar" }), _jsxs(Button, { type: "submit", children: [property.id ? 'Actualizar' : 'Crear', " Propiedad"] })] })] }) })] }));
};
export default PropertyForm;
