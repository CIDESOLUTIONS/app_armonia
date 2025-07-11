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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { getDigitalLogs, createDigitalLog, updateDigitalLog, deleteDigitalLog } from '@/services/digitalLogService';
export default function DigitalLogsPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLog, setCurrentLog] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        logDate: new Date().toISOString().slice(0, 16),
    });
    const fetchLogs = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const data = yield getDigitalLogs();
            setLogs(data);
        }
        catch (error) {
            console.error('Error fetching digital logs:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar las minutas digitales.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    }), [toast]);
    useEffect(() => {
        if (!authLoading && user) {
            fetchLogs();
        }
    }, [authLoading, user, fetchLogs]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleAddLog = () => {
        setCurrentLog(null);
        setFormData({
            title: '',
            content: '',
            logDate: new Date().toISOString().slice(0, 16),
        });
        setIsModalOpen(true);
    };
    const handleEditLog = (log) => {
        setCurrentLog(log);
        setFormData({
            title: log.title,
            content: log.content,
            logDate: new Date(log.logDate).toISOString().slice(0, 16),
        });
        setIsModalOpen(true);
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        try {
            if (currentLog) {
                yield updateDigitalLog(currentLog.id, formData);
                toast({
                    title: 'Éxito',
                    description: 'Minuta digital actualizada correctamente.',
                });
            }
            else {
                yield createDigitalLog(formData);
                toast({
                    title: 'Éxito',
                    description: 'Minuta digital creada correctamente.',
                });
            }
            setIsModalOpen(false);
            fetchLogs();
        }
        catch (error) {
            console.error('Error saving digital log:', error);
            toast({
                title: 'Error',
                description: 'Error al guardar la minuta digital.',
                variant: 'destructive',
            });
        }
    });
    const handleDeleteLog = (id) => __awaiter(this, void 0, void 0, function* () {
        if (confirm('¿Estás seguro de que quieres eliminar esta minuta digital?')) {
            try {
                yield deleteDigitalLog(id);
                toast({
                    title: 'Éxito',
                    description: 'Minuta digital eliminada correctamente.',
                });
                fetchLogs();
            }
            catch (error) {
                console.error('Error deleting digital log:', error);
                toast({
                    title: 'Error',
                    description: 'Error al eliminar la minuta digital.',
                    variant: 'destructive',
                });
            }
        }
    });
    if (authLoading || loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    if (!user || (user.role !== 'ADMIN' && user.role !== 'COMPLEX_ADMIN' && user.role !== 'STAFF')) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Acceso Denegado" }), _jsx("p", { className: "text-gray-600", children: "No tienes permisos para acceder a esta p\u00E1gina." })] }) }));
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Gesti\u00F3n de Minutas Digitales" }), _jsx("div", { className: "flex justify-end mb-4", children: _jsxs(Button, { onClick: handleAddLog, children: [_jsx(PlusCircle, { className: "mr-2 h-4 w-4" }), " Crear Minuta"] }) }), _jsx("div", { className: "bg-white shadow-md rounded-lg overflow-hidden", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "T\u00EDtulo" }), _jsx(TableHead, { children: "Fecha" }), _jsx(TableHead, { children: "Creado Por" }), _jsx(TableHead, {})] }) }), _jsx(TableBody, { children: logs.length > 0 ? (logs.map((log) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: log.title }), _jsx(TableCell, { children: new Date(log.logDate).toLocaleString() }), _jsx(TableCell, { children: log.createdByName }), _jsxs(TableCell, { className: "text-right", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleEditLog(log), className: "mr-2", children: _jsx(Edit, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDeleteLog(log.id), children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }, log.id)))) : (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 4, className: "text-center py-5", children: "No hay minutas digitales registradas." }) })) })] }) }), _jsx(Dialog, { open: isModalOpen, onOpenChange: setIsModalOpen, children: _jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: currentLog ? 'Editar Minuta Digital' : 'Crear Nueva Minuta Digital' }) }), _jsxs("form", { onSubmit: handleSubmit, className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "title", className: "text-right", children: "T\u00EDtulo" }), _jsx(Input, { id: "title", name: "title", value: formData.title, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "content", className: "text-right", children: "Contenido" }), _jsx(Textarea, { id: "content", name: "content", value: formData.content, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "logDate", className: "text-right", children: "Fecha y Hora" }), _jsx(Input, { id: "logDate", name: "logDate", type: "datetime-local", value: formData.logDate, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsx(DialogFooter, { children: _jsx(Button, { type: "submit", children: currentLog ? 'Guardar Cambios' : 'Crear Minuta' }) })] })] }) })] }));
}
