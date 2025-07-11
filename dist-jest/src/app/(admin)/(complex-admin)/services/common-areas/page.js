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
import { useAuthStore } from '@/store/authStore';
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { getAmenities, createAmenity, updateAmenity, deleteAmenity } from '@/services/amenityService';
export default function CommonAreasPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [amenities, setAmenities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAmenity, setCurrentAmenity] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        capacity: 0,
        requiresApproval: false,
        hasFee: false,
        feeAmount: 0,
        isActive: true,
    });
    const fetchAmenities = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const data = yield getAmenities();
            setAmenities(data);
        }
        catch (error) {
            console.error('Error fetching amenities:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar las áreas comunes.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    }), [toast]);
    useEffect(() => {
        if (!authLoading && user) {
            fetchAmenities();
        }
    }, [authLoading, user, fetchAmenities]);
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: type === 'number' ? parseFloat(value) : value })));
    };
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: checked })));
    };
    const handleAddAmenity = () => {
        setCurrentAmenity(null);
        setFormData({
            name: '',
            description: '',
            location: '',
            capacity: 0,
            requiresApproval: false,
            hasFee: false,
            feeAmount: 0,
            isActive: true,
        });
        setIsModalOpen(true);
    };
    const handleEditAmenity = (amenity) => {
        setCurrentAmenity(amenity);
        setFormData({
            name: amenity.name,
            description: amenity.description || '',
            location: amenity.location,
            capacity: amenity.capacity,
            requiresApproval: amenity.requiresApproval,
            hasFee: amenity.hasFee,
            feeAmount: amenity.feeAmount || 0,
            isActive: amenity.isActive,
        });
        setIsModalOpen(true);
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        try {
            if (currentAmenity) {
                yield updateAmenity(currentAmenity.id, formData);
                toast({
                    title: 'Éxito',
                    description: 'Área común actualizada correctamente.',
                });
            }
            else {
                yield createAmenity(formData);
                toast({
                    title: 'Éxito',
                    description: 'Área común creada correctamente.',
                });
            }
            setIsModalOpen(false);
            fetchAmenities();
        }
        catch (error) {
            console.error('Error saving amenity:', error);
            toast({
                title: 'Error',
                description: 'Error al guardar el área común.',
                variant: 'destructive',
            });
        }
    });
    const handleDeleteAmenity = (id) => __awaiter(this, void 0, void 0, function* () {
        if (confirm('¿Estás seguro de que quieres eliminar esta área común?')) {
            try {
                yield deleteAmenity(id);
                toast({
                    title: 'Éxito',
                    description: 'Área común eliminada correctamente.',
                });
                fetchAmenities();
            }
            catch (error) {
                console.error('Error deleting amenity:', error);
                toast({
                    title: 'Error',
                    description: 'Error al eliminar el área común.',
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
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Gesti\u00F3n de \u00C1reas Comunes" }), _jsx("div", { className: "flex justify-end mb-4", children: _jsxs(Button, { onClick: handleAddAmenity, children: [_jsx(PlusCircle, { className: "mr-2 h-4 w-4" }), " A\u00F1adir \u00C1rea Com\u00FAn"] }) }), _jsx("div", { className: "bg-white shadow-md rounded-lg overflow-hidden", children: _jsxs("table", { className: "min-w-full leading-normal", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Nombre" }), _jsx("th", { className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Descripci\u00F3n" }), _jsx("th", { className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Ubicaci\u00F3n" }), _jsx("th", { className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Capacidad" }), _jsx("th", { className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Requiere Aprobaci\u00F3n" }), _jsx("th", { className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Tiene Costo" }), _jsx("th", { className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Costo" }), _jsx("th", { className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Activa" }), _jsx("th", { className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100" })] }) }), _jsx("tbody", { children: amenities.map((amenity) => (_jsxs("tr", { children: [_jsx("td", { className: "px-5 py-5 border-b border-gray-200 bg-white text-sm", children: amenity.name }), _jsx("td", { className: "px-5 py-5 border-b border-gray-200 bg-white text-sm", children: amenity.description }), _jsx("td", { className: "px-5 py-5 border-b border-gray-200 bg-white text-sm", children: amenity.location }), _jsx("td", { className: "px-5 py-5 border-b border-gray-200 bg-white text-sm", children: amenity.capacity }), _jsx("td", { className: "px-5 py-5 border-b border-gray-200 bg-white text-sm", children: amenity.requiresApproval ? _jsx(Badge, { variant: "default", children: "S\u00ED" }) : _jsx(Badge, { variant: "destructive", children: "No" }) }), _jsx("td", { className: "px-5 py-5 border-b border-gray-200 bg-white text-sm", children: amenity.hasFee ? _jsx(Badge, { variant: "default", children: "S\u00ED" }) : _jsx(Badge, { variant: "destructive", children: "No" }) }), _jsx("td", { className: "px-5 py-5 border-b border-gray-200 bg-white text-sm", children: amenity.feeAmount }), _jsx("td", { className: "px-5 py-5 border-b border-gray-200 bg-white text-sm", children: amenity.isActive ? _jsx(Badge, { variant: "default", children: "S\u00ED" }) : _jsx(Badge, { variant: "destructive", children: "No" }) }), _jsxs("td", { className: "px-5 py-5 border-b border-gray-200 bg-white text-sm text-right", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleEditAmenity(amenity), className: "mr-2", children: _jsx(Edit, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDeleteAmenity(amenity.id), children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }, amenity.id))) })] }) }), _jsx(Dialog, { open: isModalOpen, onOpenChange: setIsModalOpen, children: _jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: currentAmenity ? 'Editar Amenidad' : 'Añadir Nueva Amenidad' }) }), _jsxs("form", { onSubmit: handleSubmit, className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "name", className: "text-right", children: "Nombre" }), _jsx(Input, { id: "name", name: "name", value: formData.name, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "description", className: "text-right", children: "Descripci\u00F3n" }), _jsx(Input, { id: "description", name: "description", value: formData.description, onChange: handleInputChange, className: "col-span-3" })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "location", className: "text-right", children: "Ubicaci\u00F3n" }), _jsx(Input, { id: "location", name: "location", value: formData.location, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "capacity", className: "text-right", children: "Capacidad" }), _jsx(Input, { id: "capacity", name: "capacity", type: "number", value: formData.capacity, onChange: handleInputChange, className: "col-span-3" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Input, { id: "requiresApproval", name: "requiresApproval", type: "checkbox", checked: formData.requiresApproval, onChange: handleCheckboxChange }), _jsx(Label, { htmlFor: "requiresApproval", children: "Requiere Aprobaci\u00F3n" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Input, { id: "hasFee", name: "hasFee", type: "checkbox", checked: formData.hasFee, onChange: handleCheckboxChange }), _jsx(Label, { htmlFor: "hasFee", children: "Tiene Costo" })] }), formData.hasFee && (_jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "feeAmount", className: "text-right", children: "Costo" }), _jsx(Input, { id: "feeAmount", name: "feeAmount", type: "number", value: formData.feeAmount, onChange: handleInputChange, className: "col-span-3" })] })), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Input, { id: "isActive", name: "isActive", type: "checkbox", checked: formData.isActive, onChange: handleCheckboxChange }), _jsx(Label, { htmlFor: "isActive", children: "Activa" })] }), _jsx(DialogFooter, { children: _jsx(Button, { type: "submit", children: currentAmenity ? 'Guardar Cambios' : 'Añadir Amenidad' }) })] })] }) })] }));
}
