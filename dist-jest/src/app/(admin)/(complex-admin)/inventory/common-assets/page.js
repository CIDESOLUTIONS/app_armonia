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
import { getCommonAssets, createCommonAsset, updateCommonAsset, deleteCommonAsset } from '@/services/commonAssetService';
export default function CommonAssetsPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [commonAssets, setCommonAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCommonAsset, setCurrentCommonAsset] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        assetType: '',
        purchaseDate: '',
        value: 0,
        isActive: true,
    });
    const fetchCommonAssets = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const data = yield getCommonAssets();
            setCommonAssets(data);
        }
        catch (error) {
            console.error('Error fetching common assets:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar los bienes comunes.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    }), [toast]);
    useEffect(() => {
        if (!authLoading && user) {
            fetchCommonAssets();
        }
    }, [authLoading, user, fetchCommonAssets]);
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: type === 'number' ? parseFloat(value) : value })));
    };
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: checked })));
    };
    const handleAddCommonAsset = () => {
        setCurrentCommonAsset(null);
        setFormData({
            name: '',
            description: '',
            location: '',
            assetType: '',
            purchaseDate: '',
            value: 0,
            isActive: true,
        });
        setIsModalOpen(true);
    };
    const handleEditCommonAsset = (asset) => {
        setCurrentCommonAsset(asset);
        setFormData({
            name: asset.name,
            description: asset.description || '',
            location: asset.location,
            assetType: asset.assetType,
            purchaseDate: asset.purchaseDate || '',
            value: asset.value || 0,
            isActive: asset.isActive,
        });
        setIsModalOpen(true);
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        try {
            if (currentCommonAsset) {
                yield updateCommonAsset(currentCommonAsset.id, formData);
                toast({
                    title: 'Éxito',
                    description: 'Bien común actualizado correctamente.',
                });
            }
            else {
                yield createCommonAsset(formData);
                toast({
                    title: 'Éxito',
                    description: 'Bien común creado correctamente.',
                });
            }
            setIsModalOpen(false);
            fetchCommonAssets();
        }
        catch (error) {
            console.error('Error saving common asset:', error);
            toast({
                title: 'Error',
                description: 'Error al guardar el bien común.',
                variant: 'destructive',
            });
        }
    });
    const handleDeleteCommonAsset = (id) => __awaiter(this, void 0, void 0, function* () {
        if (confirm('¿Estás seguro de que quieres eliminar este bien común?')) {
            try {
                yield deleteCommonAsset(id);
                toast({
                    title: 'Éxito',
                    description: 'Bien común eliminado correctamente.',
                });
                fetchCommonAssets();
            }
            catch (error) {
                console.error('Error deleting common asset:', error);
                toast({
                    title: 'Error',
                    description: 'Error al eliminar el bien común.',
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
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Gesti\u00F3n de Bienes Comunes" }), _jsx("div", { className: "flex justify-end mb-4", children: _jsxs(Button, { onClick: handleAddCommonAsset, children: [_jsx(PlusCircle, { className: "mr-2 h-4 w-4" }), " A\u00F1adir Bien Com\u00FAn"] }) }), _jsx("div", { className: "bg-white shadow-md rounded-lg overflow-hidden", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Nombre" }), _jsx(TableHead, { children: "Descripci\u00F3n" }), _jsx(TableHead, { children: "Ubicaci\u00F3n" }), _jsx(TableHead, { children: "Tipo de Activo" }), _jsx(TableHead, { children: "Fecha de Compra" }), _jsx(TableHead, { children: "Valor" }), _jsx(TableHead, { children: "Activo" }), _jsx(TableHead, {})] }) }), _jsx(TableBody, { children: commonAssets.map((asset) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: asset.name }), _jsx(TableCell, { children: asset.description }), _jsx(TableCell, { children: asset.location }), _jsx(TableCell, { children: asset.assetType }), _jsx(TableCell, { children: asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : 'N/A' }), _jsx(TableCell, { children: asset.value }), _jsx(TableCell, { children: asset.isActive ? _jsx(Badge, { variant: "default", children: "S\u00ED" }) : _jsx(Badge, { variant: "destructive", children: "No" }) }), _jsxs(TableCell, { className: "text-right", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleEditCommonAsset(asset), className: "mr-2", children: _jsx(Edit, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDeleteCommonAsset(asset.id), children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }, asset.id))) })] }) }), _jsx(Dialog, { open: isModalOpen, onOpenChange: setIsModalOpen, children: _jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: currentCommonAsset ? 'Editar Bien Común' : 'Añadir Nuevo Bien Común' }) }), _jsxs("form", { onSubmit: handleSubmit, className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "name", className: "text-right", children: "Nombre" }), _jsx(Input, { id: "name", name: "name", value: formData.name, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "description", className: "text-right", children: "Descripci\u00F3n" }), _jsx(Input, { id: "description", name: "description", value: formData.description, onChange: handleInputChange, className: "col-span-3" })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "location", className: "text-right", children: "Ubicaci\u00F3n" }), _jsx(Input, { id: "location", name: "location", value: formData.location, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "assetType", className: "text-right", children: "Tipo de Activo" }), _jsx(Input, { id: "assetType", name: "assetType", value: formData.assetType, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "purchaseDate", className: "text-right", children: "Fecha de Compra" }), _jsx(Input, { id: "purchaseDate", name: "purchaseDate", type: "date", value: formData.purchaseDate, onChange: handleInputChange, className: "col-span-3" })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "value", className: "text-right", children: "Valor" }), _jsx(Input, { id: "value", name: "value", type: "number", value: formData.value, onChange: handleInputChange, className: "col-span-3" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Input, { id: "isActive", name: "isActive", type: "checkbox", checked: formData.isActive, onChange: handleCheckboxChange }), _jsx(Label, { htmlFor: "isActive", children: "Activo" })] }), _jsx(DialogFooter, { children: _jsx(Button, { type: "submit", children: currentCommonAsset ? 'Guardar Cambios' : 'Añadir Bien Común' }) })] })] }) })] }));
}
