"use client";
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
import { useState, useEffect } from 'react';
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
;
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Search, Camera, Clock, User, AlertCircle, CheckCircle, PlusCircle, X, FileText, MapPin, Calendar, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
export default function ReceptionIncidentsPage() {
    const { isLoggedIn, token: _token, schemaName } = useAuthStore();
    const _router = useRouter();
    const [loading, setLoading] = useState(true);
    const [incidents, setIncidents] = useState([]);
    const [error, _setError] = useState(null);
    const [_searchTerm, _setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [newIncidentForm, setNewIncidentForm] = useState({
        title: '',
        description: '',
        category: 'security',
        priority: 'medium',
        location: '',
        reportedBy: '',
        attachments: []
    });
    const [updateForm, setUpdateForm] = useState({
        content: '',
        status: '',
        attachments: []
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    // Datos de ejemplo para desarrollo y pruebas
    const mockIncidents = useMemo(() => [
        {
            id: "inc1",
            title: "Intento de ingreso no autorizado",
            description: "Se detectó a una persona intentando ingresar por la puerta de emergencia del bloque B.",
            category: 'security',
            priority: 'high',
            location: "Puerta de emergencia - Bloque B",
            reportedAt: "2025-05-28T22:15:00",
            reportedBy: "Juan Pérez (Vigilante)",
            assignedTo: "Carlos Rodríguez (Jefe de Seguridad)",
            status: 'in_progress',
            updates: [
                {
                    id: "upd1",
                    content: "Se revisaron las cámaras de seguridad y se identificó a la persona. Se está realizando seguimiento.",
                    timestamp: "2025-05-29T08:30:00",
                    author: "Carlos Rodríguez (Jefe de Seguridad)",
                    attachments: [
                        {
                            id: "att1",
                            name: "captura_camara_seguridad.jpg",
                            url: "https://example.com/captura_camara_seguridad.jpg",
                            type: "image/jpeg",
                            size: 1200000
                        }
                    ]
                }
            ],
            attachments: [
                {
                    id: "att1",
                    name: "captura_camara_seguridad.jpg",
                    url: "https://example.com/captura_camara_seguridad.jpg",
                    type: "image/jpeg",
                    size: 1200000
                }
            ]
        },
        {
            id: "inc2",
            title: "Fuga de agua en zona común",
            description: "Hay una fuga de agua en el pasillo del tercer piso del bloque A, cerca al ascensor.",
            category: 'maintenance',
            priority: 'medium',
            location: "Pasillo 3er piso - Bloque A",
            reportedAt: "2025-05-29T09:45:00",
            reportedBy: "María Gómez (Recepcionista)",
            assignedTo: "Pedro Sánchez (Mantenimiento)",
            resolvedAt: "2025-05-29T11:30:00",
            status: 'resolved',
            updates: [
                {
                    id: "upd1",
                    content: "Se identificó la tubería con fuga y se procedió a cerrar la llave de paso del sector.",
                    timestamp: "2025-05-29T10:15:00",
                    author: "Pedro Sánchez (Mantenimiento)",
                    attachments: []
                },
                {
                    id: "upd2",
                    content: "Se reparó la tubería y se verificó que no haya más fugas. Se restableció el servicio de agua.",
                    timestamp: "2025-05-29T11:30:00",
                    author: "Pedro Sánchez (Mantenimiento)",
                    attachments: [
                        {
                            id: "att1",
                            name: "reparacion_tuberia.jpg",
                            url: "https://example.com/reparacion_tuberia.jpg",
                            type: "image/jpeg",
                            size: 950000
                        }
                    ]
                }
            ],
            attachments: [
                {
                    id: "att1",
                    name: "foto_fuga.jpg",
                    url: "https://example.com/foto_fuga.jpg",
                    type: "image/jpeg",
                    size: 850000
                },
                {
                    id: "att2",
                    name: "reparacion_tuberia.jpg",
                    url: "https://example.com/reparacion_tuberia.jpg",
                    type: "image/jpeg",
                    size: 950000
                }
            ]
        },
        {
            id: "inc3",
            title: "Alarma de incendio activada",
            description: "La alarma de incendio se activó en el bloque C. Se evacuó el edificio y se verificó que fue una falsa alarma.",
            category: 'emergency',
            priority: 'critical',
            location: "Bloque C - Todos los pisos",
            reportedAt: "2025-05-27T15:20:00",
            reportedBy: "Sistema automático de alarmas",
            assignedTo: "Equipo de Emergencias",
            resolvedAt: "2025-05-27T16:00:00",
            status: 'closed',
            updates: [
                {
                    id: "upd1",
                    content: "Se activó el protocolo de evacuación y se verificó que todos los residentes salieran del edificio.",
                    timestamp: "2025-05-27T15:25:00",
                    author: "Equipo de Emergencias",
                    attachments: []
                },
                {
                    id: "upd2",
                    content: "Los bomberos verificaron el edificio y determinaron que fue una falsa alarma causada por un sensor defectuoso.",
                    timestamp: "2025-05-27T15:50:00",
                    author: "Cuerpo de Bomberos",
                    attachments: []
                },
                {
                    id: "upd3",
                    content: "Se reemplazó el sensor defectuoso y se realizó una prueba del sistema de alarmas.",
                    timestamp: "2025-05-27T16:00:00",
                    author: "Técnico de Mantenimiento",
                    attachments: [
                        {
                            id: "att1",
                            name: "reporte_bomberos.pdf",
                            url: "https://example.com/reporte_bomberos.pdf",
                            type: "application/pdf",
                            size: 1500000
                        }
                    ]
                }
            ],
            attachments: [
                {
                    id: "att1",
                    name: "reporte_bomberos.pdf",
                    url: "https://example.com/reporte_bomberos.pdf",
                    type: "application/pdf",
                    size: 1500000
                },
                {
                    id: "att2",
                    name: "registro_evacuacion.xlsx",
                    url: "https://example.com/registro_evacuacion.xlsx",
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    size: 750000
                }
            ]
        },
        {
            id: "inc4",
            title: "Vehículo mal estacionado",
            description: "Hay un vehículo estacionado en zona prohibida, bloqueando parcialmente la salida de emergencia.",
            category: 'other',
            priority: 'low',
            location: "Parqueadero - Nivel 1",
            reportedAt: "2025-05-29T14:10:00",
            reportedBy: "Ana Martínez (Residente)",
            status: 'reported',
            updates: [],
            attachments: [
                {
                    id: "att1",
                    name: "vehiculo_mal_estacionado.jpg",
                    url: "https://example.com/vehiculo_mal_estacionado.jpg",
                    type: "image/jpeg",
                    size: 1100000
                }
            ]
        }
    ], []);
    const fetchData = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            _setError(null);
            // En un entorno real, esto sería una llamada a la API
            // const response = await fetch('/api/incidents');
            // const result = await response.json();
            // if (!response.ok) throw new Error(result.message || 'Error al cargar datos');
            // setIncidents(result.incidents);
            // Simulamos un retraso en la carga de datos
            setTimeout(() => {
                setIncidents(mockIncidents);
                setLoading(false);
            }, 1000);
        }
        catch (err) {
            console.error("[ReceptionIncidents] Error:", err);
            _setError(err.message || 'Error al cargar datos de incidentes');
            setLoading(false);
        }
    }), [mockIncidents, _setError, setIncidents, setLoading]);
    useEffect(() => {
        if (!isLoggedIn || !schemaName) {
            _router.push('/login');
            return;
        }
        fetchData();
    }, [isLoggedIn, schemaName, _router, fetchData]);
    // Función para formatear fechas
    const formatDate = (dateString) => {
        if (!dateString)
            return 'N/A';
        return format(new Date(dateString), "d MMM yyyy, HH:mm", { locale: es });
    };
    // Función para obtener el texto de la categoría
    const getCategoryText = (category) => {
        switch (category) {
            case 'security': return 'Seguridad';
            case 'maintenance': return 'Mantenimiento';
            case 'emergency': return 'Emergencia';
            case 'other': return 'Otro';
            default: return 'Desconocido';
        }
    };
    // Función para obtener el color según la categoría
    const getCategoryColor = (category) => {
        switch (category) {
            case 'security': return 'bg-blue-100 text-blue-800';
            case 'maintenance': return 'bg-yellow-100 text-yellow-800';
            case 'emergency': return 'bg-red-100 text-red-800';
            case 'other': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    // Función para obtener el texto de la prioridad
    const getPriorityText = (priority) => {
        switch (priority) {
            case 'low': return 'Baja';
            case 'medium': return 'Media';
            case 'high': return 'Alta';
            case 'critical': return 'Crítica';
            default: return 'Desconocida';
        }
    };
    // Función para obtener el color según la prioridad
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'low': return 'bg-green-100 text-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'critical': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    // Función para obtener el texto del estado
    const getStatusText = (status) => {
        switch (status) {
            case 'reported': return 'Reportado';
            case 'in_progress': return 'En proceso';
            case 'resolved': return 'Resuelto';
            case 'closed': return 'Cerrado';
            default: return 'Desconocido';
        }
    };
    // Función para obtener el color según el estado
    const getStatusColor = (status) => {
        switch (status) {
            case 'reported': return 'bg-blue-100 text-blue-800';
            case 'in_progress': return 'bg-yellow-100 text-yellow-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'closed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    // Filtrar incidentes según los filtros aplicados
    const getFilteredIncidents = () => {
        if (!incidents)
            return [];
        let filtered = incidents;
        // Filtrar por estado
        if (statusFilter !== 'all') {
            filtered = filtered.filter(incident => incident.status === statusFilter);
        }
        // Filtrar por categoría
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(incident => incident.category === categoryFilter);
        }
        // Filtrar por prioridad
        if (priorityFilter !== 'all') {
            filtered = filtered.filter(incident => incident.priority === priorityFilter);
        }
        // Filtrar por término de búsqueda
        if (searchTerm) {
            filtered = filtered.filter(incident => incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                incident.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (incident.assignedTo && incident.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())));
        }
        return filtered;
    };
    // Función para manejar cambios en el formulario de registro
    const handleNewIncidentFormChange = (field, value) => {
        setNewIncidentForm(prev => (Object.assign(Object.assign({}, prev), { [field]: value })));
    };
    // Función para manejar cambios en el formulario de actualización
    const handleUpdateFormChange = (field, value) => {
        setUpdateForm(prev => (Object.assign(Object.assign({}, prev), { [field]: value })));
    };
    // Función para manejar la captura de foto (simulada)
    const handleTakePhoto = () => {
        // En un entorno real, esto activaría la cámara
        alert('Funcionalidad de cámara no implementada en esta demo');
    };
    // Función para manejar la subida de archivos
    const handleFileUpload = (e, formType) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            if (formType === 'new') {
                setNewIncidentForm(prev => (Object.assign(Object.assign({}, prev), { attachments: [...prev.attachments, ...newFiles] })));
            }
            else {
                setUpdateForm(prev => (Object.assign(Object.assign({}, prev), { attachments: [...prev.attachments, ...newFiles] })));
            }
        }
    };
    // Función para eliminar un archivo adjunto
    const handleRemoveFile = (index, formType) => {
        if (formType === 'new') {
            setNewIncidentForm(prev => (Object.assign(Object.assign({}, prev), { attachments: prev.attachments.filter((_, i) => i !== index) })));
        }
        else {
            setUpdateForm(prev => (Object.assign(Object.assign({}, prev), { attachments: prev.attachments.filter((_, i) => i !== index) })));
        }
    };
    // Función para registrar un nuevo incidente
    const handleSubmitNewIncident = () => __awaiter(this, void 0, void 0, function* () {
        if (!newIncidentForm.title || !newIncidentForm.description || !newIncidentForm.location || !newIncidentForm.reportedBy) {
            alert('Por favor complete todos los campos obligatorios');
            return;
        }
        setIsSubmitting(true);
        try {
            // En un entorno real, esto sería una llamada a la API
            // const formData = new FormData();
            // formData.append('title', newIncidentForm.title);
            // formData.append('description', newIncidentForm.description);
            // formData.append('category', newIncidentForm.category);
            // formData.append('priority', newIncidentForm.priority);
            // formData.append('location', newIncidentForm.location);
            // formData.append('reportedBy', newIncidentForm.reportedBy);
            // newIncidentForm.attachments.forEach(file => {
            //   formData.append('attachments', file);
            // });
            // // Variable response eliminada por lint
            // if (!response.ok) {
            //   throw new Error('Error al registrar incidente');
            // }
            // Simulamos un retraso en el envío
            yield new Promise(resolve => setTimeout(resolve, 1000));
            // Simulamos una respuesta exitosa
            const newIncident = {
                id: `inc${Date.now()}`,
                title: newIncidentForm.title,
                description: newIncidentForm.description,
                category: newIncidentForm.category,
                priority: newIncidentForm.priority,
                location: newIncidentForm.location,
                reportedAt: new Date().toISOString(),
                reportedBy: newIncidentForm.reportedBy,
                status: 'reported',
                updates: [],
                attachments: newIncidentForm.attachments.map((file, index) => ({
                    id: `att${Date.now()}-${index}`,
                    name: file.name,
                    url: URL.createObjectURL(file),
                    type: file.type,
                    size: file.size
                }))
            };
            setIncidents(prev => [newIncident, ...prev]);
            setSuccessMessage('Incidente registrado exitosamente.');
            setIsRegisterDialogOpen(false);
            // Resetear formulario
            setNewIncidentForm({
                title: '',
                description: '',
                category: 'security',
                priority: 'medium',
                location: '',
                reportedBy: '',
                attachments: []
            });
        }
        catch (err) {
            console.error("[ReceptionIncidents] Error:", err);
            setError('Error al registrar el incidente. Por favor, inténtelo de nuevo.');
        }
        finally {
            setIsSubmitting(false);
        }
    });
    // Función para abrir el diálogo de actualización
    const handleOpenUpdateDialog = (incident) => {
        setSelectedIncident(incident);
        setUpdateForm({
            content: '',
            status: incident.status,
            attachments: []
        });
        setIsUpdateDialogOpen(true);
    };
    // Función para actualizar un incidente
    const handleUpdateIncident = () => __awaiter(this, void 0, void 0, function* () {
        if (!selectedIncident || !updateForm.content) {
            alert('Por favor complete todos los campos obligatorios');
            return;
        }
        setIsSubmitting(true);
        try {
            // En un entorno real, esto sería una llamada a la API
            // const formData = new FormData();
            // formData.append('content', updateForm.content);
            // formData.append('status', updateForm.status);
            // updateForm.attachments.forEach(file => {
            //   formData.append('attachments', file);
            // });
            // // Variable response eliminada por lint
            // if (!response.ok) {
            //   throw new Error('Error al actualizar incidente');
            // }
            // Simulamos un retraso en el envío
            yield new Promise(resolve => setTimeout(resolve, 500));
            // Simulamos una respuesta exitosa
            const newUpdate = {
                id: `upd${Date.now()}`,
                content: updateForm.content,
                timestamp: new Date().toISOString(),
                author: "Usuario actual", // En un entorno real, esto vendría del contexto de autenticación
                attachments: updateForm.attachments.map((file, index) => ({
                    id: `att${Date.now()}-${index}`,
                    name: file.name,
                    url: URL.createObjectURL(file),
                    type: file.type,
                    size: file.size
                }))
            };
            // Actualizamos el estado local
            setIncidents(prev => prev.map(inc => inc.id === selectedIncident.id
                ? Object.assign(Object.assign({}, inc), { status: updateForm.status, updates: [...inc.updates, newUpdate], attachments: [
                        ...inc.attachments,
                        ...newUpdate.attachments
                    ], resolvedAt: updateForm.status === 'resolved' && inc.status !== 'resolved'
                        ? new Date().toISOString()
                        : inc.resolvedAt }) : inc));
            setSuccessMessage('Incidente actualizado exitosamente.');
            setIsUpdateDialogOpen(false);
            // Resetear formulario
            setUpdateForm({
                content: '',
                status: '',
                attachments: []
            });
        }
        catch (err) {
            console.error("[ReceptionIncidents] Error:", err);
            setError('Error al actualizar el incidente. Por favor, inténtelo de nuevo.');
        }
        finally {
            setIsSubmitting(false);
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
    const filteredIncidents = getFilteredIncidents();
    const reportedCount = incidents.filter(inc => inc.status === 'reported').length;
    const inProgressCount = incidents.filter(inc => inc.status === 'in_progress').length;
    const resolvedCount = incidents.filter(inc => inc.status === 'resolved').length;
    const closedCount = incidents.filter(inc => inc.status === 'closed').length;
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", children: "Registro de Incidentes" }), _jsx("p", { className: "text-gray-500", children: "Gestione y d\u00E9 seguimiento a incidentes de seguridad y mantenimiento" })] }), _jsxs(Button, { className: "mt-2 md:mt-0", onClick: () => setIsRegisterDialogOpen(true), children: [_jsx(PlusCircle, { className: "mr-2 h-4 w-4" }), "Registrar Nuevo Incidente"] })] }), successMessage && (_jsxs(Alert, { className: "mb-6 bg-green-50 border-green-200", children: [_jsx(CheckCircle, { className: "h-4 w-4 text-green-600" }), _jsx(AlertTitle, { className: "text-green-600", children: "\u00C9xito" }), _jsx(AlertDescription, { className: "text-green-700", children: successMessage }), _jsx(Button, { variant: "ghost", size: "sm", className: "ml-auto text-green-600", onClick: () => setSuccessMessage(null), children: "Cerrar" })] })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [_jsx(Card, { children: _jsxs(CardContent, { className: "p-4 flex items-center", children: [_jsx("div", { className: "h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3", children: _jsx(AlertCircle, { className: "h-5 w-5 text-blue-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: "Reportados" }), _jsx("h3", { className: "text-xl font-bold", children: reportedCount })] })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4 flex items-center", children: [_jsx("div", { className: "h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3", children: _jsx(Clock, { className: "h-5 w-5 text-yellow-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: "En proceso" }), _jsx("h3", { className: "text-xl font-bold", children: inProgressCount })] })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4 flex items-center", children: [_jsx("div", { className: "h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3", children: _jsx(CheckCircle, { className: "h-5 w-5 text-green-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: "Resueltos" }), _jsx("h3", { className: "text-xl font-bold", children: resolvedCount })] })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4 flex items-center", children: [_jsx("div", { className: "h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3", children: _jsx(X, { className: "h-5 w-5 text-gray-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: "Cerrados" }), _jsx("h3", { className: "text-xl font-bold", children: closedCount })] })] }) })] }), _jsx(Card, { className: "mb-6", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [_jsxs("div", { className: "relative flex-grow", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx(Input, { placeholder: "Buscar por t\u00EDtulo, descripci\u00F3n, ubicaci\u00F3n...", className: "pl-10", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsxs(Select, { value: statusFilter, onValueChange: (value) => setStatusFilter(value), children: [_jsx(SelectTrigger, { className: "w-full md:w-32", children: _jsx(SelectValue, { placeholder: "Estado" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "Todos" }), _jsx(SelectItem, { value: "reported", children: "Reportados" }), _jsx(SelectItem, { value: "in_progress", children: "En proceso" }), _jsx(SelectItem, { value: "resolved", children: "Resueltos" }), _jsx(SelectItem, { value: "closed", children: "Cerrados" })] })] }), _jsxs(Select, { value: categoryFilter, onValueChange: (value) => setCategoryFilter(value), children: [_jsx(SelectTrigger, { className: "w-full md:w-36", children: _jsx(SelectValue, { placeholder: "Categor\u00EDa" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "Todas" }), _jsx(SelectItem, { value: "security", children: "Seguridad" }), _jsx(SelectItem, { value: "maintenance", children: "Mantenimiento" }), _jsx(SelectItem, { value: "emergency", children: "Emergencia" }), _jsx(SelectItem, { value: "other", children: "Otro" })] })] }), _jsxs(Select, { value: priorityFilter, onValueChange: (value) => setPriorityFilter(value), children: [_jsx(SelectTrigger, { className: "w-full md:w-32", children: _jsx(SelectValue, { placeholder: "Prioridad" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "Todas" }), _jsx(SelectItem, { value: "low", children: "Baja" }), _jsx(SelectItem, { value: "medium", children: "Media" }), _jsx(SelectItem, { value: "high", children: "Alta" }), _jsx(SelectItem, { value: "critical", children: "Cr\u00EDtica" })] })] })] })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-0", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "T\u00EDtulo" }), _jsx(TableHead, { children: "Categor\u00EDa" }), _jsx(TableHead, { children: "Prioridad" }), _jsx(TableHead, { children: "Ubicaci\u00F3n" }), _jsx(TableHead, { children: "Reportado" }), _jsx(TableHead, { children: "Estado" }), _jsx(TableHead, { className: "text-right", children: "Acciones" })] }) }), _jsx(TableBody, { children: filteredIncidents.length > 0 ? (filteredIncidents.map((incident) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium", children: incident.title }), _jsx(TableCell, { children: _jsx(Badge, { className: getCategoryColor(incident.category), children: getCategoryText(incident.category) }) }), _jsx(TableCell, { children: _jsx(Badge, { className: getPriorityColor(incident.priority), children: getPriorityText(incident.priority) }) }), _jsx(TableCell, { children: incident.location }), _jsx(TableCell, { children: _jsxs("div", { className: "text-sm", children: [_jsx("div", { children: formatDate(incident.reportedAt) }), _jsx("div", { className: "text-gray-500", children: incident.reportedBy })] }) }), _jsx(TableCell, { children: _jsx(Badge, { className: getStatusColor(incident.status), children: getStatusText(incident.status) }) }), _jsx(TableCell, { className: "text-right", children: _jsxs("div", { className: "flex justify-end gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: () => setSelectedIncident(incident), children: [_jsx(Eye, { className: "mr-1 h-4 w-4" }), "Ver"] }), incident.status !== 'closed' && (_jsxs(Button, { variant: "default", size: "sm", onClick: () => handleOpenUpdateDialog(incident), children: [_jsx(PlusCircle, { className: "mr-1 h-4 w-4" }), "Actualizar"] }))] }) })] }, incident.id)))) : (_jsx(TableRow, { children: _jsxs(TableCell, { colSpan: 7, className: "text-center py-12 text-gray-500", children: [_jsx(AlertTriangle, { className: "h-12 w-12 mx-auto mb-4 text-gray-400" }), _jsx("h3", { className: "text-lg font-medium mb-2", children: "No se encontraron incidentes" }), _jsx("p", { children: "No hay incidentes que coincidan con los filtros seleccionados" })] }) })) })] }) }) }), selectedIncident && (_jsx(Dialog, { open: !!selectedIncident, onOpenChange: (open) => !open && setSelectedIncident(null), children: _jsxs(DialogContent, { className: "sm:max-w-3xl", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center", children: [_jsx("span", { className: "mr-2", children: selectedIncident.title }), _jsx(Badge, { className: getStatusColor(selectedIncident.status), children: getStatusText(selectedIncident.status) })] }), _jsxs(DialogDescription, { children: ["Detalles del incidente reportado el ", formatDate(selectedIncident.reportedAt)] })] }), _jsxs("div", { className: "space-y-6 py-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 mb-1", children: "Categor\u00EDa" }), _jsx(Badge, { className: getCategoryColor(selectedIncident.category), children: getCategoryText(selectedIncident.category) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 mb-1", children: "Prioridad" }), _jsx(Badge, { className: getPriorityColor(selectedIncident.priority), children: getPriorityText(selectedIncident.priority) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 mb-1", children: "Ubicaci\u00F3n" }), _jsxs("p", { className: "flex items-center", children: [_jsx(MapPin, { className: "h-4 w-4 mr-1 text-gray-500" }), selectedIncident.location] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 mb-1", children: "Reportado por" }), _jsxs("p", { className: "flex items-center", children: [_jsx(User, { className: "h-4 w-4 mr-1 text-gray-500" }), selectedIncident.reportedBy] })] }), selectedIncident.assignedTo && (_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 mb-1", children: "Asignado a" }), _jsxs("p", { className: "flex items-center", children: [_jsx(User, { className: "h-4 w-4 mr-1 text-gray-500" }), selectedIncident.assignedTo] })] })), selectedIncident.resolvedAt && (_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 mb-1", children: "Resuelto el" }), _jsxs("p", { className: "flex items-center", children: [_jsx(Calendar, { className: "h-4 w-4 mr-1 text-gray-500" }), formatDate(selectedIncident.resolvedAt)] })] }))] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 mb-1", children: "Descripci\u00F3n" }), _jsx("p", { className: "bg-gray-50 p-3 rounded-md", children: selectedIncident.description })] }), selectedIncident.attachments.length > 0 && (_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 mb-2", children: "Archivos adjuntos" }), _jsx("div", { className: "flex flex-wrap gap-2", children: selectedIncident.attachments.map(attachment => (_jsxs("div", { className: "bg-gray-50 border rounded-md px-3 py-2 flex items-center text-sm", children: [_jsx(FileText, { className: "h-4 w-4 mr-2 text-indigo-600" }), _jsx("span", { className: "truncate max-w-[150px]", children: attachment.name }), _jsx(Button, { variant: "ghost", size: "sm", className: "ml-2 h-6 w-6 p-0 text-gray-500", onClick: () => window.open(attachment.url, '_blank'), children: _jsx(Eye, { className: "h-4 w-4" }) })] }, attachment.id))) })] })), selectedIncident.updates.length > 0 && (_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 mb-2", children: "Historial de actualizaciones" }), _jsx("div", { className: "space-y-4", children: selectedIncident.updates.map((update, index) => (_jsxs("div", { className: "bg-gray-50 p-3 rounded-md", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("span", { className: "font-medium", children: update.author }), _jsx("span", { className: "text-xs text-gray-500", children: formatDate(update.timestamp) })] }), _jsx("p", { className: "mb-2", children: update.content }), update.attachments.length > 0 && (_jsx("div", { className: "mt-2", children: _jsx("div", { className: "flex flex-wrap gap-2", children: update.attachments.map(attachment => (_jsxs("div", { className: "bg-white border rounded-md px-2 py-1 flex items-center text-xs", children: [_jsx(FileText, { className: "h-3 w-3 mr-1 text-indigo-600" }), _jsx("span", { className: "truncate max-w-[100px]", children: attachment.name }), _jsx(Button, { variant: "ghost", size: "sm", className: "ml-1 h-5 w-5 p-0 text-gray-500", onClick: () => window.open(attachment.url, '_blank'), children: _jsx(Eye, { className: "h-3 w-3" }) })] }, attachment.id))) }) }))] }, update.id))) })] }))] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setSelectedIncident(null), children: "Cerrar" }), selectedIncident.status !== 'closed' && (_jsxs(Button, { onClick: () => {
                                        setSelectedIncident(null);
                                        handleOpenUpdateDialog(selectedIncident);
                                    }, children: [_jsx(PlusCircle, { className: "mr-2 h-4 w-4" }), "Actualizar"] }))] })] }) })), _jsx(Dialog, { open: isRegisterDialogOpen, onOpenChange: setIsRegisterDialogOpen, children: _jsxs(DialogContent, { className: "sm:max-w-lg", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Registrar Nuevo Incidente" }), _jsx(DialogDescription, { children: "Complete la informaci\u00F3n para registrar un nuevo incidente" })] }), _jsxs("div", { className: "space-y-4 py-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "title", children: "T\u00EDtulo" }), _jsx(Input, { id: "title", placeholder: "T\u00EDtulo breve y descriptivo", value: newIncidentForm.title, onChange: (e) => handleNewIncidentFormChange('title', e.target.value) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "category", children: "Categor\u00EDa" }), _jsxs(Select, { value: newIncidentForm.category, onValueChange: (value) => handleNewIncidentFormChange('category', value), children: [_jsx(SelectTrigger, { id: "category", children: _jsx(SelectValue, { placeholder: "Seleccione categor\u00EDa" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "security", children: "Seguridad" }), _jsx(SelectItem, { value: "maintenance", children: "Mantenimiento" }), _jsx(SelectItem, { value: "emergency", children: "Emergencia" }), _jsx(SelectItem, { value: "other", children: "Otro" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "priority", children: "Prioridad" }), _jsxs(Select, { value: newIncidentForm.priority, onValueChange: (value) => handleNewIncidentFormChange('priority', value), children: [_jsx(SelectTrigger, { id: "priority", children: _jsx(SelectValue, { placeholder: "Seleccione prioridad" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "low", children: "Baja" }), _jsx(SelectItem, { value: "medium", children: "Media" }), _jsx(SelectItem, { value: "high", children: "Alta" }), _jsx(SelectItem, { value: "critical", children: "Cr\u00EDtica" })] })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "location", children: "Ubicaci\u00F3n" }), _jsx(Input, { id: "location", placeholder: "Ubicaci\u00F3n espec\u00EDfica del incidente", value: newIncidentForm.location, onChange: (e) => handleNewIncidentFormChange('location', e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "reportedBy", children: "Reportado por" }), _jsx(Input, { id: "reportedBy", placeholder: "Nombre de quien reporta", value: newIncidentForm.reportedBy, onChange: (e) => handleNewIncidentFormChange('reportedBy', e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "description", children: "Descripci\u00F3n" }), _jsx(Textarea, { id: "description", placeholder: "Descripci\u00F3n detallada del incidente", rows: 4, value: newIncidentForm.description, onChange: (e) => handleNewIncidentFormChange('description', e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Archivos adjuntos (Opcional)" }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs(Button, { variant: "outline", onClick: handleTakePhoto, children: [_jsx(Camera, { className: "mr-2 h-4 w-4" }), "Tomar Foto"] }), _jsx("div", { className: "text-sm text-gray-500", children: "o" }), _jsx("input", { type: "file", multiple: true, className: "hidden", id: "file-upload", onChange: (e) => handleFileUpload(e, 'new') }), _jsx("label", { htmlFor: "file-upload", children: _jsx(Button, { variant: "outline", type: "button", className: "cursor-pointer", children: "Subir Archivos" }) })] }), newIncidentForm.attachments.length > 0 && (_jsx("div", { className: "mt-2 space-y-2", children: newIncidentForm.attachments.map((file, index) => (_jsxs("div", { className: "bg-gray-50 border rounded-md px-3 py-2 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(FileText, { className: "h-4 w-4 mr-2 text-indigo-600" }), _jsx("span", { className: "text-sm truncate max-w-[200px]", children: file.name }), _jsxs("span", { className: "text-xs text-gray-500 ml-2", children: ["(", (file.size / 1024).toFixed(1), " KB)"] })] }), _jsx(Button, { variant: "ghost", size: "sm", className: "h-6 w-6 p-0 text-gray-500", onClick: () => handleRemoveFile(index, 'new'), children: _jsx(X, { className: "h-4 w-4" }) })] }, index))) }))] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setIsRegisterDialogOpen(false), children: "Cancelar" }), _jsx(Button, { onClick: handleSubmitNewIncident, disabled: isSubmitting || !newIncidentForm.title || !newIncidentForm.description || !newIncidentForm.location || !newIncidentForm.reportedBy, children: isSubmitting ? 'Registrando...' : 'Registrar Incidente' })] })] }) }), _jsx(Dialog, { open: isUpdateDialogOpen, onOpenChange: setIsUpdateDialogOpen, children: _jsxs(DialogContent, { className: "sm:max-w-lg", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Actualizar Incidente" }), _jsx(DialogDescription, { children: "Agregue una actualizaci\u00F3n al incidente seleccionado" })] }), selectedIncident && (_jsxs("div", { className: "space-y-4 py-4", children: [_jsxs("div", { className: "bg-gray-50 p-4 rounded-md mb-4", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("h3", { className: "font-medium", children: selectedIncident.title }), _jsx(Badge, { className: getCategoryColor(selectedIncident.category), children: getCategoryText(selectedIncident.category) })] }), _jsx("div", { className: "text-sm text-gray-700 mb-2", children: selectedIncident.description.length > 100
                                                ? `${selectedIncident.description.substring(0, 100)}...`
                                                : selectedIncident.description }), _jsxs("div", { className: "flex justify-between items-center text-xs text-gray-500", children: [_jsx("span", { children: selectedIncident.location }), _jsx("span", { children: formatDate(selectedIncident.reportedAt) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "updateContent", children: "Actualizaci\u00F3n" }), _jsx(Textarea, { id: "updateContent", placeholder: "Describa la actualizaci\u00F3n o seguimiento del incidente", rows: 4, value: updateForm.content, onChange: (e) => handleUpdateFormChange('content', e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "updateStatus", children: "Estado" }), _jsxs(Select, { value: updateForm.status, onValueChange: (value) => handleUpdateFormChange('status', value), children: [_jsx(SelectTrigger, { id: "updateStatus", children: _jsx(SelectValue, { placeholder: "Seleccione estado" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "reported", children: "Reportado" }), _jsx(SelectItem, { value: "in_progress", children: "En proceso" }), _jsx(SelectItem, { value: "resolved", children: "Resuelto" }), _jsx(SelectItem, { value: "closed", children: "Cerrado" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Archivos adjuntos (Opcional)" }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs(Button, { variant: "outline", onClick: handleTakePhoto, children: [_jsx(Camera, { className: "mr-2 h-4 w-4" }), "Tomar Foto"] }), _jsx("div", { className: "text-sm text-gray-500", children: "o" }), _jsx("input", { type: "file", multiple: true, className: "hidden", id: "update-file-upload", onChange: (e) => handleFileUpload(e, 'update') }), _jsx("label", { htmlFor: "update-file-upload", children: _jsx(Button, { variant: "outline", type: "button", className: "cursor-pointer", children: "Subir Archivos" }) })] }), updateForm.attachments.length > 0 && (_jsx("div", { className: "mt-2 space-y-2", children: updateForm.attachments.map((file, index) => (_jsxs("div", { className: "bg-gray-50 border rounded-md px-3 py-2 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(FileText, { className: "h-4 w-4 mr-2 text-indigo-600" }), _jsx("span", { className: "text-sm truncate max-w-[200px]", children: file.name }), _jsxs("span", { className: "text-xs text-gray-500 ml-2", children: ["(", (file.size / 1024).toFixed(1), " KB)"] })] }), _jsx(Button, { variant: "ghost", size: "sm", className: "h-6 w-6 p-0 text-gray-500", onClick: () => handleRemoveFile(index, 'update'), children: _jsx(X, { className: "h-4 w-4" }) })] }, index))) }))] })] })), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setIsUpdateDialogOpen(false), children: "Cancelar" }), _jsx(Button, { onClick: handleUpdateIncident, disabled: isSubmitting || !updateForm.content, children: isSubmitting ? 'Actualizando...' : 'Guardar Actualización' })] })] }) })] }));
}
