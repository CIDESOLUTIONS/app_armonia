// src/components/tables/VehiclesTable.tsx
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
export function VehiclesTable() {
    const [vehicles, setVehicles] = useState([
        {
            id: 1,
            plate: 'ABC123',
            type: 'Automóvil',
            brand: 'Toyota',
            model: 'Corolla',
            color: 'Blanco',
            ownerName: 'Juan Pérez',
            propertyNumber: 'A101',
            parkingSpace: 'P12'
        },
        {
            id: 2,
            plate: 'XYZ456',
            type: 'Motocicleta',
            brand: 'Honda',
            model: 'CBR',
            color: 'Rojo',
            ownerName: 'María López',
            propertyNumber: 'B205',
            parkingSpace: 'M05'
        }
    ]);
    const [_searchTerm, _setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [currentVehicle, setCurrentVehicle] = useState(null);
    const [_formData, _setFormData] = useState({
        plate: '',
        type: 'Automóvil',
        brand: '',
        model: '',
        color: '',
        ownerName: '',
        propertyNumber: '',
        parkingSpace: ''
    });
    // Filtrar vehículos según término de búsqueda
    const filteredVehicles = vehicles.filter((vehicle) => {
        const searchValue = searchTerm.toLowerCase();
        return (vehicle.plate.toLowerCase().includes(searchValue) ||
            vehicle.ownerName.toLowerCase().includes(searchValue) ||
            vehicle.propertyNumber.toLowerCase().includes(searchValue) ||
            vehicle.brand.toLowerCase().includes(searchValue) ||
            vehicle.model.toLowerCase().includes(searchValue));
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleEdit = (vehicle) => {
        setCurrentVehicle(vehicle);
        setFormData(vehicle);
        setModalOpen(true);
    };
    const handleDelete = (id) => {
        if (confirm('¿Está seguro de eliminar este vehículo?')) {
            setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
        }
    };
    const handleAddNew = () => {
        setCurrentVehicle(null);
        setFormData({
            plate: '',
            type: 'Automóvil',
            brand: '',
            model: '',
            color: '',
            ownerName: '',
            propertyNumber: '',
            parkingSpace: ''
        });
        setModalOpen(true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentVehicle) {
            // Actualizar vehículo existente
            const updatedVehicles = vehicles.map(vehicle => vehicle.id === currentVehicle.id ? Object.assign(Object.assign({}, vehicle), formData) : vehicle);
            setVehicles(updatedVehicles);
        }
        else {
            // Añadir nuevo vehículo
            const newVehicle = Object.assign({ id: Math.max(0, ...vehicles.map(v => v.id)) + 1 }, formData);
            setVehicles([...vehicles, newVehicle]);
        }
        setModalOpen(false);
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx(Input, { placeholder: "Buscar por placa, propietario, unidad...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "max-w-sm" }), _jsxs(Button, { onClick: handleAddNew, className: "bg-green-600 hover:bg-green-700 text-white", children: [_jsx(Plus, { className: "mr-2 h-4 w-4" }), "Nuevo Veh\u00EDculo"] })] }), _jsx("div", { className: "rounded-md border", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Placa" }), _jsx(TableHead, { children: "Tipo" }), _jsx(TableHead, { children: "Marca/Modelo" }), _jsx(TableHead, { children: "Color" }), _jsx(TableHead, { children: "Propietario" }), _jsx(TableHead, { children: "Unidad" }), _jsx(TableHead, { children: "Parqueadero" }), _jsx(TableHead, { className: "text-right", children: "Acciones" })] }) }), _jsx(TableBody, { children: filteredVehicles.length > 0 ? (filteredVehicles.map((vehicle) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium", children: vehicle.plate }), _jsx(TableCell, { children: vehicle.type }), _jsxs(TableCell, { children: [vehicle.brand, " ", vehicle.model] }), _jsx(TableCell, { children: vehicle.color }), _jsx(TableCell, { children: vehicle.ownerName }), _jsx(TableCell, { children: vehicle.propertyNumber }), _jsx(TableCell, { children: vehicle.parkingSpace }), _jsx(TableCell, { className: "text-right", children: _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx(Button, { onClick: () => handleEdit(vehicle), size: "sm", variant: "ghost", className: "h-8 w-8 p-0", children: _jsx(Edit, { className: "h-4 w-4" }) }), _jsx(Button, { onClick: () => handleDelete(vehicle.id), size: "sm", variant: "ghost", className: "h-8 w-8 p-0 text-red-500 hover:text-red-700", children: _jsx(Trash, { className: "h-4 w-4" }) })] }) })] }, vehicle.id)))) : (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 8, className: "text-center py-6", children: "No se encontraron veh\u00EDculos" }) })) })] }) }), _jsx(Dialog, { open: modalOpen, onOpenChange: setModalOpen, children: _jsxs(DialogContent, { className: "sm:max-w-md", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: currentVehicle ? 'Editar Vehículo' : 'Nuevo Vehículo' }) }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 mt-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "plate", children: "Placa" }), _jsx(Input, { id: "plate", name: "plate", value: formData.plate || '', onChange: handleChange, required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "type", children: "Tipo" }), _jsxs(Select, { value: formData.type || '', onValueChange: (value) => handleChange({ target: { name: 'type', value } }), children: [_jsx(SelectTrigger, { className: "w-full px-3 py-2 border border-gray-300 rounded-md", children: _jsx(SelectValue, { placeholder: "Seleccionar tipo" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Autom\u00F3vil", children: "Autom\u00F3vil" }), _jsx(SelectItem, { value: "Motocicleta", children: "Motocicleta" }), _jsx(SelectItem, { value: "Camioneta", children: "Camioneta" }), _jsx(SelectItem, { value: "Otro", children: "Otro" })] })] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "brand", children: "Marca" }), _jsx(Input, { id: "brand", name: "brand", value: formData.brand || '', onChange: handleChange, required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "model", children: "Modelo" }), _jsx(Input, { id: "model", name: "model", value: formData.model || '', onChange: handleChange, required: true })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "color", children: "Color" }), _jsx(Input, { id: "color", name: "color", value: formData.color || '', onChange: handleChange, required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "ownerName", children: "Propietario" }), _jsx(Input, { id: "ownerName", name: "ownerName", value: formData.ownerName || '', onChange: handleChange, required: true })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "propertyNumber", children: "Unidad" }), _jsx(Input, { id: "propertyNumber", name: "propertyNumber", value: formData.propertyNumber || '', onChange: handleChange, required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "parkingSpace", children: "Parqueadero" }), _jsx(Input, { id: "parkingSpace", name: "parkingSpace", value: formData.parkingSpace || '', onChange: handleChange, required: true })] })] }), _jsxs("div", { className: "flex justify-end space-x-4 pt-4", children: [_jsx(Button, { type: "button", onClick: () => setModalOpen(false), variant: "outline", children: "Cancelar" }), _jsx(Button, { type: "submit", className: "bg-indigo-600 hover:bg-indigo-700 text-white", children: currentVehicle ? 'Actualizar' : 'Guardar' })] })] })] }) })] }));
}
