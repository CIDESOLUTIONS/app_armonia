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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '@/services/announcementService';
export default function AnnouncementsPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        publishedAt: '',
        expiresAt: '',
        isActive: true,
        targetRoles: [],
    });
    const fetchAnnouncements = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const data = yield getAnnouncements();
            setAnnouncements(data);
        }
        catch (error) {
            console.error('Error fetching announcements:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar los anuncios.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    }), [toast]);
    useEffect(() => {
        if (!authLoading && user) {
            fetchAnnouncements();
        }
    }, [authLoading, user, fetchAnnouncements]);
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: type === 'checkbox' ? e.target.checked : value })));
    };
    const handleRoleChange = (role, isChecked) => {
        setFormData(prev => {
            const newRoles = isChecked
                ? [...prev.targetRoles, role]
                : prev.targetRoles.filter(r => r !== role);
            return Object.assign(Object.assign({}, prev), { targetRoles: newRoles });
        });
    };
    const handleAddAnnouncement = () => {
        setCurrentAnnouncement(null);
        setFormData({
            title: '',
            content: '',
            publishedAt: new Date().toISOString().slice(0, 16),
            expiresAt: '',
            isActive: true,
            targetRoles: [],
        });
        setIsModalOpen(true);
    };
    const handleEditAnnouncement = (announcement) => {
        setCurrentAnnouncement(announcement);
        setFormData({
            title: announcement.title,
            content: announcement.content,
            publishedAt: new Date(announcement.publishedAt).toISOString().slice(0, 16),
            expiresAt: announcement.expiresAt ? new Date(announcement.expiresAt).toISOString().slice(0, 16) : '',
            isActive: announcement.isActive,
            targetRoles: announcement.targetRoles,
        });
        setIsModalOpen(true);
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        try {
            if (currentAnnouncement) {
                yield updateAnnouncement(currentAnnouncement.id, formData);
                toast({
                    title: 'Éxito',
                    description: 'Anuncio actualizado correctamente.',
                });
            }
            else {
                yield createAnnouncement(formData);
                toast({
                    title: 'Éxito',
                    description: 'Anuncio creado correctamente.',
                });
            }
            setIsModalOpen(false);
            fetchAnnouncements();
        }
        catch (error) {
            console.error('Error saving announcement:', error);
            toast({
                title: 'Error',
                description: 'Error al guardar el anuncio.',
                variant: 'destructive',
            });
        }
    });
    const handleDeleteAnnouncement = (id) => __awaiter(this, void 0, void 0, function* () {
        if (confirm('¿Estás seguro de que quieres eliminar este anuncio?')) {
            try {
                yield deleteAnnouncement(id);
                toast({
                    title: 'Éxito',
                    description: 'Anuncio eliminado correctamente.',
                });
                fetchAnnouncements();
            }
            catch (error) {
                console.error('Error deleting announcement:', error);
                toast({
                    title: 'Error',
                    description: 'Error al eliminar el anuncio.',
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
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Gesti\u00F3n de Anuncios" }), _jsx("div", { className: "flex justify-end mb-4", children: _jsxs(Button, { onClick: handleAddAnnouncement, children: [_jsx(PlusCircle, { className: "mr-2 h-4 w-4" }), " Crear Anuncio"] }) }), _jsx("div", { className: "bg-white shadow-md rounded-lg overflow-hidden", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "T\u00EDtulo" }), _jsx(TableHead, { children: "Publicado" }), _jsx(TableHead, { children: "Expira" }), _jsx(TableHead, { children: "Activo" }), _jsx(TableHead, { children: "Roles Objetivo" }), _jsx(TableHead, {})] }) }), _jsx(TableBody, { children: announcements.length > 0 ? (announcements.map((announcement) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: announcement.title }), _jsx(TableCell, { children: new Date(announcement.publishedAt).toLocaleDateString() }), _jsx(TableCell, { children: announcement.expiresAt ? new Date(announcement.expiresAt).toLocaleDateString() : 'N/A' }), _jsx(TableCell, { children: announcement.isActive ? _jsx(Badge, { variant: "default", children: "S\u00ED" }) : _jsx(Badge, { variant: "destructive", children: "No" }) }), _jsx(TableCell, { children: announcement.targetRoles.join(', ') }), _jsxs(TableCell, { className: "text-right", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleEditAnnouncement(announcement), className: "mr-2", children: _jsx(Edit, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDeleteAnnouncement(announcement.id), children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }, announcement.id)))) : (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 6, className: "text-center py-5", children: "No hay anuncios registrados." }) })) })] }) }), _jsx(Dialog, { open: isModalOpen, onOpenChange: setIsModalOpen, children: _jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: currentAnnouncement ? 'Editar Anuncio' : 'Crear Nuevo Anuncio' }) }), _jsxs("form", { onSubmit: handleSubmit, className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "title", className: "text-right", children: "T\u00EDtulo" }), _jsx(Input, { id: "title", name: "title", value: formData.title, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "content", className: "text-right", children: "Contenido" }), _jsx(Textarea, { id: "content", name: "content", value: formData.content, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "publishedAt", className: "text-right", children: "Fecha Publicaci\u00F3n" }), _jsx(Input, { id: "publishedAt", name: "publishedAt", type: "datetime-local", value: formData.publishedAt, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "expiresAt", className: "text-right", children: "Fecha Expiraci\u00F3n" }), _jsx(Input, { id: "expiresAt", name: "expiresAt", type: "datetime-local", value: formData.expiresAt, onChange: handleInputChange, className: "col-span-3" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "isActive", name: "isActive", checked: formData.isActive, onCheckedChange: (checked) => handleInputChange({ target: { name: 'isActive', value: checked } }) }), _jsx(Label, { htmlFor: "isActive", children: "Activo" })] }), _jsxs("div", { className: "grid gap-2 col-span-full", children: [_jsx(Label, { children: "Roles Objetivo" }), _jsx("div", { className: "flex flex-wrap gap-2", children: ['ADMIN', 'COMPLEX_ADMIN', 'RESIDENT', 'STAFF'].map(role => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: `role-${role}`, checked: formData.targetRoles.includes(role), onCheckedChange: (checked) => handleRoleChange(role, checked) }), _jsx(Label, { htmlFor: `role-${role}`, children: role })] }, role))) })] }), _jsx(DialogFooter, { children: _jsx(Button, { type: "submit", children: currentAnnouncement ? 'Guardar Cambios' : 'Crear Anuncio' }) })] })] }) })] }));
}
