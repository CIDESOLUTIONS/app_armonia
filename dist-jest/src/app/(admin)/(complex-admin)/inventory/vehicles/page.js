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
import { useState, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '@/services/vehicleService';
export default function VehiclesPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentVehicle, setCurrentVehicle] = useState(null);
    const [formData, setFormData] = useState({
        licensePlate: '',
        brand: '',
        model: '',
        color: '',
        ownerName: '',
        propertyId: 0,
        parkingSpace: '',
        isActive: true,
    });
    const fetchVehicles = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const data = yield getVehicles();
            setVehicles(data);
        }
        catch (error) {
            console.error('Error fetching vehicles:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar los vehículos.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    }), [toast]);
    useEffect(() => {
        if (!authLoading && user) {
            fetchVehicles();
        }
    }, [authLoading, user, fetchVehicles]);
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: type === 'number' ? parseInt(value) : value })));
    };
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: checked })));
    };
    const handleAddVehicle = () => {
        setCurrentVehicle(null);
        setFormData({
            licensePlate: '',
            brand: '',
            model: '',
            color: '',
            ownerName: '',
            propertyId: 0,
            parkingSpace: '',
            isActive: true,
        });
        setIsModalOpen(true);
    };
    const handleEditVehicle = (vehicle) => {
        setCurrentVehicle(vehicle);
        setFormData({
            licensePlate: vehicle.licensePlate,
            brand: vehicle.brand,
            model: vehicle.model,
            color: vehicle.color,
            ownerName: vehicle.ownerName,
            propertyId: vehicle.propertyId,
            parkingSpace: vehicle.parkingSpace,
            isActive: vehicle.isActive,
        });
        setIsModalOpen(true);
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        try {
            if (currentVehicle) {
                yield updateVehicle(currentVehicle.id, formData);
                toast({
                    title: 'Éxito',
                    description: 'Vehículo actualizado correctamente.',
                });
            }
            else {
                yield createVehicle(formData);
                toast({
                    title: 'Éxito',
                    description: 'Vehículo creado correctamente.',
                });
            }
            setIsModalOpen(false);
            fetchVehicles();
        }
        catch (error) {
            console.error('Error saving vehicle:', error);
            toast({
                title: 'Error',
                description: 'Error al guardar el vehículo.',
                variant: 'destructive',
            });
        }
    });
    const handleDeleteVehicle = (id) => __awaiter(this, void 0, void 0, function* () {
        if (confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
            try {
                yield deleteVehicle(id);
                toast({
                    title: 'Éxito',
                    description: 'Vehículo eliminado correctamente.',
                });
                fetchVehicles();
            }
            catch (error) {
                console.error('Error deleting vehicle:', error);
                toast({
                    title: 'Error',
                    description: 'Error al eliminar el vehículo.',
                    variant: 'destructive',
                });
            }
        }
    });
    if (authLoading || loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    if (!user || (user.role !== 'ADMIN' && user.role !== 'COMPLEX_ADMIN')) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Acceso Denegado" }), _jsx("p", { className: "text-gray-600", children: "No tienes permisos para acceder a esta p\u00E1gina." })] }) }));
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Gesti\u00F3n de Veh\u00EDculos" }), _jsx("div", { className: "flex justify-end mb-4", children: _jsxs(Button, { onClick: handleAddVehicle, children: [_jsx(PlusCircle, { className: "mr-2 h-4 w-4" }), " A\u00F1adir Veh\u00EDculo"] }) }), _jsx("div", { className: "bg-white shadow-md rounded-lg overflow-hidden", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Placa" }), _jsx(TableHead, { children: "Marca" }), _jsx(TableHead, { children: "Modelo" }), _jsx(TableHead, { children: "Color" }), _jsx(TableHead, { children: "Propietario" }), _jsx(TableHead, { children: "Propiedad" }), _jsx(TableHead, { children: "Parqueadero" }), _jsx(TableHead, { children: "Activo" }), _jsx(TableHead, {})] }) }), _jsx(TableBody, { children: vehicles.map((vehicle) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: vehicle.licensePlate }), _jsx(TableCell, { children: vehicle.brand }), _jsx(TableCell, { children: vehicle.model }), _jsx(TableCell, { children: vehicle.color }), _jsx(TableCell, { children: vehicle.ownerName }), _jsx(TableCell, { children: vehicle.unitNumber }), _jsx(TableCell, { children: vehicle.parkingSpace }), _jsx(TableCell, { children: vehicle.isActive ? _jsx(Badge, { variant: "default", children: "S\u00ED" }) : _jsx(Badge, { variant: "destructive", children: "No" }) }), _jsxs(TableCell, { className: "text-right", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleEditVehicle(vehicle), className: "mr-2", children: _jsx(Edit, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDeleteVehicle(vehicle.id), children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }, vehicle.id))) })] }) }), _jsx(Dialog, { open: isModalOpen, onOpenChange: setIsModalOpen, children: _jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: currentVehicle ? 'Editar Vehículo' : 'Añadir Nuevo Vehículo' }) }), _jsxs("form", { onSubmit: handleSubmit, className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "licensePlate", className: "text-right", children: "Placa" }), _jsx(Input, { id: "licensePlate", name: "licensePlate", value: formData.licensePlate, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "brand", className: "text-right", children: "Marca" }), _jsx(Input, { id: "brand", name: "brand", value: formData.brand, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "model", className: "text-right", children: "Modelo" }), _jsx(Input, { id: "model", name: "model", value: formData.model, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "color", className: "text-right", children: "Color" }), _jsx(Input, { id: "color", name: "color", value: formData.color, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "ownerName", className: "text-right", children: "Nombre Propietario" }), _jsx(Input, { id: "ownerName", name: "ownerName", value: formData.ownerName, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "propertyId", className: "text-right", children: "ID Propiedad" }), _jsx(Input, { id: "propertyId", name: "propertyId", type: "number", value: formData.propertyId, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "parkingSpace", className: "text-right", children: "Parqueadero" }), _jsx(Input, { id: "parkingSpace", name: "parkingSpace", value: formData.parkingSpace, onChange: handleInputChange, className: "col-span-3" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Input, { id: "isActive", name: "isActive", type: "checkbox", checked: formData.isActive, onChange: handleCheckboxChange }), _jsx(Label, { htmlFor: "isActive", children: "Activo" })] }), _jsx(DialogFooter, { children: _jsx(Button, { type: "submit", children: currentVehicle ? 'Guardar Cambios' : 'Añadir Vehículo' }) })] })] }) })] }));
}
