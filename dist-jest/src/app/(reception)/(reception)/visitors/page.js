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
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { UserPlus, LogOut, Search, Camera, IdCard, User, AlertCircle, CheckCircle, X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Image from 'next/image';
export default function ReceptionVisitorsPage() {
    const { isLoggedIn, token: _token, schemaName } = useAuthStore();
    const _router = useRouter();
    const [loading, setLoading] = useState(true);
    const [visitors, setVisitors] = useState([]);
    const [error, _setError] = useState(null);
    const [_searchTerm, _setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('active');
    const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
    const [newVisitorForm, setNewVisitorForm] = useState({
        name: '',
        documentType: 'cc',
        documentNumber: '',
        destination: '',
        residentName: '',
        plate: '',
        photo: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    // Datos de ejemplo para desarrollo y pruebas
    const mockVisitors = useMemo(() => [
        {
            id: "vis1",
            name: "Carlos Ramírez",
            documentType: 'cc',
            documentNumber: "123456789",
            destination: "Apartamento 502",
            residentName: "Ana López",
            entryTime: "2025-05-29T10:15:00",
            plate: "XYZ-123",
            photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
            status: 'active'
        },
        {
            id: "vis2",
            name: "María Fernández",
            documentType: 'ce',
            documentNumber: "987654321",
            destination: "Oficina 301 (Administración)",
            entryTime: "2025-05-29T09:30:00",
            exitTime: "2025-05-29T11:00:00",
            status: 'departed'
        },
        {
            id: "vis3",
            name: "Pedro Gómez",
            documentType: 'cc',
            documentNumber: "112233445",
            destination: "Apartamento 101",
            residentName: "Luis Martínez",
            entryTime: "2025-05-29T11:45:00",
            status: 'active'
        }
    ], []);
    const fetchData = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            _setError(null);
            // En un entorno real, esto sería una llamada a la API
            // const response = await fetch('/api/visitors');
            // const result = await response.json();
            // if (!response.ok) throw new Error(result.message || 'Error al cargar datos');
            // setVisitors(result.visitors);
            // Simulamos un retraso en la carga de datos
            setTimeout(() => {
                setVisitors(mockVisitors);
                setLoading(false);
            }, 1000);
        }
        catch (err) {
            console.error("[ReceptionVisitors] Error:", err);
            _setError(err.message || 'Error al cargar datos de visitantes');
            setLoading(false);
        }
    }), [mockVisitors, _setError, setVisitors, setLoading]);
    useEffect(() => {
        if (!isLoggedIn || !_token || !schemaName) {
            _router.push('/login');
            return;
        }
        fetchData();
    }, [isLoggedIn, _token, schemaName, _router, fetchData]);
    // Función para formatear fechas
    const formatDate = (dateString) => {
        if (!dateString)
            return 'N/A';
        return format(new Date(dateString), "d MMM yyyy, HH:mm", { locale: es });
    };
    // Función para obtener el texto del tipo de documento
    const getDocumentTypeText = (type) => {
        switch (type) {
            case 'cc': return 'Cédula de Ciudadanía';
            case 'ce': return 'Cédula de Extranjería';
            case 'passport': return 'Pasaporte';
            case 'other': return 'Otro';
            default: return 'Desconocido';
        }
    };
    // Filtrar visitantes según los filtros aplicados
    const getFilteredVisitors = () => {
        if (!visitors)
            return [];
        let filtered = visitors;
        // Filtrar por estado
        if (statusFilter !== 'all') {
            filtered = filtered.filter(visitor => visitor.status === statusFilter);
        }
        // Filtrar por término de búsqueda
        if (searchTerm) {
            filtered = filtered.filter(visitor => visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                visitor.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                visitor.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (visitor.residentName && visitor.residentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (visitor.plate && visitor.plate.toLowerCase().includes(searchTerm.toLowerCase())));
        }
        return filtered;
    };
    // Función para manejar cambios en el formulario de registro
    const handleNewVisitorFormChange = (field, value) => {
        setNewVisitorForm(prev => (Object.assign(Object.assign({}, prev), { [field]: value })));
    };
    // Función para manejar la captura de foto (simulada)
    const handleTakePhoto = () => {
        // En un entorno real, esto activaría la cámara
        alert('Funcionalidad de cámara no implementada en esta demo');
    };
    // Función para manejar la subida de foto
    const handlePhotoUpload = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleNewVisitorFormChange('photo', e.target.files[0]);
        }
    };
    // Función para registrar un nuevo visitante
    const handleSubmitNewVisitor = () => __awaiter(this, void 0, void 0, function* () {
        if (!newVisitorForm.name || !newVisitorForm.documentNumber || !newVisitorForm.destination) {
            alert('Por favor complete todos los campos obligatorios');
            return;
        }
        setIsSubmitting(true);
        try {
            // En un entorno real, esto sería una llamada a la API
            // const formData = new FormData();
            // formData.append('name', newVisitorForm.name);
            // formData.append('documentType', newVisitorForm.documentType);
            // formData.append('documentNumber', newVisitorForm.documentNumber);
            // formData.append('destination', newVisitorForm.destination);
            // if (newVisitorForm.residentName) formData.append('residentName', newVisitorForm.residentName);
            // if (newVisitorForm.plate) formData.append('plate', newVisitorForm.plate);
            // if (newVisitorForm.photo) formData.append('photo', newVisitorForm.photo);
            // // Variable response eliminada por lint
            // if (!response.ok) {
            //   throw new Error('Error al registrar visitante');
            // }
            // Simulamos un retraso en el envío
            yield new Promise(resolve => setTimeout(resolve, 1000));
            // Simulamos una respuesta exitosa
            const newVisitor = {
                id: `vis${Date.now()}`,
                name: newVisitorForm.name,
                documentType: newVisitorForm.documentType,
                documentNumber: newVisitorForm.documentNumber,
                destination: newVisitorForm.destination,
                residentName: newVisitorForm.residentName,
                entryTime: new Date().toISOString(),
                plate: newVisitorForm.plate,
                photoUrl: newVisitorForm.photo ? URL.createObjectURL(newVisitorForm.photo) : undefined,
                status: 'active'
            };
            setVisitors(prev => [newVisitor, ...prev]);
            setSuccessMessage('Visitante registrado exitosamente.');
            setIsRegisterDialogOpen(false);
            // Resetear formulario
            setNewVisitorForm({
                name: '',
                documentType: 'cc',
                documentNumber: '',
                destination: '',
                residentName: '',
                plate: '',
                photo: null
            });
        }
        catch (err) {
            console.error("[ReceptionVisitors] Error:", err);
            setError('Error al registrar el visitante. Por favor, inténtelo de nuevo.');
        }
        finally {
            setIsSubmitting(false);
        }
    });
    // Función para registrar la salida de un visitante
    const handleRegisterExit = (visitorId) => __awaiter(this, void 0, void 0, function* () {
        if (!confirm('¿Está seguro de que desea registrar la salida de este visitante?')) {
            return;
        }
        try {
            // En un entorno real, esto sería una llamada a la API
            // // Variable response eliminada por lint
            // if (!response.ok) {
            //   throw new Error('Error al registrar salida');
            // }
            // Simulamos un retraso
            yield new Promise(resolve => setTimeout(resolve, 500));
            // Actualizamos el estado local
            setVisitors(prev => prev.map(vis => vis.id === visitorId
                ? Object.assign(Object.assign({}, vis), { status: 'departed', exitTime: new Date().toISOString() }) : vis));
            setSuccessMessage('Salida registrada exitosamente.');
        }
        catch (err) {
            console.error("[ReceptionVisitors] Error:", err);
            setError('Error al registrar la salida. Por favor, inténtelo de nuevo.');
        }
    });
    // Renderizado de estado de carga
    if (loading) {
        return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx(Skeleton, { className: "h-8 w-64 mb-2" }), _jsx(Skeleton, { className: "h-4 w-40" })] }), _jsx(Skeleton, { className: "h-10 w-40" })] }), _jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx(Skeleton, { className: "h-10 w-64" }), _jsx(Skeleton, { className: "h-10 w-32" })] }), _jsx(Skeleton, { className: "h-96 w-full rounded-lg" })] }));
    }
    // Renderizado de estado de error
    if (error) {
        return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsxs(Alert, { variant: "destructive", children: [_jsx(AlertCircle, { className: "h-4 w-4" }), _jsx(AlertTitle, { children: "Error" }), _jsx(AlertDescription, { children: error })] }), _jsx(Button, { className: "mt-4", onClick: () => window.location.reload(), children: "Reintentar" })] }));
    }
    const filteredVisitors = getFilteredVisitors();
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", children: "Registro de Visitantes" }), _jsx("p", { className: "text-gray-500", children: "Gestione el ingreso y salida de visitantes" })] }), _jsxs(Button, { className: "mt-2 md:mt-0", onClick: () => setIsRegisterDialogOpen(true), children: [_jsx(UserPlus, { className: "mr-2 h-4 w-4" }), "Registrar Nuevo Visitante"] })] }), successMessage && (_jsxs(Alert, { className: "mb-6 bg-green-50 border-green-200", children: [_jsx(CheckCircle, { className: "h-4 w-4 text-green-600" }), _jsx(AlertTitle, { className: "text-green-600", children: "\u00C9xito" }), _jsx(AlertDescription, { className: "text-green-700", children: successMessage }), _jsx(Button, { variant: "ghost", size: "sm", className: "ml-auto text-green-600", onClick: () => setSuccessMessage(null), children: "Cerrar" })] })), _jsx(Card, { className: "mb-6", children: _jsxs(CardContent, { className: "p-4 flex flex-col md:flex-row gap-4", children: [_jsxs("div", { className: "relative flex-grow", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx(Input, { placeholder: "Buscar por nombre, documento, destino, residente o placa...", className: "pl-10", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })] }), _jsxs(Select, { value: statusFilter, onValueChange: (value) => setStatusFilter(value), children: [_jsx(SelectTrigger, { className: "w-full md:w-48", children: _jsx(SelectValue, { placeholder: "Filtrar por estado" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "Todos" }), _jsx(SelectItem, { value: "active", children: "Activos" }), _jsx(SelectItem, { value: "departed", children: "Salieron" })] })] })] }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-0", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Foto" }), _jsx(TableHead, { children: "Nombre" }), _jsx(TableHead, { children: "Documento" }), _jsx(TableHead, { children: "Destino" }), _jsx(TableHead, { children: "Residente" }), _jsx(TableHead, { children: "Placa" }), _jsx(TableHead, { children: "Hora Entrada" }), _jsx(TableHead, { children: "Hora Salida" }), _jsx(TableHead, { children: "Estado" }), _jsx(TableHead, { className: "text-right", children: "Acciones" })] }) }), _jsx(TableBody, { children: filteredVisitors.length > 0 ? (filteredVisitors.map((visitor) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: visitor.photoUrl ? (_jsx(Image, { src: visitor.photoUrl, alt: visitor.name, width: 40, height: 40, className: "rounded-full object-cover" })) : (_jsx("div", { className: "h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center", children: _jsx(User, { className: "h-5 w-5 text-gray-500" }) })) }), _jsx(TableCell, { className: "font-medium", children: visitor.name }), _jsxs(TableCell, { children: [_jsx("span", { className: "block text-sm", children: getDocumentTypeText(visitor.documentType) }), _jsx("span", { className: "block text-xs text-gray-500", children: visitor.documentNumber })] }), _jsx(TableCell, { children: visitor.destination }), _jsx(TableCell, { children: visitor.residentName || 'N/A' }), _jsx(TableCell, { children: visitor.plate || 'N/A' }), _jsx(TableCell, { children: formatDate(visitor.entryTime) }), _jsx(TableCell, { children: formatDate(visitor.exitTime) }), _jsx(TableCell, { children: _jsx(Badge, { className: visitor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800', children: visitor.status === 'active' ? 'Activo' : 'Salió' }) }), _jsx(TableCell, { className: "text-right", children: visitor.status === 'active' && (_jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleRegisterExit(visitor.id), children: [_jsx(LogOut, { className: "mr-1 h-4 w-4" }), "Registrar Salida"] })) })] }, visitor.id)))) : (_jsx(TableRow, { children: _jsxs(TableCell, { colSpan: 10, className: "text-center py-12 text-gray-500", children: [_jsx(IdCard, { className: "h-12 w-12 mx-auto mb-4 text-gray-400" }), _jsx("h3", { className: "text-lg font-medium mb-2", children: "No se encontraron visitantes" }), _jsx("p", { children: "No hay visitantes que coincidan con los filtros seleccionados" })] }) })) })] }) }) }), _jsx(Dialog, { open: isRegisterDialogOpen, onOpenChange: setIsRegisterDialogOpen, children: _jsxs(DialogContent, { className: "sm:max-w-lg", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Registrar Nuevo Visitante" }), _jsx(DialogDescription, { children: "Complete la informaci\u00F3n del visitante para registrar su ingreso" })] }), _jsxs("div", { className: "space-y-4 py-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "name", children: "Nombre Completo" }), _jsx(Input, { id: "name", placeholder: "Nombre completo del visitante", value: newVisitorForm.name, onChange: (e) => handleNewVisitorFormChange('name', e.target.value) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "documentType", children: "Tipo de Documento" }), _jsxs(Select, { value: newVisitorForm.documentType, onValueChange: (value) => handleNewVisitorFormChange('documentType', value), children: [_jsx(SelectTrigger, { id: "documentType", children: _jsx(SelectValue, { placeholder: "Seleccione tipo" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "cc", children: "C\u00E9dula de Ciudadan\u00EDa" }), _jsx(SelectItem, { value: "ce", children: "C\u00E9dula de Extranjer\u00EDa" }), _jsx(SelectItem, { value: "passport", children: "Pasaporte" }), _jsx(SelectItem, { value: "other", children: "Otro" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "documentNumber", children: "N\u00FAmero de Documento" }), _jsx(Input, { id: "documentNumber", placeholder: "N\u00FAmero de identificaci\u00F3n", value: newVisitorForm.documentNumber, onChange: (e) => handleNewVisitorFormChange('documentNumber', e.target.value) })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "destination", children: "Destino" }), _jsx(Input, { id: "destination", placeholder: "Ej: Apto 101, Oficina 203", value: newVisitorForm.destination, onChange: (e) => handleNewVisitorFormChange('destination', e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "residentName", children: "Residente que autoriza (Opcional)" }), _jsx(Input, { id: "residentName", placeholder: "Nombre del residente", value: newVisitorForm.residentName, onChange: (e) => handleNewVisitorFormChange('residentName', e.target.value) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "plate", children: "Placa del Veh\u00EDculo (Opcional)" }), _jsx(Input, { id: "plate", placeholder: "Placa del veh\u00EDculo si aplica", value: newVisitorForm.plate, onChange: (e) => handleNewVisitorFormChange('plate', e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Foto del Visitante (Opcional)" }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs(Button, { variant: "outline", onClick: handleTakePhoto, children: [_jsx(Camera, { className: "mr-2 h-4 w-4" }), "Tomar Foto"] }), _jsx("div", { className: "text-sm text-gray-500", children: "o" }), _jsx("input", { type: "file", accept: "image/*", className: "hidden", id: "photo-upload", onChange: handlePhotoUpload }), _jsx("label", { htmlFor: "photo-upload", children: _jsx(Button, { variant: "outline", type: "button", className: "cursor-pointer", children: "Subir Foto" }) })] }), newVisitorForm.photo && (_jsxs("div", { className: "mt-2 flex items-center bg-gray-50 p-2 rounded-md", children: [_jsx(Image, { src: URL.createObjectURL(newVisitorForm.photo), alt: "Preview", width: 40, height: 40, className: "h-10 w-10 rounded-md object-cover mr-3" }), _jsx("span", { className: "text-sm truncate flex-grow", children: newVisitorForm.photo.name }), _jsx(Button, { variant: "ghost", size: "sm", className: "h-6 w-6 p-0 text-gray-500", onClick: () => handleNewVisitorFormChange('photo', null), children: _jsx(X, { className: "h-4 w-4" }) })] }))] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setIsRegisterDialogOpen(false), children: "Cancelar" }), _jsx(Button, { onClick: handleSubmitNewVisitor, disabled: isSubmitting || !newVisitorForm.name || !newVisitorForm.documentNumber || !newVisitorForm.destination, children: isSubmitting ? 'Registrando...' : 'Registrar Ingreso' })] })] }) })] }));
}
