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
import { getPets, createPet, updatePet, deletePet } from '@/services/petService';
export default function PetsPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPet, setCurrentPet] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        species: '',
        breed: '',
        ownerName: '',
        propertyId: 0,
        isActive: true,
    });
    const fetchPets = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const data = yield getPets();
            setPets(data);
        }
        catch (error) {
            console.error('Error fetching pets:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar las mascotas.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    }), [toast]);
    useEffect(() => {
        if (!authLoading && user) {
            fetchPets();
        }
    }, [authLoading, user, fetchPets]);
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: type === 'number' ? parseInt(value) : value })));
    };
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: checked })));
    };
    const handleAddPet = () => {
        setCurrentPet(null);
        setFormData({
            name: '',
            species: '',
            breed: '',
            ownerName: '',
            propertyId: 0,
            isActive: true,
        });
        setIsModalOpen(true);
    };
    const handleEditPet = (pet) => {
        setCurrentPet(pet);
        setFormData({
            name: pet.name,
            species: pet.species,
            breed: pet.breed,
            ownerName: pet.ownerName,
            propertyId: pet.propertyId,
            isActive: pet.isActive,
        });
        setIsModalOpen(true);
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        try {
            if (currentPet) {
                yield updatePet(currentPet.id, formData);
                toast({
                    title: 'Éxito',
                    description: 'Mascota actualizada correctamente.',
                });
            }
            else {
                yield createPet(formData);
                toast({
                    title: 'Éxito',
                    description: 'Mascota creada correctamente.',
                });
            }
            setIsModalOpen(false);
            fetchPets();
        }
        catch (error) {
            console.error('Error saving pet:', error);
            toast({
                title: 'Error',
                description: 'Error al guardar la mascota.',
                variant: 'destructive',
            });
        }
    });
    const handleDeletePet = (id) => __awaiter(this, void 0, void 0, function* () {
        if (confirm('¿Estás seguro de que quieres eliminar esta mascota?')) {
            try {
                yield deletePet(id);
                toast({
                    title: 'Éxito',
                    description: 'Mascota eliminada correctamente.',
                });
                fetchPets();
            }
            catch (error) {
                console.error('Error deleting pet:', error);
                toast({
                    title: 'Error',
                    description: 'Error al eliminar la mascota.',
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
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Gesti\u00F3n de Mascotas" }), _jsx("div", { className: "flex justify-end mb-4", children: _jsxs(Button, { onClick: handleAddPet, children: [_jsx(PlusCircle, { className: "mr-2 h-4 w-4" }), " A\u00F1adir Mascota"] }) }), _jsx("div", { className: "bg-white shadow-md rounded-lg overflow-hidden", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Nombre" }), _jsx(TableHead, { children: "Especie" }), _jsx(TableHead, { children: "Raza" }), _jsx(TableHead, { children: "Propietario" }), _jsx(TableHead, { children: "Propiedad" }), _jsx(TableHead, { children: "Activa" }), _jsx(TableHead, {})] }) }), _jsx(TableBody, { children: pets.map((pet) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: pet.name }), _jsx(TableCell, { children: pet.species }), _jsx(TableCell, { children: pet.breed }), _jsx(TableCell, { children: pet.ownerName }), _jsx(TableCell, { children: pet.unitNumber }), _jsx(TableCell, { children: pet.isActive ? _jsx(Badge, { variant: "default", children: "S\u00ED" }) : _jsx(Badge, { variant: "destructive", children: "No" }) }), _jsxs(TableCell, { className: "text-right", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleEditPet(pet), className: "mr-2", children: _jsx(Edit, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDeletePet(pet.id), children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }, pet.id))) })] }) }), _jsx(Dialog, { open: isModalOpen, onOpenChange: setIsModalOpen, children: _jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: currentPet ? 'Editar Mascota' : 'Añadir Nueva Mascota' }) }), _jsxs("form", { onSubmit: handleSubmit, className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "name", className: "text-right", children: "Nombre" }), _jsx(Input, { id: "name", name: "name", value: formData.name, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "species", className: "text-right", children: "Especie" }), _jsx(Input, { id: "species", name: "species", value: formData.species, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "breed", className: "text-right", children: "Raza" }), _jsx(Input, { id: "breed", name: "breed", value: formData.breed, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "ownerName", className: "text-right", children: "Nombre Propietario" }), _jsx(Input, { id: "ownerName", name: "ownerName", value: formData.ownerName, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "propertyId", className: "text-right", children: "ID Propiedad" }), _jsx(Input, { id: "propertyId", name: "propertyId", type: "number", value: formData.propertyId, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Input, { id: "isActive", name: "isActive", type: "checkbox", checked: formData.isActive, onChange: handleCheckboxChange }), _jsx(Label, { htmlFor: "isActive", children: "Activa" })] }), _jsx(DialogFooter, { children: _jsx(Button, { type: "submit", children: currentPet ? 'Guardar Cambios' : 'Añadir Mascota' }) })] })] }) })] }));
}
