var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
import { Textarea } from '@/components/ui/textarea';
import { Package, Mail, Search, Camera, Clock, AlertCircle, CheckCircle, PlusCircle, X, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Image from 'next/image';
export default function ReceptionPackagesPage() {
    const { isLoggedIn, token: _token, schemaName } = useAuthStore();
    const _router = useRouter();
    const [loading, setLoading] = useState(true);
    const [packages, setPackages] = useState([]);
    const [error, _setError] = useState(null);
    const [_searchTerm, _setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('pending');
    const [typeFilter, setTypeFilter] = useState('all');
    const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
    const [isDeliverDialogOpen, setIsDeliverDialogOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [newPackageForm, setNewPackageForm] = useState({
        type: 'package',
        trackingNumber: '',
        courier: '',
        destination: '',
        residentName: '',
        notes: '',
        photo: null
    });
    const [deliveryForm, setDeliveryForm] = useState({
        receivedBy: '',
        notes: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    // Datos de ejemplo para desarrollo y pruebas
    const mockPackages = useMemo(() => [
        {
            id: "pkg1",
            type: 'package',
            trackingNumber: "ABC123456789",
            courier: "Servientrega",
            destination: "Apartamento 502",
            residentName: "Ana López",
            receivedAt: "2025-05-28T14:30:00",
            notes: "Paquete grande, se dejó en bodega",
            photoUrl: "https://images.unsplash.com/photo-1565791380713-1756b9a05343?auto=format&fit=crop&q=80&w=500",
            status: 'pending'
        },
        {
            id: "pkg2",
            type: 'mail',
            destination: "Apartamento 301",
            residentName: "Carlos Rodríguez",
            receivedAt: "2025-05-29T09:15:00",
            deliveredAt: "2025-05-29T18:20:00",
            receivedBy: "Carlos Rodríguez",
            status: 'delivered'
        },
        {
            id: "pkg3",
            type: 'document',
            courier: "DHL Express",
            destination: "Apartamento 101",
            residentName: "Luis Martínez",
            receivedAt: "2025-05-29T11:45:00",
            notes: "Sobre con documentos importantes",
            status: 'pending'
        },
        {
            id: "pkg4",
            type: 'package',
            trackingNumber: "XYZ987654321",
            courier: "Coordinadora",
            destination: "Apartamento 202",
            residentName: "María Gómez",
            receivedAt: "2025-05-27T16:20:00",
            deliveredAt: "2025-05-28T10:30:00",
            receivedBy: "Juan Gómez (Familiar)",
            notes: "Entregado con autorización verbal",
            status: 'delivered'
        },
        {
            id: "pkg5",
            type: 'mail',
            destination: "Apartamento 404",
            residentName: "Pedro Sánchez",
            receivedAt: "2025-05-26T14:10:00",
            status: 'returned',
            notes: "Devuelto al remitente después de 3 días sin reclamar"
        }
    ], []);
    const fetchData = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            _setError(null);
            // En un entorno real, esto sería una llamada a la API
            // const response = await fetch('/api/packages');
            // const result = await response.json();
            // if (!response.ok) throw new Error(result.message || 'Error al cargar datos');
            // setPackages(result.packages);
            // Simulamos un retraso en la carga de datos
            setTimeout(() => {
                setPackages(mockPackages);
                setLoading(false);
            }, 1000);
        }
        catch (err) {
            console.error("[ReceptionPackages] Error:", err);
            _setError(err.message || 'Error al cargar datos de paquetes');
            setLoading(false);
        }
    }), [mockPackages, _setError, setPackages, setLoading]);
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
    // Función para obtener el texto del tipo de paquete
    const getPackageTypeText = (type) => {
        switch (type) {
            case 'package': return 'Paquete';
            case 'mail': return 'Correspondencia';
            case 'document': return 'Documento';
            default: return 'Desconocido';
        }
    };
    // Función para obtener el color según el estado
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'returned': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    // Función para obtener el texto según el estado
    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Pendiente';
            case 'delivered': return 'Entregado';
            case 'returned': return 'Devuelto';
            default: return 'Desconocido';
        }
    };
    // Filtrar paquetes según los filtros aplicados
    const getFilteredPackages = () => {
        if (!packages)
            return [];
        let filtered = packages;
        // Filtrar por estado
        if (statusFilter !== 'all') {
            filtered = filtered.filter(pkg => pkg.status === statusFilter);
        }
        // Filtrar por tipo
        if (typeFilter !== 'all') {
            filtered = filtered.filter(pkg => pkg.type === typeFilter);
        }
        // Filtrar por término de búsqueda
        if (searchTerm) {
            filtered = filtered.filter(pkg => pkg.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (pkg.trackingNumber && pkg.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (pkg.courier && pkg.courier.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (pkg.notes && pkg.notes.toLowerCase().includes(searchTerm.toLowerCase())));
        }
        return filtered;
    };
    // Función para manejar cambios en el formulario de registro
    const handleNewPackageFormChange = (field, value) => {
        setNewPackageForm(prev => (Object.assign(Object.assign({}, prev), { [field]: value })));
    };
    // Función para manejar cambios en el formulario de entrega
    const handleDeliveryFormChange = (field, value) => {
        setDeliveryForm(prev => (Object.assign(Object.assign({}, prev), { [field]: value })));
    };
    // Función para manejar la captura de foto (simulada)
    const handleTakePhoto = () => {
        // En un entorno real, esto activaría la cámara
        alert('Funcionalidad de cámara no implementada en esta demo');
    };
    // Función para manejar la subida de foto
    const handlePhotoUpload = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleNewPackageFormChange('photo', e.target.files[0]);
        }
    };
    // Función para registrar un nuevo paquete
    const handleSubmitNewPackage = () => __awaiter(this, void 0, void 0, function* () {
        if (!newPackageForm.destination || !newPackageForm.residentName) {
            alert('Por favor complete todos los campos obligatorios');
            return;
        }
        setIsSubmitting(true);
        try {
            // En un entorno real, esto sería una llamada a la API
            // const formData = new FormData();
            // formData.append('type', newPackageForm.type);
            // formData.append('destination', newPackageForm.destination);
            // formData.append('residentName', newPackageForm.residentName);
            // if (newPackageForm.trackingNumber) formData.append('trackingNumber', newPackageForm.trackingNumber);
            // if (newPackageForm.courier) formData.append('courier', newPackageForm.courier);
            // if (newPackageForm.notes) formData.append('notes', newPackageForm.notes);
            // if (newPackageForm.photo) formData.append('photo', newPackageForm.photo);
            // // Variable response eliminada por lint
            // if (!response.ok) {
            //   throw new Error('Error al registrar paquete');
            // }
            // Simulamos un retraso en el envío
            yield new Promise(resolve => setTimeout(resolve, 1000));
            // Simulamos una respuesta exitosa
            const newPackage = {
                id: `pkg${Date.now()}`,
                type: newPackageForm.type,
                trackingNumber: newPackageForm.trackingNumber || undefined,
                courier: newPackageForm.courier || undefined,
                destination: newPackageForm.destination,
                residentName: newPackageForm.residentName,
                receivedAt: new Date().toISOString(),
                notes: newPackageForm.notes || undefined,
                photoUrl: newPackageForm.photo ? URL.createObjectURL(newPackageForm.photo) : undefined,
                status: 'pending'
            };
            setPackages(prev => [newPackage, ...prev]);
            setSuccessMessage('Paquete registrado exitosamente.');
            setIsRegisterDialogOpen(false);
            // Resetear formulario
            setNewPackageForm({
                type: 'package',
                trackingNumber: '',
                courier: '',
                destination: '',
                residentName: '',
                notes: '',
                photo: null
            });
        }
        catch (err) {
            console.error("[ReceptionPackages] Error:", err);
            setError('Error al registrar el paquete. Por favor, inténtelo de nuevo.');
        }
        finally {
            setIsSubmitting(false);
        }
    });
    // Función para abrir el diálogo de entrega
    const handleOpenDeliverDialog = (pkg) => {
        setSelectedPackage(pkg);
        setDeliveryForm({
            receivedBy: '',
            notes: ''
        });
        setIsDeliverDialogOpen(true);
    };
    // Función para registrar la entrega de un paquete
    const handleDeliverPackage = () => __awaiter(this, void 0, void 0, function* () {
        if (!selectedPackage || !deliveryForm.receivedBy) {
            alert('Por favor complete todos los campos obligatorios');
            return;
        }
        setIsSubmitting(true);
        try {
            // En un entorno real, esto sería una llamada a la API
            // // Variable response eliminada por lint
            // if (!response.ok) {
            //   throw new Error('Error al registrar entrega');
            // }
            // Simulamos un retraso
            yield new Promise(resolve => setTimeout(resolve, 500));
            // Actualizamos el estado local
            setPackages(prev => prev.map(pkg => pkg.id === selectedPackage.id
                ? Object.assign(Object.assign({}, pkg), { status: 'delivered', deliveredAt: new Date().toISOString(), receivedBy: deliveryForm.receivedBy, notes: deliveryForm.notes ? (pkg.notes ? `${pkg.notes}; ${deliveryForm.notes}` : deliveryForm.notes) : pkg.notes }) : pkg));
            setSuccessMessage('Entrega registrada exitosamente.');
            setIsDeliverDialogOpen(false);
        }
        catch (err) {
            console.error("[ReceptionPackages] Error:", err);
            setError('Error al registrar la entrega. Por favor, inténtelo de nuevo.');
        }
        finally {
            setIsSubmitting(false);
        }
    });
    // Función para marcar un paquete como devuelto
    const handleReturnPackage = (packageId) => __awaiter(this, void 0, void 0, function* () {
        if (!confirm('¿Está seguro de que desea marcar este paquete como devuelto?')) {
            return;
        }
        try {
            // En un entorno real, esto sería una llamada a la API
            // // Variable response eliminada por lint
            // if (!response.ok) {
            //   throw new Error('Error al marcar como devuelto');
            // }
            // Simulamos un retraso
            yield new Promise(resolve => setTimeout(resolve, 500));
            // Actualizamos el estado local
            setPackages(prev => prev.map(pkg => pkg.id === packageId
                ? Object.assign(Object.assign({}, pkg), { status: 'returned' }) : pkg));
            setSuccessMessage('Paquete marcado como devuelto.');
        }
        catch (err) {
            console.error("[ReceptionPackages] Error:", err);
            setError('Error al marcar el paquete como devuelto. Por favor, inténtelo de nuevo.');
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
    const filteredPackages = getFilteredPackages();
    const pendingCount = packages.filter(pkg => pkg.status === 'pending').length;
    const deliveredCount = packages.filter(pkg => pkg.status === 'delivered').length;
    const returnedCount = packages.filter(pkg => pkg.status === 'returned').length;
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", children: "Gesti\u00F3n de Paquetes y Correspondencia" }), _jsx("p", { className: "text-gray-500", children: "Administre la recepci\u00F3n y entrega de paquetes y correspondencia" })] }), _jsxs(Button, { className: "mt-2 md:mt-0", onClick: () => setIsRegisterDialogOpen(true), children: [_jsx(PlusCircle, { className: "mr-2 h-4 w-4" }), "Registrar Nuevo Paquete"] })] }), successMessage && (_jsxs(Alert, { className: "mb-6 bg-green-50 border-green-200", children: [_jsx(CheckCircle, { className: "h-4 w-4 text-green-600" }), _jsx(AlertTitle, { className: "text-green-600", children: "\u00C9xito" }), _jsx(AlertDescription, { className: "text-green-700", children: successMessage }), _jsx(Button, { variant: "ghost", size: "sm", className: "ml-auto text-green-600", onClick: () => setSuccessMessage(null), children: "Cerrar" })] })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-6", children: [_jsx(Card, { children: _jsxs(CardContent, { className: "p-6 flex items-center", children: [_jsx("div", { className: "h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4", children: _jsx(Clock, { className: "h-6 w-6 text-yellow-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Pendientes de entrega" }), _jsx("h3", { className: "text-2xl font-bold", children: pendingCount })] })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-6 flex items-center", children: [_jsx("div", { className: "h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4", children: _jsx(CheckCircle, { className: "h-6 w-6 text-green-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Entregados" }), _jsx("h3", { className: "text-2xl font-bold", children: deliveredCount })] })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-6 flex items-center", children: [_jsx("div", { className: "h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mr-4", children: _jsx(X, { className: "h-6 w-6 text-red-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Devueltos" }), _jsx("h3", { className: "text-2xl font-bold", children: returnedCount })] })] }) })] }), _jsx(Card, { className: "mb-6", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [_jsxs("div", { className: "relative flex-grow", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx(Input, { placeholder: "Buscar por residente, destino, n\u00FAmero de seguimiento...", className: "pl-10", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Select, { value: statusFilter, onValueChange: (value) => setStatusFilter(value), children: [_jsx(SelectTrigger, { className: "w-full md:w-40", children: _jsx(SelectValue, { placeholder: "Estado" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "Todos" }), _jsx(SelectItem, { value: "pending", children: "Pendientes" }), _jsx(SelectItem, { value: "delivered", children: "Entregados" }), _jsx(SelectItem, { value: "returned", children: "Devueltos" })] })] }), _jsxs(Select, { value: typeFilter, onValueChange: (value) => setTypeFilter(value), children: [_jsx(SelectTrigger, { className: "w-full md:w-40", children: _jsx(SelectValue, { placeholder: "Tipo" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "Todos" }), _jsx(SelectItem, { value: "package", children: "Paquetes" }), _jsx(SelectItem, { value: "mail", children: "Correspondencia" }), _jsx(SelectItem, { value: "document", children: "Documentos" })] })] })] })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-0", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Tipo" }), _jsx(TableHead, { children: "Destino" }), _jsx(TableHead, { children: "Residente" }), _jsx(TableHead, { children: "Recibido" }), _jsx(TableHead, { children: "Detalles" }), _jsx(TableHead, { children: "Estado" }), _jsx(TableHead, { className: "text-right", children: "Acciones" })] }) }), _jsx(TableBody, { children: filteredPackages.length > 0 ? (filteredPackages.map((pkg) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsxs("div", { className: "flex items-center", children: [pkg.type === 'package' ? (_jsx(Package, { className: "h-5 w-5 mr-2 text-indigo-600" })) : pkg.type === 'mail' ? (_jsx(Mail, { className: "h-5 w-5 mr-2 text-blue-600" })) : (_jsx(FileText, { className: "h-5 w-5 mr-2 text-green-600" })), _jsx("span", { children: getPackageTypeText(pkg.type) })] }) }), _jsx(TableCell, { children: pkg.destination }), _jsx(TableCell, { children: pkg.residentName }), _jsx(TableCell, { children: formatDate(pkg.receivedAt) }), _jsx(TableCell, { children: _jsxs("div", { className: "text-sm", children: [pkg.trackingNumber && (_jsxs("div", { className: "mb-1", children: [_jsx("span", { className: "font-medium", children: "Seguimiento:" }), " ", pkg.trackingNumber] })), pkg.courier && (_jsxs("div", { className: "mb-1", children: [_jsx("span", { className: "font-medium", children: "Mensajer\u00EDa:" }), " ", pkg.courier] })), pkg.notes && (_jsx("div", { className: "text-gray-500 truncate max-w-[200px]", title: pkg.notes, children: pkg.notes }))] }) }), _jsxs(TableCell, { children: [_jsx(Badge, { className: getStatusColor(pkg.status), children: getStatusText(pkg.status) }), pkg.status === 'delivered' && pkg.deliveredAt && (_jsx("div", { className: "text-xs text-gray-500 mt-1", children: formatDate(pkg.deliveredAt) }))] }), _jsx(TableCell, { className: "text-right", children: pkg.status === 'pending' && (_jsxs("div", { className: "flex justify-end gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleOpenDeliverDialog(pkg), children: [_jsx(CheckCircle, { className: "mr-1 h-4 w-4" }), "Entregar"] }), _jsxs(Button, { variant: "ghost", size: "sm", className: "text-red-600", onClick: () => handleReturnPackage(pkg.id), children: [_jsx(X, { className: "mr-1 h-4 w-4" }), "Devolver"] })] })) })] }, pkg.id)))) : (_jsx(TableRow, { children: _jsxs(TableCell, { colSpan: 7, className: "text-center py-12 text-gray-500", children: [_jsx(Package, { className: "h-12 w-12 mx-auto mb-4 text-gray-400" }), _jsx("h3", { className: "text-lg font-medium mb-2", children: "No se encontraron paquetes" }), _jsx("p", { children: "No hay paquetes que coincidan con los filtros seleccionados" })] }) })) })] }) }) }), _jsx(Dialog, { open: isRegisterDialogOpen, onOpenChange: setIsRegisterDialogOpen, children: _jsxs(DialogContent, { className: "sm:max-w-lg", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Registrar Nuevo Paquete" }), _jsx(DialogDescription, { children: "Complete la informaci\u00F3n para registrar un nuevo paquete o correspondencia" })] }), _jsxs("div", { className: "space-y-4 py-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "type", children: "Tipo" }), _jsxs(Select, { value: newPackageForm.type, onValueChange: (value) => handleNewPackageFormChange('type', value), children: [_jsx(SelectTrigger, { id: "type", children: _jsx(SelectValue, { placeholder: "Seleccione tipo" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "package", children: "Paquete" }), _jsx(SelectItem, { value: "mail", children: "Correspondencia" }), _jsx(SelectItem, { value: "document", children: "Documento" })] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "destination", children: "Destino" }), _jsx(Input, { id: "destination", placeholder: "Ej: Apto 101, Oficina 203", value: newPackageForm.destination, onChange: (e) => handleNewPackageFormChange('destination', e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "residentName", children: "Residente" }), _jsx(Input, { id: "residentName", placeholder: "Nombre del residente", value: newPackageForm.residentName, onChange: (e) => handleNewPackageFormChange('residentName', e.target.value) })] })] }), newPackageForm.type !== 'mail' && (_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "trackingNumber", children: "N\u00FAmero de Seguimiento (Opcional)" }), _jsx(Input, { id: "trackingNumber", placeholder: "N\u00FAmero de seguimiento", value: newPackageForm.trackingNumber, onChange: (e) => handleNewPackageFormChange('trackingNumber', e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "courier", children: "Empresa de Mensajer\u00EDa (Opcional)" }), _jsx(Input, { id: "courier", placeholder: "Nombre de la empresa", value: newPackageForm.courier, onChange: (e) => handleNewPackageFormChange('courier', e.target.value) })] })] })), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "notes", children: "Notas (Opcional)" }), _jsx(Textarea, { id: "notes", placeholder: "Informaci\u00F3n adicional sobre el paquete", value: newPackageForm.notes, onChange: (e) => handleNewPackageFormChange('notes', e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Foto del Paquete (Opcional)" }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs(Button, { variant: "outline", onClick: handleTakePhoto, children: [_jsx(Camera, { className: "mr-2 h-4 w-4" }), "Tomar Foto"] }), _jsx("div", { className: "text-sm text-gray-500", children: "o" }), _jsx("input", { type: "file", accept: "image/*", className: "hidden", id: "photo-upload", onChange: handlePhotoUpload }), _jsx("label", { htmlFor: "photo-upload", children: _jsx(Button, { variant: "outline", type: "button", className: "cursor-pointer", children: "Subir Foto" }) })] }), newPackageForm.photo && (_jsxs("div", { className: "mt-2 flex items-center bg-gray-50 p-2 rounded-md", children: [_jsx(Image, { src: URL.createObjectURL(newPackageForm.photo), alt: "Preview", width: 40, height: 40, className: "rounded-md object-cover mr-3" }), _jsx("span", { className: "text-sm truncate flex-grow", children: newPackageForm.photo.name }), _jsx(Button, { variant: "ghost", size: "sm", className: "h-6 w-6 p-0 text-gray-500", onClick: () => handleNewPackageFormChange('photo', null), children: _jsx(X, { className: "h-4 w-4" }) })] }))] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setIsRegisterDialogOpen(false), children: "Cancelar" }), _jsx(Button, { onClick: handleSubmitNewPackage, disabled: isSubmitting || !newPackageForm.destination || !newPackageForm.residentName, children: isSubmitting ? 'Registrando...' : 'Registrar Paquete' })] })] }) }), _jsx(Dialog, { open: isDeliverDialogOpen, onOpenChange: setIsDeliverDialogOpen, children: _jsxs(DialogContent, { className: "sm:max-w-md", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Registrar Entrega de Paquete" }), _jsx(DialogDescription, { children: "Complete la informaci\u00F3n para registrar la entrega del paquete" })] }), selectedPackage && (_jsxs("div", { className: "space-y-4 py-4", children: [_jsxs("div", { className: "bg-gray-50 p-4 rounded-md mb-4", children: [_jsxs("div", { className: "flex items-center mb-2", children: [selectedPackage.type === 'package' ? (_jsx(Package, { className: "h-5 w-5 mr-2 text-indigo-600" })) : selectedPackage.type === 'mail' ? (_jsx(Mail, { className: "h-5 w-5 mr-2 text-blue-600" })) : (_jsx(FileText, { className: "h-5 w-5 mr-2 text-green-600" })), _jsx("span", { className: "font-medium", children: getPackageTypeText(selectedPackage.type) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2 text-sm", children: [_jsx("div", { className: "text-gray-500", children: "Destino:" }), _jsx("div", { children: selectedPackage.destination }), _jsx("div", { className: "text-gray-500", children: "Residente:" }), _jsx("div", { children: selectedPackage.residentName }), _jsx("div", { className: "text-gray-500", children: "Recibido el:" }), _jsx("div", { children: formatDate(selectedPackage.receivedAt) }), selectedPackage.trackingNumber && (_jsxs(_Fragment, { children: [_jsx("div", { className: "text-gray-500", children: "Seguimiento:" }), _jsx("div", { children: selectedPackage.trackingNumber })] }))] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "receivedBy", children: "Recibido por" }), _jsx(Input, { id: "receivedBy", placeholder: "Nombre de quien recibe", value: deliveryForm.receivedBy, onChange: (e) => handleDeliveryFormChange('receivedBy', e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "deliveryNotes", children: "Notas (Opcional)" }), _jsx(Textarea, { id: "deliveryNotes", placeholder: "Informaci\u00F3n adicional sobre la entrega", value: deliveryForm.notes, onChange: (e) => handleDeliveryFormChange('notes', e.target.value) })] })] })), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setIsDeliverDialogOpen(false), children: "Cancelar" }), _jsx(Button, { onClick: handleDeliverPackage, disabled: isSubmitting || !deliveryForm.receivedBy, children: isSubmitting ? 'Registrando...' : 'Confirmar Entrega' })] })] }) })] }));
}
