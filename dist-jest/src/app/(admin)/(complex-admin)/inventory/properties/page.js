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
import { getProperties, createProperty, updateProperty, deleteProperty } from '@/services/propertyService';
export default function PropertiesPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProperty, setCurrentProperty] = useState(null);
    const [formData, setFormData] = useState({
        unitNumber: '',
        address: '',
        type: '',
        area: 0,
        bedrooms: 0,
        bathrooms: 0,
        parkingSpaces: 0,
        isActive: true,
    });
    const fetchProperties = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const data = yield getProperties();
            setProperties(data);
        }
        catch (error) {
            console.error('Error fetching properties:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar las propiedades.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    }), [toast]);
    useEffect(() => {
        if (!authLoading && user) {
            fetchProperties();
        }
    }, [authLoading, user, fetchProperties]);
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: type === 'number' ? parseFloat(value) : value })));
    };
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: checked })));
    };
    const handleAddProperty = () => {
        setCurrentProperty(null);
        setFormData({
            unitNumber: '',
            address: '',
            type: '',
            area: 0,
            bedrooms: 0,
            bathrooms: 0,
            parkingSpaces: 0,
            isActive: true,
        });
        setIsModalOpen(true);
    };
    const handleEditProperty = (property) => {
        setCurrentProperty(property);
        setFormData({
            unitNumber: property.unitNumber,
            address: property.address,
            type: property.type,
            area: property.area,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            parkingSpaces: property.parkingSpaces,
            isActive: property.isActive,
        });
        setIsModalOpen(true);
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        try {
            if (currentProperty) {
                yield updateProperty(currentProperty.id, formData);
                toast({
                    title: 'Éxito',
                    description: 'Propiedad actualizada correctamente.',
                });
            }
            else {
                yield createProperty(formData);
                toast({
                    title: 'Éxito',
                    description: 'Propiedad creada correctamente.',
                });
            }
            setIsModalOpen(false);
            fetchProperties();
        }
        catch (error) {
            console.error('Error saving property:', error);
            toast({
                title: 'Error',
                description: 'Error al guardar la propiedad.',
                variant: 'destructive',
            });
        }
    });
    const handleDeleteProperty = (id) => __awaiter(this, void 0, void 0, function* () {
        if (confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) {
            try {
                yield deleteProperty(id);
                toast({
                    title: 'Éxito',
                    description: 'Propiedad eliminada correctamente.',
                });
                fetchProperties();
            }
            catch (error) {
                console.error('Error deleting property:', error);
                toast({
                    title: 'Error',
                    description: 'Error al eliminar la propiedad.',
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
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Gesti\u00F3n de Propiedades" }), _jsx("div", { className: "flex justify-end mb-4", children: _jsxs(Button, { onClick: handleAddProperty, children: [_jsx(PlusCircle, { className: "mr-2 h-4 w-4" }), " A\u00F1adir Propiedad"] }) }), _jsx("div", { className: "bg-white shadow-md rounded-lg overflow-hidden", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "N\u00FAmero de Unidad" }), _jsx(TableHead, { children: "Direcci\u00F3n" }), _jsx(TableHead, { children: "Tipo" }), _jsx(TableHead, { children: "\u00C1rea (m\u00B2)" }), _jsx(TableHead, { children: "Habitaciones" }), _jsx(TableHead, { children: "Ba\u00F1os" }), _jsx(TableHead, { children: "Parqueaderos" }), _jsx(TableHead, { children: "Activa" }), _jsx(TableHead, {})] }) }), _jsx(TableBody, { children: properties.map((property) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: property.unitNumber }), _jsx(TableCell, { children: property.address }), _jsx(TableCell, { children: property.type }), _jsx(TableCell, { children: property.area }), _jsx(TableCell, { children: property.bedrooms }), _jsx(TableCell, { children: property.bathrooms }), _jsx(TableCell, { children: property.parkingSpaces }), _jsx(TableCell, { children: property.isActive ? _jsx(Badge, { variant: "default", children: "S\u00ED" }) : _jsx(Badge, { variant: "destructive", children: "No" }) }), _jsxs(TableCell, { className: "text-right", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleEditProperty(property), className: "mr-2", children: _jsx(Edit, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDeleteProperty(property.id), children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }, property.id))) })] }) }), _jsx(Dialog, { open: isModalOpen, onOpenChange: setIsModalOpen, children: _jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: currentProperty ? 'Editar Propiedad' : 'Añadir Nueva Propiedad' }) }), _jsxs("form", { onSubmit: handleSubmit, className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "unitNumber", className: "text-right", children: "N\u00FAmero de Unidad" }), _jsx(Input, { id: "unitNumber", name: "unitNumber", value: formData.unitNumber, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "address", className: "text-right", children: "Direcci\u00F3n" }), _jsx(Input, { id: "address", name: "address", value: formData.address, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "type", className: "text-right", children: "Tipo" }), _jsx(Input, { id: "type", name: "type", value: formData.type, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "area", className: "text-right", children: "\u00C1rea (m\u00B2)" }), _jsx(Input, { id: "area", name: "area", type: "number", value: formData.area, onChange: handleInputChange, className: "col-span-3" })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "bedrooms", className: "text-right", children: "Habitaciones" }), _jsx(Input, { id: "bedrooms", name: "bedrooms", type: "number", value: formData.bedrooms, onChange: handleInputChange, className: "col-span-3" })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "bathrooms", className: "text-right", children: "Ba\u00F1os" }), _jsx(Input, { id: "bathrooms", name: "bathrooms", type: "number", value: formData.bathrooms, onChange: handleInputChange, className: "col-span-3" })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "parkingSpaces", className: "text-right", children: "Parqueaderos" }), _jsx(Input, { id: "parkingSpaces", name: "parkingSpaces", type: "number", value: formData.parkingSpaces, onChange: handleInputChange, className: "col-span-3" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Input, { id: "isActive", name: "isActive", type: "checkbox", checked: formData.isActive, onChange: handleCheckboxChange }), _jsx(Label, { htmlFor: "isActive", children: "Activa" })] }), _jsx(DialogFooter, { children: _jsx(Button, { type: "submit", children: currentProperty ? 'Guardar Cambios' : 'Añadir Propiedad' }) })] })] }) })] }));
}
