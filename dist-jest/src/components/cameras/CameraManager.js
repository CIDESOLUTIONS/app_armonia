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
import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, Tooltip, FormControlLabel, Checkbox, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Videocam as VideocamIcon, VideocamOff as VideocamOffIcon, Refresh as RefreshIcon, PhotoCamera as PhotoCameraIcon, Visibility as VisibilityIcon, Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Search as SearchIcon, FiberManualRecord as RecordIcon, Stop as StopIcon, Close as CloseIcon } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
/**
 * Componente principal para la gestión de cámaras IP
 */
const CameraManager = () => {
    const { data: session } = useSession();
    const [cameras, setCameras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCamera, setSelectedCamera] = useState(null);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openDiscoverDialog, setOpenDiscoverDialog] = useState(false);
    const [discoveredCameras, setDiscoveredCameras] = useState([]);
    const [discoveringCameras, setDiscoveringCameras] = useState(false);
    const [cameraFormData, setCameraFormData] = useState({
        name: '',
        description: '',
        ipAddress: '',
        port: 554,
        username: '',
        password: '',
        zoneId: '',
        ptzEnabled: false,
        recordingEnabled: false,
        motionDetection: false
    });
    const [zones, setZones] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    // Verificar si el usuario es administrador
    useEffect(() => {
        if (session && session.user) {
            setIsAdmin(session.user.role === 'ADMIN');
        }
    }, [session]);
    // Cargar cámaras al iniciar
    useEffect(() => {
        fetchCameras();
        fetchZones();
    }, []);
    // Obtener cámaras
    const fetchCameras = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setLoading(true);
            const response = yield axios.get('/api/cameras');
            setCameras(response.data);
        }
        catch (error) {
            console.error('Error al obtener cámaras:', error);
            toast.error('Error al cargar cámaras');
        }
        finally {
            setLoading(false);
        }
    });
    // Obtener zonas
    const fetchZones = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield axios.get('/api/zones');
            setZones(response.data);
        }
        catch (error) {
            console.error('Error al obtener zonas:', error);
        }
    });
    // Refrescar estado de cámaras
    const refreshCameraStatus = (cameraId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setRefreshing(true);
            yield axios.post(`/api/cameras/${cameraId}/status`);
            yield fetchCameras();
            toast.success('Estado de cámara actualizado');
        }
        catch (error) {
            console.error('Error al actualizar estado:', error);
            toast.error('Error al actualizar estado de cámara');
        }
        finally {
            setRefreshing(false);
        }
    });
    // Descubrir cámaras en la red
    const discoverCameras = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setDiscoveringCameras(true);
            const response = yield axios.post('/api/cameras/discover');
            setDiscoveredCameras(response.data.cameras);
        }
        catch (error) {
            console.error('Error al descubrir cámaras:', error);
            toast.error('Error al descubrir cámaras en la red');
        }
        finally {
            setDiscoveringCameras(false);
        }
    });
    // Añadir cámara descubierta
    const addDiscoveredCamera = (camera) => __awaiter(void 0, void 0, void 0, function* () {
        setCameraFormData({
            name: camera.name || 'Nueva cámara',
            description: `${camera.manufacturer || ''} ${camera.model || ''}`.trim(),
            ipAddress: camera.ipAddress,
            port: 554,
            username: '',
            password: '',
            zoneId: '',
            ptzEnabled: false,
            recordingEnabled: false,
            motionDetection: false,
            onvifUrl: camera.onvifUrl
        });
        setOpenDiscoverDialog(false);
        setOpenAddDialog(true);
    });
    // Manejar cambios en formulario
    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCameraFormData(Object.assign(Object.assign({}, cameraFormData), { [name]: type === 'checkbox' ? checked : value }));
    };
    // Crear nueva cámara
    const handleCreateCamera = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            yield axios.post('/api/cameras', cameraFormData);
            toast.success('Cámara creada correctamente');
            setOpenAddDialog(false);
            fetchCameras();
        }
        catch (error) {
            console.error('Error al crear cámara:', error);
            toast.error(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || 'Error al crear cámara');
        }
    });
    // Actualizar cámara
    const handleUpdateCamera = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            yield axios.put(`/api/cameras/${selectedCamera.id}`, cameraFormData);
            toast.success('Cámara actualizada correctamente');
            setOpenEditDialog(false);
            fetchCameras();
        }
        catch (error) {
            console.error('Error al actualizar cámara:', error);
            toast.error(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || 'Error al actualizar cámara');
        }
    });
    // Eliminar cámara
    const handleDeleteCamera = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield axios.delete(`/api/cameras/${selectedCamera.id}`);
            toast.success('Cámara eliminada correctamente');
            setOpenDeleteDialog(false);
            fetchCameras();
        }
        catch (error) {
            console.error('Error al eliminar cámara:', error);
            toast.error('Error al eliminar cámara');
        }
    });
    // Tomar instantánea
    const handleTakeSnapshot = (cameraId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield axios.post(`/api/cameras/${cameraId}/snapshot`, {
                description: 'Instantánea manual'
            });
            toast.success('Instantánea tomada correctamente');
        }
        catch (error) {
            console.error('Error al tomar instantánea:', error);
            toast.error('Error al tomar instantánea');
        }
    });
    // Iniciar grabación
    const handleStartRecording = (cameraId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield axios.post(`/api/cameras/${cameraId}/recording/start`, {
                duration: 60 // 1 minuto por defecto
            });
            toast.success('Grabación iniciada');
            fetchCameras(); // Actualizar estado
        }
        catch (error) {
            console.error('Error al iniciar grabación:', error);
            toast.error('Error al iniciar grabación');
        }
    });
    // Detener grabación
    const handleStopRecording = (cameraId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield axios.post(`/api/cameras/${cameraId}/recording/stop`);
            toast.success('Grabación detenida');
            fetchCameras(); // Actualizar estado
        }
        catch (error) {
            console.error('Error al detener grabación:', error);
            toast.error('Error al detener grabación');
        }
    });
    // Abrir diálogo de edición
    const openEdit = (camera) => {
        setSelectedCamera(camera);
        setCameraFormData({
            name: camera.name,
            description: camera.description || '',
            ipAddress: camera.ipAddress,
            port: camera.port,
            username: camera.username || '',
            password: '********', // Placeholder para contraseña
            zoneId: camera.zoneId || '',
            ptzEnabled: camera.ptzEnabled,
            recordingEnabled: camera.recordingEnabled,
            motionDetection: camera.motionDetection
        });
        setOpenEditDialog(true);
    };
    // Abrir diálogo de visualización
    const openView = (camera) => {
        setSelectedCamera(camera);
        setOpenViewDialog(true);
    };
    // Abrir diálogo de eliminación
    const openDelete = (camera) => {
        setSelectedCamera(camera);
        setOpenDeleteDialog(true);
    };
    // Renderizar tarjeta de cámara
    const renderCameraCard = (camera) => {
        var _a;
        const isOnline = camera.status === 'ONLINE';
        const isRecording = (_a = camera.recordings) === null || _a === void 0 ? void 0 : _a.some(r => r.status === 'RECORDING');
        return (_jsxs(Card, { sx: {
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderLeft: isOnline ? '4px solid #4caf50' : '4px solid #f44336'
            }, children: [_jsxs(CardContent, { sx: { flexGrow: 1 }, children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1, children: [_jsx(Typography, { variant: "h6", component: "div", children: camera.name }), _jsx(Chip, { icon: isOnline ? _jsx(VideocamIcon, {}) : _jsx(VideocamOffIcon, {}), label: isOnline ? 'En línea' : 'Desconectada', color: isOnline ? 'success' : 'error', size: "small" })] }), _jsxs(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: ["IP: ", camera.ipAddress] }), camera.zone && (_jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["Zona: ", camera.zone.name] })), _jsxs(Box, { mt: 1, children: [camera.ptzEnabled && (_jsx(Chip, { label: "PTZ", size: "small", sx: { mr: 0.5, mb: 0.5 } })), camera.recordingEnabled && (_jsx(Chip, { label: "Grabaci\u00F3n", size: "small", sx: { mr: 0.5, mb: 0.5 } })), camera.motionDetection && (_jsx(Chip, { label: "Detecci\u00F3n de movimiento", size: "small", sx: { mr: 0.5, mb: 0.5 } })), isRecording && (_jsx(Chip, { icon: _jsx(RecordIcon, { sx: { color: 'red' } }), label: "Grabando", color: "error", size: "small", sx: { mr: 0.5, mb: 0.5 } }))] })] }), _jsxs(CardActions, { children: [_jsx(Tooltip, { title: "Ver c\u00E1mara", children: _jsx(IconButton, { size: "small", onClick: () => openView(camera), disabled: !isOnline, children: _jsx(VisibilityIcon, {}) }) }), _jsx(Tooltip, { title: "Tomar instant\u00E1nea", children: _jsx(IconButton, { size: "small", onClick: () => handleTakeSnapshot(camera.id), disabled: !isOnline, children: _jsx(PhotoCameraIcon, {}) }) }), isRecording ? (_jsx(Tooltip, { title: "Detener grabaci\u00F3n", children: _jsx(IconButton, { size: "small", onClick: () => handleStopRecording(camera.id), children: _jsx(StopIcon, {}) }) })) : (_jsx(Tooltip, { title: "Iniciar grabaci\u00F3n", children: _jsx(IconButton, { size: "small", onClick: () => handleStartRecording(camera.id), disabled: !isOnline || !camera.recordingEnabled, children: _jsx(RecordIcon, {}) }) })), _jsx(Tooltip, { title: "Actualizar estado", children: _jsx(IconButton, { size: "small", onClick: () => refreshCameraStatus(camera.id), disabled: refreshing, children: _jsx(RefreshIcon, {}) }) }), isAdmin && (_jsxs(_Fragment, { children: [_jsx(Tooltip, { title: "Editar", children: _jsx(IconButton, { size: "small", onClick: () => openEdit(camera), children: _jsx(EditIcon, {}) }) }), _jsx(Tooltip, { title: "Eliminar", children: _jsx(IconButton, { size: "small", onClick: () => openDelete(camera), children: _jsx(DeleteIcon, {}) }) })] }))] })] }, camera.id));
    };
    return (_jsxs(Box, { sx: { p: 3 }, children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, children: [_jsx(Typography, { variant: "h4", component: "h1", children: "Gesti\u00F3n de C\u00E1maras IP" }), _jsx(Box, { children: isAdmin && (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "outlined", startIcon: _jsx(SearchIcon, {}), onClick: () => setOpenDiscoverDialog(true), sx: { mr: 1 }, children: "Descubrir" }), _jsx(Button, { variant: "contained", startIcon: _jsx(AddIcon, {}), onClick: () => {
                                        setCameraFormData({
                                            name: '',
                                            description: '',
                                            ipAddress: '',
                                            port: 554,
                                            username: '',
                                            password: '',
                                            zoneId: '',
                                            ptzEnabled: false,
                                            recordingEnabled: false,
                                            motionDetection: false
                                        });
                                        setOpenAddDialog(true);
                                    }, children: "A\u00F1adir C\u00E1mara" })] })) })] }), loading ? (_jsx(Box, { display: "flex", justifyContent: "center", my: 4, children: _jsx(CircularProgress, {}) })) : cameras.length === 0 ? (_jsxs(Box, { sx: {
                    p: 4,
                    textAlign: 'center',
                    border: '1px dashed #ccc',
                    borderRadius: 2
                }, children: [_jsx(Typography, { variant: "h6", color: "text.secondary", gutterBottom: true, children: "No hay c\u00E1maras configuradas" }), isAdmin && (_jsx(Button, { variant: "outlined", startIcon: _jsx(AddIcon, {}), onClick: () => setOpenAddDialog(true), sx: { mt: 2 }, children: "A\u00F1adir C\u00E1mara" }))] })) : (_jsx(Grid, { container: true, spacing: 3, children: cameras.map((camera) => (_jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, lg: 3, children: renderCameraCard(camera) }, camera.id))) })), _jsx(Dialog, { open: openViewDialog, onClose: () => setOpenViewDialog(false), maxWidth: "md", fullWidth: true, children: selectedCamera && (_jsxs(_Fragment, { children: [_jsxs(DialogTitle, { children: [selectedCamera.name, _jsx(IconButton, { "aria-label": "close", onClick: () => setOpenViewDialog(false), sx: { position: 'absolute', right: 8, top: 8 }, children: _jsx(CloseIcon, {}) })] }), _jsxs(DialogContent, { children: [_jsx(Box, { sx: { position: 'relative', pt: '56.25%', mb: 2 }, children: _jsx(Box, { component: "img", src: `/api/cameras/${selectedCamera.id}/stream?quality=high&t=${Date.now()}`, alt: selectedCamera.name, sx: {
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            bgcolor: 'black'
                                        } }) }), selectedCamera.ptzEnabled && (_jsxs(Box, { sx: { mb: 2, textAlign: 'center' }, children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Control PTZ" }), _jsx(Box, { sx: { display: 'flex', justifyContent: 'center', gap: 1 }, children: _jsx(Button, { variant: "outlined", onClick: () => handlePtzControl(selectedCamera.id, 'move', { pan: 0, tilt: 1 }), children: "Arriba" }) }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'center', gap: 1, my: 1 }, children: [_jsx(Button, { variant: "outlined", onClick: () => handlePtzControl(selectedCamera.id, 'move', { pan: -1, tilt: 0 }), children: "Izquierda" }), _jsx(Button, { variant: "outlined", onClick: () => handlePtzControl(selectedCamera.id, 'stop'), children: "Stop" }), _jsx(Button, { variant: "outlined", onClick: () => handlePtzControl(selectedCamera.id, 'move', { pan: 1, tilt: 0 }), children: "Derecha" })] }), _jsx(Box, { sx: { display: 'flex', justifyContent: 'center', gap: 1 }, children: _jsx(Button, { variant: "outlined", onClick: () => handlePtzControl(selectedCamera.id, 'move', { pan: 0, tilt: -1 }), children: "Abajo" }) }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }, children: [_jsx(Button, { variant: "outlined", onClick: () => handlePtzControl(selectedCamera.id, 'zoom', { zoom: 1 }), children: "Zoom +" }), _jsx(Button, { variant: "outlined", onClick: () => handlePtzControl(selectedCamera.id, 'zoom', { zoom: -1 }), children: "Zoom -" })] })] })), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mt: 2 }, children: [_jsx(Button, { variant: "contained", startIcon: _jsx(PhotoCameraIcon, {}), onClick: () => handleTakeSnapshot(selectedCamera.id), children: "Tomar Instant\u00E1nea" }), selectedCamera.recordingEnabled && (_jsx(Button, { variant: "contained", color: selectedCamera.isRecording ? "error" : "primary", startIcon: selectedCamera.isRecording ? _jsx(StopIcon, {}) : _jsx(RecordIcon, {}), onClick: () => selectedCamera.isRecording
                                                ? handleStopRecording(selectedCamera.id)
                                                : handleStartRecording(selectedCamera.id), children: selectedCamera.isRecording ? "Detener Grabación" : "Iniciar Grabación" }))] })] })] })) }), _jsxs(Dialog, { open: openEditDialog, onClose: () => setOpenEditDialog(false), maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: "Editar C\u00E1mara" }), _jsxs(DialogContent, { children: [_jsx(TextField, { margin: "dense", label: "Nombre", name: "name", value: cameraFormData.name, onChange: handleFormChange, fullWidth: true, required: true }), _jsx(TextField, { margin: "dense", label: "Descripci\u00F3n", name: "description", value: cameraFormData.description, onChange: handleFormChange, fullWidth: true, multiline: true, rows: 2 }), _jsx(TextField, { margin: "dense", label: "Direcci\u00F3n IP", name: "ipAddress", value: cameraFormData.ipAddress, onChange: handleFormChange, fullWidth: true, required: true }), _jsx(TextField, { margin: "dense", label: "Puerto", name: "port", type: "number", value: cameraFormData.port, onChange: handleFormChange, fullWidth: true }), _jsx(TextField, { margin: "dense", label: "Usuario", name: "username", value: cameraFormData.username, onChange: handleFormChange, fullWidth: true }), _jsx(TextField, { margin: "dense", label: "Contrase\u00F1a", name: "password", type: "password", value: cameraFormData.password, onChange: handleFormChange, fullWidth: true, helperText: "Dejar en blanco para mantener la contrase\u00F1a actual" }), _jsxs(FormControl, { fullWidth: true, margin: "dense", children: [_jsx(InputLabel, { children: "Zona" }), _jsxs(Select, { name: "zoneId", value: cameraFormData.zoneId, onChange: handleFormChange, label: "Zona", children: [_jsx(MenuItem, { value: "", children: _jsx("em", { children: "Ninguna" }) }), zones.map((zone) => (_jsx(MenuItem, { value: zone.id, children: zone.name }, zone.id)))] })] }), _jsxs(Box, { sx: { mt: 2 }, children: [_jsx(FormControlLabel, { control: _jsx(Checkbox, { checked: cameraFormData.ptzEnabled, onChange: handleFormChange, name: "ptzEnabled" }), label: "Soporte PTZ" }), _jsx(FormControlLabel, { control: _jsx(Checkbox, { checked: cameraFormData.recordingEnabled, onChange: handleFormChange, name: "recordingEnabled" }), label: "Habilitar grabaci\u00F3n" }), _jsx(FormControlLabel, { control: _jsx(Checkbox, { checked: cameraFormData.motionDetection, onChange: handleFormChange, name: "motionDetection" }), label: "Detecci\u00F3n de movimiento" })] })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setOpenEditDialog(false), children: "Cancelar" }), _jsx(Button, { onClick: handleUpdateCamera, variant: "contained", children: "Guardar" })] })] }), _jsxs(Dialog, { open: openDeleteDialog, onClose: () => setOpenDeleteDialog(false), children: [_jsx(DialogTitle, { children: "Confirmar eliminaci\u00F3n" }), _jsx(DialogContent, { children: _jsxs(Typography, { children: ["\u00BFEst\u00E1 seguro de que desea eliminar la c\u00E1mara \"", selectedCamera === null || selectedCamera === void 0 ? void 0 : selectedCamera.name, "\"? Esta acci\u00F3n no se puede deshacer."] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setOpenDeleteDialog(false), children: "Cancelar" }), _jsx(Button, { onClick: handleDeleteCamera, color: "error", variant: "contained", children: "Eliminar" })] })] }), _jsxs(Dialog, { open: openAddDialog, onClose: () => setOpenAddDialog(false), maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: "A\u00F1adir C\u00E1mara" }), _jsxs(DialogContent, { children: [_jsx(TextField, { margin: "dense", label: "Nombre", name: "name", value: cameraFormData.name, onChange: handleFormChange, fullWidth: true, required: true }), _jsx(TextField, { margin: "dense", label: "Descripci\u00F3n", name: "description", value: cameraFormData.description, onChange: handleFormChange, fullWidth: true, multiline: true, rows: 2 }), _jsx(TextField, { margin: "dense", label: "Direcci\u00F3n IP", name: "ipAddress", value: cameraFormData.ipAddress, onChange: handleFormChange, fullWidth: true, required: true }), _jsx(TextField, { margin: "dense", label: "Puerto", name: "port", type: "number", value: cameraFormData.port, onChange: handleFormChange, fullWidth: true }), _jsx(TextField, { margin: "dense", label: "Usuario", name: "username", value: cameraFormData.username, onChange: handleFormChange, fullWidth: true }), _jsx(TextField, { margin: "dense", label: "Contrase\u00F1a", name: "password", type: "password", value: cameraFormData.password, onChange: handleFormChange, fullWidth: true }), _jsxs(FormControl, { fullWidth: true, margin: "dense", children: [_jsx(InputLabel, { children: "Zona" }), _jsxs(Select, { name: "zoneId", value: cameraFormData.zoneId, onChange: handleFormChange, label: "Zona", children: [_jsx(MenuItem, { value: "", children: _jsx("em", { children: "Ninguna" }) }), zones.map((zone) => (_jsx(MenuItem, { value: zone.id, children: zone.name }, zone.id)))] })] }), _jsxs(Box, { sx: { mt: 2 }, children: [_jsx(FormControlLabel, { control: _jsx(Checkbox, { checked: cameraFormData.ptzEnabled, onChange: handleFormChange, name: "ptzEnabled" }), label: "Soporte PTZ" }), _jsx(FormControlLabel, { control: _jsx(Checkbox, { checked: cameraFormData.recordingEnabled, onChange: handleFormChange, name: "recordingEnabled" }), label: "Habilitar grabaci\u00F3n" }), _jsx(FormControlLabel, { control: _jsx(Checkbox, { checked: cameraFormData.motionDetection, onChange: handleFormChange, name: "motionDetection" }), label: "Detecci\u00F3n de movimiento" })] })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setOpenAddDialog(false), children: "Cancelar" }), _jsx(Button, { onClick: handleCreateCamera, variant: "contained", children: "Crear" })] })] }), _jsxs(Dialog, { open: openDiscoverDialog, onClose: () => setOpenDiscoverDialog(false), maxWidth: "md", fullWidth: true, children: [_jsx(DialogTitle, { children: "Descubrir C\u00E1maras" }), _jsxs(DialogContent, { children: [_jsx(Box, { sx: { mb: 2 }, children: _jsx(Button, { variant: "contained", onClick: discoverCameras, disabled: discoveringCameras, startIcon: discoveringCameras ? _jsx(CircularProgress, { size: 20 }) : _jsx(SearchIcon, {}), children: discoveringCameras ? 'Buscando...' : 'Buscar cámaras en la red' }) }), discoveredCameras.length > 0 ? (_jsxs(Box, { children: [_jsxs(Typography, { variant: "subtitle1", gutterBottom: true, children: ["C\u00E1maras encontradas: ", discoveredCameras.length] }), _jsx(TableContainer, { component: Paper, children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Nombre" }), _jsx(TableCell, { children: "IP" }), _jsx(TableCell, { children: "Fabricante" }), _jsx(TableCell, { children: "Modelo" }), _jsx(TableCell, { children: "Acciones" })] }) }), _jsx(TableBody, { children: discoveredCameras.map((camera, index) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: camera.name || 'Cámara ONVIF' }), _jsx(TableCell, { children: camera.ipAddress }), _jsx(TableCell, { children: camera.manufacturer || '-' }), _jsx(TableCell, { children: camera.model || '-' }), _jsx(TableCell, { children: _jsx(Button, { size: "small", variant: "outlined", onClick: () => addDiscoveredCamera(camera), children: "A\u00F1adir" }) })] }, index))) })] }) })] })) : discoveringCameras ? (_jsxs(Box, { sx: { textAlign: 'center', py: 4 }, children: [_jsx(CircularProgress, {}), _jsx(Typography, { sx: { mt: 2 }, children: "Buscando c\u00E1maras en la red..." })] })) : (_jsx(Box, { sx: { textAlign: 'center', py: 4 }, children: _jsx(Typography, { color: "text.secondary", children: "Haga clic en \"Buscar c\u00E1maras en la red\" para descubrir c\u00E1maras ONVIF disponibles." }) }))] }), _jsx(DialogActions, { children: _jsx(Button, { onClick: () => setOpenDiscoverDialog(false), children: "Cerrar" }) })] })] }));
};
export default CameraManager;
