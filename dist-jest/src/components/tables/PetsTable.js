// src/components/tables/PetsTable.tsx
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Plus, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
export function PetsTable() {
    const [pets, setPets] = useState([
        {
            id: 1,
            name: 'Luna',
            type: 'Perro',
            breed: 'Golden Retriever',
            color: 'Dorado',
            age: 3,
            ownerName: 'Carlos Rodríguez',
            propertyNumber: 'A202',
            hasVaccineRecord: true
        },
        {
            id: 2,
            name: 'Michi',
            type: 'Gato',
            breed: 'Siamés',
            color: 'Blanco/Gris',
            age: 2,
            ownerName: 'Ana Martínez',
            propertyNumber: 'B105',
            hasVaccineRecord: true
        }
    ]);
    const [_searchTerm, _setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [currentPet, setCurrentPet] = useState(null);
    const [_formData, _setFormData] = useState({
        name: '',
        type: 'Perro',
        breed: '',
        color: '',
        age: 0,
        ownerName: '',
        propertyNumber: '',
        hasVaccineRecord: false
    });
    // Filtrar mascotas según término de búsqueda
    const filteredPets = pets.filter((pet) => {
        const searchValue = searchTerm.toLowerCase();
        return (pet.name.toLowerCase().includes(searchValue) ||
            pet.ownerName.toLowerCase().includes(searchValue) ||
            pet.propertyNumber.toLowerCase().includes(searchValue) ||
            pet.type.toLowerCase().includes(searchValue) ||
            pet.breed.toLowerCase().includes(searchValue));
    });
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        // Manejar diferentes tipos de input
        if (type === 'checkbox') {
            const checked = e.target.checked;
            setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: checked })));
        }
        else if (type === 'number') {
            setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: parseInt(value) || 0 })));
        }
        else {
            setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
        }
    };
    const handleEdit = (pet) => {
        setCurrentPet(pet);
        setFormData(pet);
        setModalOpen(true);
    };
    const handleDelete = (id) => {
        if (confirm('¿Está seguro de eliminar esta mascota?')) {
            setPets(pets.filter(pet => pet.id !== id));
        }
    };
    const handleAddNew = () => {
        setCurrentPet(null);
        setFormData({
            name: '',
            type: 'Perro',
            breed: '',
            color: '',
            age: 0,
            ownerName: '',
            propertyNumber: '',
            hasVaccineRecord: false
        });
        setModalOpen(true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentPet) {
            // Actualizar mascota existente
            const updatedPets = pets.map(pet => pet.id === currentPet.id ? Object.assign(Object.assign({}, pet), formData) : pet);
            setPets(updatedPets);
        }
        else {
            // Añadir nueva mascota
            const newPet = Object.assign({ id: Math.max(0, ...pets.map(p => p.id)) + 1 }, formData);
            setPets([...pets, newPet]);
        }
        setModalOpen(false);
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx(Input, { placeholder: "Buscar por nombre, propietario, tipo...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "max-w-sm" }), _jsxs(Button, { onClick: handleAddNew, className: "bg-green-600 hover:bg-green-700 text-white", children: [_jsx(Plus, { className: "mr-2 h-4 w-4" }), "Nueva Mascota"] })] }), _jsx("div", { className: "rounded-md border", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Nombre" }), _jsx(TableHead, { children: "Tipo" }), _jsx(TableHead, { children: "Raza" }), _jsx(TableHead, { children: "Color" }), _jsx(TableHead, { children: "Edad" }), _jsx(TableHead, { children: "Propietario" }), _jsx(TableHead, { children: "Unidad" }), _jsx(TableHead, { children: "Vacunas" }), _jsx(TableHead, { className: "text-right", children: "Acciones" })] }) }), _jsx(TableBody, { children: filteredPets.length > 0 ? (filteredPets.map((pet) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium", children: pet.name }), _jsx(TableCell, { children: pet.type }), _jsx(TableCell, { children: pet.breed }), _jsx(TableCell, { children: pet.color }), _jsxs(TableCell, { children: [pet.age, " a\u00F1os"] }), _jsx(TableCell, { children: pet.ownerName }), _jsx(TableCell, { children: pet.propertyNumber }), _jsx(TableCell, { children: pet.hasVaccineRecord ? (_jsx("span", { className: "px-2 py-1 rounded-full text-xs bg-green-100 text-green-800", children: "Al d\u00EDa" })) : (_jsx("span", { className: "px-2 py-1 rounded-full text-xs bg-red-100 text-red-800", children: "Pendiente" })) }), _jsx(TableCell, { className: "text-right", children: _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx(Button, { onClick: () => handleEdit(pet), size: "sm", variant: "ghost", className: "h-8 w-8 p-0", children: _jsx(Edit, { className: "h-4 w-4" }) }), _jsx(Button, { size: "sm", variant: "ghost", className: "h-8 w-8 p-0 text-blue-500 hover:text-blue-700", children: _jsx(FileText, { className: "h-4 w-4" }) }), _jsx(Button, { onClick: () => handleDelete(pet.id), size: "sm", variant: "ghost", className: "h-8 w-8 p-0 text-red-500 hover:text-red-700", children: _jsx(Trash, { className: "h-4 w-4" }) })] }) })] }, pet.id)))) : (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 9, className: "text-center py-6", children: "No se encontraron mascotas" }) })) })] }) }), _jsx(Dialog, { open: modalOpen, onOpenChange: setModalOpen, children: _jsxs(DialogContent, { className: "sm:max-w-md", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: currentPet ? 'Editar Mascota' : 'Nueva Mascota' }) }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 mt-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "name", children: "Nombre" }), _jsx(Input, { id: "name", name: "name", value: formData.name || '', onChange: handleChange, required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "type", children: "Tipo" }), _jsxs("select", { id: "type", name: "type", value: formData.type || '', onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md", required: true, children: [_jsx("option", { value: "Perro", children: "Perro" }), _jsx("option", { value: "Gato", children: "Gato" }), _jsx("option", { value: "Ave", children: "Ave" }), _jsx("option", { value: "Otro", children: "Otro" })] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "breed", children: "Raza" }), _jsx(Input, { id: "breed", name: "breed", value: formData.breed || '', onChange: handleChange, required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "color", children: "Color" }), _jsx(Input, { id: "color", name: "color", value: formData.color || '', onChange: handleChange, required: true })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "age", children: "Edad (a\u00F1os)" }), _jsx(Input, { id: "age", name: "age", type: "number", min: "0", max: "30", value: formData.age || 0, onChange: handleChange, required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "ownerName", children: "Propietario" }), _jsx(Input, { id: "ownerName", name: "ownerName", value: formData.ownerName || '', onChange: handleChange, required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "propertyNumber", children: "Unidad" }), _jsx(Input, { id: "propertyNumber", name: "propertyNumber", value: formData.propertyNumber || '', onChange: handleChange, required: true })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "hasVaccineRecord", name: "hasVaccineRecord", checked: formData.hasVaccineRecord || false, onCheckedChange: (checked) => handleChange({ target: { name: 'hasVaccineRecord', checked: checked } }) }), _jsx(Label, { htmlFor: "hasVaccineRecord", children: "Carnet de vacunaci\u00F3n al d\u00EDa" })] }), _jsxs("div", { className: "flex justify-end space-x-4 pt-4", children: [_jsx(Button, { type: "button", onClick: () => setModalOpen(false), variant: "outline", children: "Cancelar" }), _jsx(Button, { type: "submit", className: "bg-indigo-600 hover:bg-indigo-700 text-white", children: currentPet ? 'Actualizar' : 'Guardar' })] })] })] }) })] }));
}
