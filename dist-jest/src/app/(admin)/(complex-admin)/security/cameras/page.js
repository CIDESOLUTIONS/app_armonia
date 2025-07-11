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
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { getCameras, createCamera, updateCamera, deleteCamera } from '@/services/cameraService';
export default function CamerasPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [cameras, setCameras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCamera, setCurrentCamera] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        ipAddress: '',
        port: 80,
        username: '',
        password: '',
        location: '',
        isActive: true,
    });
    const fetchCameras = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const data = yield getCameras();
            setCameras(data);
        }
        catch (error) {
            console.error('Error fetching cameras:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar las cámaras.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    }), [toast]);
    useEffect(() => {
        if (!authLoading && user) {
            fetchCameras();
        }
    }, [authLoading, user, fetchCameras]);
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: type === 'checkbox' ? e.target.checked : value })));
    };
    const handleAddCamera = () => {
        setCurrentCamera(null);
        setFormData({
            name: '',
            ipAddress: '',
            port: 80,
            username: '',
            password: '',
            location: '',
            isActive: true,
        });
        setIsModalOpen(true);
    };
    const handleEditCamera = (camera) => {
        setCurrentCamera(camera);
        setFormData({
            name: camera.name,
            ipAddress: camera.ipAddress,
            port: camera.port,
            username: camera.username || '',
            password: camera.password || '',
            location: camera.location,
            isActive: camera.isActive,
        });
        setIsModalOpen(true);
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        try {
            if (currentCamera) {
                yield updateCamera(currentCamera.id, formData);
                toast({
                    title: 'Éxito',
                    description: 'Cámara actualizada correctamente.',
                });
            }
            else {
                yield createCamera(formData);
                toast({
                    title: 'Éxito',
                    description: 'Cámara creada correctamente.',
                });
            }
            setIsModalOpen(false);
            fetchCameras();
        }
        catch (error) {
            console.error('Error saving camera:', error);
            toast({
                title: 'Error',
                description: 'Error al guardar la cámara.',
                variant: 'destructive',
            });
        }
    });
    const handleDeleteCamera = (id) => __awaiter(this, void 0, void 0, function* () {
        if (confirm('¿Estás seguro de que quieres eliminar esta cámara?')) {
            try {
                yield deleteCamera(id);
                toast({
                    title: 'Éxito',
                    description: 'Cámara eliminada correctamente.',
                });
                fetchCameras();
            }
            catch (error) {
                console.error('Error deleting camera:', error);
                toast({
                    title: 'Error',
                    description: 'Error al eliminar la cámara.',
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
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Gesti\u00F3n de C\u00E1maras IP" }), _jsx("div", { className: "flex justify-end mb-4", children: _jsxs(Button, { onClick: handleAddCamera, children: [_jsx(PlusCircle, { className: "mr-2 h-4 w-4" }), " A\u00F1adir C\u00E1mara"] }) }), _jsx("div", { className: "bg-white shadow-md rounded-lg overflow-hidden", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Nombre" }), _jsx(TableHead, { children: "Direcci\u00F3n IP" }), _jsx(TableHead, { children: "Puerto" }), _jsx(TableHead, { children: "Ubicaci\u00F3n" }), _jsx(TableHead, { children: "Activa" }), _jsx(TableHead, {})] }) }), _jsx(TableBody, { children: cameras.length > 0 ? (cameras.map((camera) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: camera.name }), _jsx(TableCell, { children: camera.ipAddress }), _jsx(TableCell, { children: camera.port }), _jsx(TableCell, { children: camera.location }), _jsx(TableCell, { children: camera.isActive ? _jsx(Badge, { variant: "default", children: "S\u00ED" }) : _jsx(Badge, { variant: "destructive", children: "No" }) }), _jsxs(TableCell, { className: "text-right", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleEditCamera(camera), className: "mr-2", children: _jsx(Edit, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDeleteCamera(camera.id), children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }, camera.id)))) : (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 6, className: "text-center py-5", children: "No hay c\u00E1maras registradas." }) })) })] }) }), _jsx(Dialog, { open: isModalOpen, onOpenChange: setIsModalOpen, children: _jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: currentCamera ? 'Editar Cámara' : 'Añadir Nueva Cámara' }) }), _jsxs("form", { onSubmit: handleSubmit, className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "name", className: "text-right", children: "Nombre" }), _jsx(Input, { id: "name", name: "name", value: formData.name, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "ipAddress", className: "text-right", children: "Direcci\u00F3n IP" }), _jsx(Input, { id: "ipAddress", name: "ipAddress", value: formData.ipAddress, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "port", className: "text-right", children: "Puerto" }), _jsx(Input, { id: "port", name: "port", type: "number", value: formData.port, onChange: handleInputChange, className: "col-span-3" })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "username", className: "text-right", children: "Usuario" }), _jsx(Input, { id: "username", name: "username", value: formData.username, onChange: handleInputChange, className: "col-span-3" })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "password", className: "text-right", children: "Contrase\u00F1a" }), _jsx(Input, { id: "password", name: "password", type: "password", value: formData.password, onChange: handleInputChange, className: "col-span-3" })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "location", className: "text-right", children: "Ubicaci\u00F3n" }), _jsx(Input, { id: "location", name: "location", value: formData.location, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "isActive", name: "isActive", checked: formData.isActive, onCheckedChange: (checked) => handleInputChange({ target: { name: 'isActive', value: checked } }) }), _jsx(Label, { htmlFor: "isActive", children: "Activa" })] }), _jsx(DialogFooter, { children: _jsx(Button, { type: "submit", children: currentCamera ? 'Guardar Cambios' : 'Añadir Cámara' }) })] })] }) })] }));
}
