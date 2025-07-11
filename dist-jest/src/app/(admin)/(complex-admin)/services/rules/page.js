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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getReservationRules, createReservationRule, updateReservationRule, deleteReservationRule } from '@/services/reservationRuleService';
export default function ReservationRulesPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRule, setCurrentRule] = useState(null);
    const [formData, setFormData] = useState({
        commonAreaId: 0,
        name: '',
        description: '',
        maxDurationHours: 0,
        minDurationHours: 0,
        maxAdvanceDays: 0,
        minAdvanceDays: 0,
        maxReservationsPerMonth: 0,
        maxReservationsPerWeek: 0,
        maxConcurrentReservations: 0,
        allowCancellation: false,
        cancellationHours: 0,
        isActive: true,
    });
    const fetchRules = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const data = yield getReservationRules();
            setRules(data);
        }
        catch (error) {
            console.error('Error fetching reservation rules:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar las reglas de reserva.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    }), [toast]);
    useEffect(() => {
        if (!authLoading && user) {
            fetchRules();
        }
    }, [authLoading, user, fetchRules]);
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: type === 'number' ? parseFloat(value) : value })));
    };
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: checked })));
    };
    const handleAddRule = () => {
        setCurrentRule(null);
        setFormData({
            commonAreaId: 0,
            name: '',
            description: '',
            maxDurationHours: 0,
            minDurationHours: 0,
            maxAdvanceDays: 0,
            minAdvanceDays: 0,
            maxReservationsPerMonth: 0,
            maxReservationsPerWeek: 0,
            maxConcurrentReservations: 0,
            allowCancellation: false,
            cancellationHours: 0,
            isActive: true,
        });
        setIsModalOpen(true);
    };
    const handleEditRule = (rule) => {
        setCurrentRule(rule);
        setFormData({
            commonAreaId: rule.commonAreaId,
            name: rule.name,
            description: rule.description,
            maxDurationHours: rule.maxDurationHours,
            minDurationHours: rule.minDurationHours,
            maxAdvanceDays: rule.maxAdvanceDays,
            minAdvanceDays: rule.minAdvanceDays,
            maxReservationsPerMonth: rule.maxReservationsPerMonth,
            maxReservationsPerWeek: rule.maxReservationsPerWeek,
            maxConcurrentReservations: rule.maxConcurrentReservations,
            allowCancellation: rule.allowCancellation,
            cancellationHours: rule.cancellationHours,
            isActive: rule.isActive,
        });
        setIsModalOpen(true);
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        try {
            if (currentRule) {
                yield updateReservationRule(currentRule.id, formData);
                toast({
                    title: 'Éxito',
                    description: 'Regla de reserva actualizada correctamente.',
                });
            }
            else {
                yield createReservationRule(formData);
                toast({
                    title: 'Éxito',
                    description: 'Regla de reserva creada correctamente.',
                });
            }
            setIsModalOpen(false);
            fetchRules();
        }
        catch (error) {
            console.error('Error saving reservation rule:', error);
            toast({
                title: 'Error',
                description: 'Error al guardar la regla de reserva.',
                variant: 'destructive',
            });
        }
    });
    const handleDeleteRule = (id) => __awaiter(this, void 0, void 0, function* () {
        if (confirm('¿Estás seguro de que quieres eliminar esta regla de reserva?')) {
            try {
                yield deleteReservationRule(id);
                toast({
                    title: 'Éxito',
                    description: 'Regla de reserva eliminada correctamente.',
                });
                fetchRules();
            }
            catch (error) {
                console.error('Error deleting reservation rule:', error);
                toast({
                    title: 'Error',
                    description: 'Error al eliminar la regla de reserva.',
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
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Gesti\u00F3n de Reglas de Reserva" }), _jsx("div", { className: "flex justify-end mb-4", children: _jsxs(Button, { onClick: handleAddRule, children: [_jsx(PlusCircle, { className: "mr-2 h-4 w-4" }), " A\u00F1adir Regla de Reserva"] }) }), _jsx("div", { className: "bg-white shadow-md rounded-lg overflow-hidden", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Nombre" }), _jsx(TableHead, { children: "\u00C1rea Com\u00FAn" }), _jsx(TableHead, { children: "Duraci\u00F3n M\u00E1x. (horas)" }), _jsx(TableHead, { children: "Anticipaci\u00F3n M\u00EDn. (d\u00EDas)" }), _jsx(TableHead, { children: "Activa" }), _jsx(TableHead, {})] }) }), _jsx(TableBody, { children: rules.map((rule) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: rule.name }), _jsx(TableCell, { children: rule.commonAreaName }), _jsx(TableCell, { children: rule.maxDurationHours }), _jsx(TableCell, { children: rule.minAdvanceDays }), _jsx(TableCell, { children: rule.isActive ? _jsx(Badge, { variant: "default", children: "S\u00ED" }) : _jsx(Badge, { variant: "destructive", children: "No" }) }), _jsxs(TableCell, { className: "text-right", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleEditRule(rule), className: "mr-2", children: _jsx(Edit, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDeleteRule(rule.id), children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }, rule.id))) })] }) }), _jsx(Dialog, { open: isModalOpen, onOpenChange: setIsModalOpen, children: _jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: currentRule ? 'Editar Regla de Reserva' : 'Añadir Nueva Regla de Reserva' }) }), _jsxs("form", { onSubmit: handleSubmit, className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "commonAreaId", className: "text-right", children: "ID \u00C1rea Com\u00FAn" }), _jsx(Input, { id: "commonAreaId", name: "commonAreaId", type: "number", value: formData.commonAreaId, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "name", className: "text-right", children: "Nombre" }), _jsx(Input, { id: "name", name: "name", value: formData.name, onChange: handleInputChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "description", className: "text-right", children: "Descripci\u00F3n" }), _jsx(Textarea, { id: "description", name: "description", value: formData.description, onChange: handleInputChange, className: "col-span-3" })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "maxDurationHours", className: "text-right", children: "Duraci\u00F3n M\u00E1x. (horas)" }), _jsx(Input, { id: "maxDurationHours", name: "maxDurationHours", type: "number", value: formData.maxDurationHours, onChange: handleInputChange, className: "col-span-3" })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "minDurationHours", className: "text-right", children: "Duraci\u00F3n M\u00EDn. (horas)" }), _jsx(Input, { id: "minDurationHours", name: "minDurationHours", type: "number", value: formData.minDurationHours, onChange: handleInputChange, className: "col-span-3" })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "maxAdvanceDays", className: "text-right", children: "Anticipaci\u00F3n M\u00E1x. (d\u00EDas)" }), _jsx(Input, { id: "maxAdvanceDays", name: "maxAdvanceDays", type: "number", value: formData.maxAdvanceDays, onChange: handleInputChange, className: "col-span-3" })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "minAdvanceDays", className: "text-right", children: "Anticipaci\u00F3n M\u00EDn. (d\u00EDas)" }), _jsx(Input, { id: "minAdvanceDays", name: "minAdvanceDays", type: "number", value: formData.minAdvanceDays, onChange: handleInputChange, className: "col-span-3" })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "maxReservationsPerMonth", className: "text-right", children: "M\u00E1x. Reservas/Mes" }), _jsx(Input, { id: "maxReservationsPerMonth", name: "maxReservationsPerMonth", type: "number", value: formData.maxReservationsPerMonth, onChange: handleInputChange, className: "col-span-3" })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "maxReservationsPerWeek", className: "text-right", children: "M\u00E1x. Reservas/Semana" }), _jsx(Input, { id: "maxReservationsPerWeek", name: "maxReservationsPerWeek", type: "number", value: formData.maxReservationsPerWeek, onChange: handleInputChange, className: "col-span-3" })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "maxConcurrentReservations", className: "text-right", children: "M\u00E1x. Reservas Concurrentes" }), _jsx(Input, { id: "maxConcurrentReservations", name: "maxConcurrentReservations", type: "number", value: formData.maxConcurrentReservations, onChange: handleInputChange, className: "col-span-3" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "allowCancellation", name: "allowCancellation", checked: formData.allowCancellation, onCheckedChange: (checked) => handleCheckboxChange({ target: { name: 'allowCancellation', checked: checked } }) }), _jsx(Label, { htmlFor: "allowCancellation", children: "Permitir Cancelaci\u00F3n" })] }), formData.allowCancellation && (_jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "cancellationHours", className: "text-right", children: "Horas para Cancelar" }), _jsx(Input, { id: "cancellationHours", name: "cancellationHours", type: "number", value: formData.cancellationHours, onChange: handleInputChange, className: "col-span-3" })] })), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "isActive", name: "isActive", checked: formData.isActive, onCheckedChange: (checked) => handleCheckboxChange({ target: { name: 'isActive', checked: checked } }) }), _jsx(Label, { htmlFor: "isActive", children: "Activa" })] }), _jsx(DialogFooter, { children: _jsx(Button, { type: "submit", children: currentRule ? 'Guardar Cambios' : 'Añadir Regla de Reserva' }) })] })] }) })] }));
}
