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
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
export default function ModulesPermissionsPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [modules, setModules] = useState([
        // Mock data
        {
            id: 'inventory',
            name: 'Gestión de Inventario',
            description: 'Permite administrar propiedades, residentes, vehículos y mascotas.',
            enabled: true,
            permissions: [
                { role: 'ADMIN', canView: true, canEdit: true },
                { role: 'COMPLEX_ADMIN', canView: true, canEdit: true },
                { role: 'STAFF', canView: true, canEdit: false },
                { role: 'RESIDENT', canView: false, canEdit: false },
            ],
        },
        {
            id: 'finances',
            name: 'Gestión Financiera',
            description: 'Control de ingresos, egresos, presupuestos y cuotas.',
            enabled: true,
            permissions: [
                { role: 'ADMIN', canView: true, canEdit: true },
                { role: 'COMPLEX_ADMIN', canView: true, canEdit: true },
                { role: 'STAFF', canView: false, canEdit: false },
                { role: 'RESIDENT', canView: true, canEdit: false },
            ],
        },
        {
            id: 'assemblies',
            name: 'Gestión de Asambleas',
            description: 'Programación, votaciones y actas de asambleas.',
            enabled: true,
            permissions: [
                { role: 'ADMIN', canView: true, canEdit: true },
                { role: 'COMPLEX_ADMIN', canView: true, canEdit: true },
                { role: 'STAFF', canView: true, canEdit: false },
                { role: 'RESIDENT', canView: true, canEdit: false },
            ],
        },
    ]);
    const [loading, setLoading] = useState(false);
    const handleToggleModule = (moduleId, enabled) => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            // Placeholder for API call to update module status
            console.log(`Module ${moduleId} toggled to ${enabled}`);
            yield new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
            setModules(prev => prev.map(mod => mod.id === moduleId ? Object.assign(Object.assign({}, mod), { enabled }) : mod));
            toast({
                title: 'Éxito',
                description: 'Configuración de módulo actualizada (simulado).',
            });
        }
        catch (error) {
            console.error('Error toggling module:', error);
            toast({
                title: 'Error',
                description: 'Error al actualizar el módulo.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    });
    const handlePermissionChange = (moduleId, role, type, value) => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            // Placeholder for API call to update permissions
            console.log(`Module ${moduleId}, role ${role}, ${type} set to ${value}`);
            yield new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
            setModules(prev => prev.map(mod => mod.id === moduleId
                ? Object.assign(Object.assign({}, mod), { permissions: mod.permissions.map(p => p.role === role ? Object.assign(Object.assign({}, p), { [type]: value }) : p) }) : mod));
            toast({
                title: 'Éxito',
                description: 'Permisos actualizados (simulado).',
            });
        }
        catch (error) {
            console.error('Error updating permissions:', error);
            toast({
                title: 'Error',
                description: 'Error al actualizar permisos.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    });
    if (authLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    if (!user || (user.role !== 'ADMIN' && user.role !== 'COMPLEX_ADMIN')) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Acceso Denegado" }), _jsx("p", { className: "text-gray-600", children: "No tienes permisos para acceder a esta p\u00E1gina." })] }) }));
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Configuraci\u00F3n de M\u00F3dulos y Permisos" }), _jsxs("div", { className: "bg-white shadow-md rounded-lg p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "M\u00F3dulos del Sistema" }), _jsx("div", { className: "space-y-6", children: modules.map(module => (_jsxs("div", { className: "border rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h3", { className: "text-lg font-semibold", children: module.name }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Label, { htmlFor: `toggle-${module.id}`, children: "Activar" }), _jsx(Switch, { id: `toggle-${module.id}`, checked: module.enabled, onCheckedChange: (checked) => handleToggleModule(module.id, checked), disabled: loading })] })] }), _jsx("p", { className: "text-gray-600 text-sm mb-4", children: module.description }), _jsx("h4", { className: "text-md font-semibold mb-2", children: "Permisos por Rol:" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: module.permissions.map(perm => (_jsxs("div", { className: "flex items-center justify-between bg-gray-50 p-3 rounded-md", children: [_jsx("span", { className: "font-medium", children: perm.role }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Label, { htmlFor: `view-${module.id}-${perm.role}`, children: "Ver" }), _jsx(Switch, { id: `view-${module.id}-${perm.role}`, checked: perm.canView, onCheckedChange: (checked) => handlePermissionChange(module.id, perm.role, 'canView', checked), disabled: loading })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Label, { htmlFor: `edit-${module.id}-${perm.role}`, children: "Editar" }), _jsx(Switch, { id: `edit-${module.id}-${perm.role}`, checked: perm.canEdit, onCheckedChange: (checked) => handlePermissionChange(module.id, perm.role, 'canEdit', checked), disabled: loading })] })] })] }, perm.role))) })] }, module.id))) })] })] }));
}
