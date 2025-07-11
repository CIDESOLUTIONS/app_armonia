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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { getResidents, createResident, updateResident, deleteResident } from '@/services/residentService';
export default function ResidentsPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentResident, setCurrentResident] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        propertyId: 0,
        role: '',
        isActive: true,
    });
    const fetchResidents = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const data = yield getResidents();
            setResidents(data);
        }
        catch (error) {
            console.error('Error fetching residents:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar los residentes.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    }), [toast]);
    useEffect(() => {
        if (!authLoading && user) {
            fetchResidents();
        }
    }, [authLoading, user, fetchResidents]);
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: type === 'number' ? parseInt(value) : value })));
    };
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: checked })));
    };
    const handleAddResident = () => {
        setCurrentResident(null);
        setFormData({
            name: '',
            email: '',
            phone: '',
            propertyId: 0,
            role: '',
            isActive: true,
        });
        setIsModalOpen(true);
    };
    const handleEditResident = (resident) => {
        setCurrentResident(resident);
        setFormData({
            name: resident.name,
            email: resident.email,
            phone: resident.phone,
            propertyId: resident.propertyId,
            role: resident.role,
            isActive: resident.isActive,
        });
        setIsModalOpen(true);
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        try {
            if (currentResident) {
                yield updateResident(currentResident.id, formData);
                toast({
                    title: 'Éxito',
                    description: 'Residente actualizado correctamente.',
                });
            }
            else {
                yield createResident(formData);
                toast({
                    title: 'Éxito',
                    description: 'Residente creado correctamente.',
                });
            }
            setIsModalOpen(false);
            fetchResidents();
        }
        catch (error) {
            console.error('Error saving resident:', error);
            toast({
                title: 'Error',
                description: 'Error al guardar el residente.',
                variant: 'destructive',
            });
        }
    });
    const handleDeleteResident = (id) => __awaiter(this, void 0, void 0, function* () {
        if (confirm('¿Estás seguro de que quieres eliminar este residente?')) {
            try {
                yield deleteResident(id);
                toast({
                    title: 'Éxito',
                    description: 'Residente eliminado correctamente.',
                });
                fetchResidents();
            }
            catch (error) {
                console.error('Error deleting resident:', error);
                toast({
                    title: 'Error',
                    description: 'Error al eliminar el residente.',
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
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Gesti\u00F3n de Residentes" }), _jsx("div", { className: "flex justify-end mb-4", children: _jsxs(Button, { onClick: handleAddResident, children: [_jsx(PlusCircle, { className: "mr-2 h-4 w-4" }), " A\u00F1adir Residente"] }) }), _jsx("div", { className: "bg-white shadow-md rounded-lg overflow-hidden", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Nombre" }), _jsx(TableHead, { children: "Email" }), _jsx(TableHead, { children: "Tel\u00E9fono" }), _jsx(TableHead, { children: "Propiedad" }), _jsx(TableHead, { children: "Rol" }), _jsx(TableHead, { children: "Activo" }), _jsx(TableHead, {})] }) }), _jsx(TableBody, { children: residents.map((resident) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: resident.name }), _jsx(TableCell, { children: resident.email }), _jsx(TableCell, { children: resident.phone }), _jsx(TableCell, { children: resident.unitNumber }), _jsx(TableCell, { children: resident.role }), _jsx(TableCell, { children: resident.isActive ? _jsx(Badge, { variant: "default", children: "S\u00ED" }) : _jsx(Badge, { variant: "destructive", children: "No" }) }), _jsxs(TableCell, { className: "text-right", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleEditResident(resident), className: "mr-2", children: _jsx(Edit, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDeleteResident(resident.id), children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }, resident.id))) })] }) }), _jsx(Dialog, { open: isModalOpen, onOpenChange: setIsModalOpen, children: _jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: currentResident ? 'Editar Residente' : 'Añadir Nuevo Residente' }) }), _jsxs("form", { onSubmit: handleSubmit, className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "name", className: "text-right", children: "Nombre" }), _jsx(Input, { id: "name", name: "name", value: formData.name, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "email", className: "text-right", children: "Email" }), _jsx(Input, { id: "email", name: "email", type: "email", value: formData.email, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "phone", className: "text-right", children: "Tel\u00E9fono" }), _jsx(Input, { id: "phone", name: "phone", value: formData.phone, onChange: handleInputChange, className: "col-span-3" })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "propertyId", className: "text-right", children: "ID Propiedad" }), _jsx(Input, { id: "propertyId", name: "propertyId", type: "number", value: formData.propertyId, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "role", className: "text-right", children: "Rol" }), _jsxs(Select, { id: "role", name: "role", value: formData.role, onValueChange: (value) => handleInputChange({ target: { name: 'role', value } }), children: [_jsx(SelectTrigger, { className: "col-span-3 p-2 border rounded-md", children: _jsx(SelectValue, { placeholder: "Seleccionar Rol" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "RESIDENT", children: "Residente" }), _jsx(SelectItem, { value: "OWNER", children: "Propietario" }), _jsx(SelectItem, { value: "TENANT", children: "Inquilino" })] })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Input, { id: "isActive", name: "isActive", type: "checkbox", checked: formData.isActive, onChange: handleCheckboxChange }), _jsx(Label, { htmlFor: "isActive", children: "Activo" })] }), _jsx(DialogFooter, { children: _jsx(Button, { type: "submit", children: currentResident ? 'Guardar Cambios' : 'Añadir Residente' }) })] })] }) })] }));
}
