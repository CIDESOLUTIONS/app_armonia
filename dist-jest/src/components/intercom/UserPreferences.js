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
import { Box, Button, Card, CardContent, CircularProgress, Divider, FormControl, FormControlLabel, FormGroup, Grid, MenuItem, Select, Snackbar, Alert, Switch, TextField, Typography, Chip } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Settings, WhatsApp, Telegram, Notifications, AccessTime } from '@mui/icons-material';
import { intercomService } from '../../lib/services/intercom-service';
// Esquema de validación
const schema = yup.object({
    whatsappEnabled: yup.boolean(),
    whatsappNumber: yup.string().when('whatsappEnabled', {
        is: true,
        then: yup.string().required('El número de WhatsApp es obligatorio').matches(/^\+?[0-9]{10,15}$/, 'Formato de teléfono inválido'),
        otherwise: yup.string()
    }),
    telegramEnabled: yup.boolean(),
    telegramUsername: yup.string().when('telegramEnabled', {
        is: true,
        then: yup.string().required('El usuario de Telegram es obligatorio'),
        otherwise: yup.string()
    }),
    notifyAllVisitors: yup.boolean(),
    quietHoursEnabled: yup.boolean()
}).required();
const UserPreferences = () => {
    // Estados
    const [visitorTypes, setVisitorTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'info'
    });
    // Configuración del formulario
    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            whatsappEnabled: true,
            whatsappNumber: '',
            telegramEnabled: false,
            telegramUsername: '',
            telegramChatId: '',
            notifyAllVisitors: true,
            allowedVisitorTypes: [],
            autoApproveTypes: [],
            quietHoursEnabled: false,
            quietHoursStart: null,
            quietHoursEnd: null
        }
    });
    // Observar cambios en campos relevantes
    const watchWhatsappEnabled = watch('whatsappEnabled');
    const watchTelegramEnabled = watch('telegramEnabled');
    const watchNotifyAllVisitors = watch('notifyAllVisitors');
    // Cargar datos iniciales
    useEffect(() => {
        const fetchData = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // En un caso real, estos datos vendrían de la API
                const typesResponse = yield fetch('/api/intercom/visitor-types');
                const typesData = yield typesResponse.json();
                setVisitorTypes(typesData);
                // Cargar preferencias del usuario
                const userId = 1; // En un caso real, esto vendría del contexto de autenticación
                const preferences = yield intercomService.getUserPreferences(userId);
                if (preferences) {
                    setValue('whatsappEnabled', preferences.whatsappEnabled);
                    setValue('whatsappNumber', preferences.whatsappNumber || '');
                    setValue('telegramEnabled', preferences.telegramEnabled);
                    setValue('telegramUsername', preferences.telegramUsername || '');
                    setValue('telegramChatId', preferences.telegramChatId || '');
                    setValue('notifyAllVisitors', preferences.notifyAllVisitors);
                    setValue('allowedVisitorTypes', preferences.allowedVisitorTypes || []);
                    setValue('autoApproveTypes', preferences.autoApproveTypes || []);
                    // Configurar horas de silencio
                    if (preferences.quietHoursStart && preferences.quietHoursEnd) {
                        setQuietHoursEnabled(true);
                        setValue('quietHoursEnabled', true);
                        // Convertir strings HH:MM a objetos Date
                        const [startHour, startMinute] = preferences.quietHoursStart.split(':').map(Number);
                        const [endHour, endMinute] = preferences.quietHoursEnd.split(':').map(Number);
                        const startDate = new Date();
                        startDate.setHours(startHour, startMinute, 0);
                        setValue('quietHoursStart', startDate);
                        const endDate = new Date();
                        endDate.setHours(endHour, endMinute, 0);
                        setValue('quietHoursEnd', endDate);
                    }
                }
            }
            catch (error) {
                console.error('Error al cargar datos:', error);
                setNotification({
                    open: true,
                    message: 'Error al cargar preferencias',
                    severity: 'error'
                });
            }
            finally {
                setLoadingData(false);
            }
        });
        fetchData();
    }, [setValue]);
    // Manejar envío del formulario
    const onSubmit = (data) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        try {
            // Formatear horas de silencio
            if (data.quietHoursEnabled && data.quietHoursStart && data.quietHoursEnd) {
                const formatTime = (date) => {
                    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                };
                data.quietHoursStart = formatTime(data.quietHoursStart);
                data.quietHoursEnd = formatTime(data.quietHoursEnd);
            }
            else {
                data.quietHoursStart = null;
                data.quietHoursEnd = null;
            }
            // Guardar preferencias
            const userId = 1; // En un caso real, esto vendría del contexto de autenticación
            yield intercomService.updateUserPreferences(userId, data);
            // Mostrar notificación de éxito
            setNotification({
                open: true,
                message: 'Preferencias guardadas correctamente',
                severity: 'success'
            });
        }
        catch (error) {
            console.error('Error al guardar preferencias:', error);
            setNotification({
                open: true,
                message: 'Error al guardar las preferencias',
                severity: 'error'
            });
        }
        finally {
            setLoading(false);
        }
    });
    // Cerrar notificación
    const handleCloseNotification = () => {
        setNotification(Object.assign(Object.assign({}, notification), { open: false }));
    };
    // Manejar cambio en horas de silencio
    const handleQuietHoursChange = (event) => {
        setQuietHoursEnabled(event.target.checked);
        setValue('quietHoursEnabled', event.target.checked);
        if (event.target.checked) {
            // Establecer valores por defecto
            const startDate = new Date();
            startDate.setHours(22, 0, 0);
            setValue('quietHoursStart', startDate);
            const endDate = new Date();
            endDate.setHours(7, 0, 0);
            setValue('quietHoursEnd', endDate);
        }
        else {
            setValue('quietHoursStart', null);
            setValue('quietHoursEnd', null);
        }
    };
    if (loadingData) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px", children: _jsx(CircularProgress, {}) }));
    }
    return (_jsxs(Card, { elevation: 3, children: [_jsxs(CardContent, { children: [_jsxs(Typography, { variant: "h5", component: "h2", gutterBottom: true, children: [_jsx(Settings, { sx: { mr: 1, verticalAlign: 'middle' } }), "Preferencias de Citofon\u00EDa Virtual"] }), _jsx("form", { onSubmit: handleSubmit(onSubmit), children: _jsxs(Grid, { container: true, spacing: 3, children: [_jsxs(Grid, { item: true, xs: 12, children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [_jsx(WhatsApp, { sx: { mr: 1, verticalAlign: 'middle' } }), "Configuraci\u00F3n de WhatsApp"] }), _jsx(FormGroup, { children: _jsx(Controller, { name: "whatsappEnabled", control: control, render: ({ field }) => (_jsx(FormControlLabel, { control: _jsx(Switch, { checked: field.value, onChange: field.onChange }), label: "Recibir notificaciones por WhatsApp" })) }) }), watchWhatsappEnabled && (_jsx(Box, { mt: 2, children: _jsx(Controller, { name: "whatsappNumber", control: control, render: ({ field }) => {
                                                    var _a;
                                                    return (_jsx(TextField, Object.assign({}, field, { label: "N\u00FAmero de WhatsApp", variant: "outlined", fullWidth: true, placeholder: "+573001234567", error: !!errors.whatsappNumber, helperText: (_a = errors.whatsappNumber) === null || _a === void 0 ? void 0 : _a.message })));
                                                } }) }))] }), _jsx(Grid, { item: true, xs: 12, children: _jsx(Divider, {}) }), _jsxs(Grid, { item: true, xs: 12, children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [_jsx(Telegram, { sx: { mr: 1, verticalAlign: 'middle' } }), "Configuraci\u00F3n de Telegram"] }), _jsx(FormGroup, { children: _jsx(Controller, { name: "telegramEnabled", control: control, render: ({ field }) => (_jsx(FormControlLabel, { control: _jsx(Switch, { checked: field.value, onChange: field.onChange }), label: "Recibir notificaciones por Telegram" })) }) }), watchTelegramEnabled && (_jsxs(Box, { mt: 2, children: [_jsx(Controller, { name: "telegramUsername", control: control, render: ({ field }) => {
                                                        var _a;
                                                        return (_jsx(TextField, Object.assign({}, field, { label: "Usuario de Telegram", variant: "outlined", fullWidth: true, placeholder: "@usuario", error: !!errors.telegramUsername, helperText: (_a = errors.telegramUsername) === null || _a === void 0 ? void 0 : _a.message })));
                                                    } }), _jsx(Typography, { variant: "caption", color: "textSecondary", sx: { display: 'block', mt: 1 }, children: "Para vincular tu cuenta, env\u00EDa un mensaje al bot @ArmoniaIntercomBot con el comando /start" })] }))] }), _jsx(Grid, { item: true, xs: 12, children: _jsx(Divider, {}) }), _jsxs(Grid, { item: true, xs: 12, children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [_jsx(Notifications, { sx: { mr: 1, verticalAlign: 'middle' } }), "Preferencias de Notificaci\u00F3n"] }), _jsx(FormGroup, { children: _jsx(Controller, { name: "notifyAllVisitors", control: control, render: ({ field }) => (_jsx(FormControlLabel, { control: _jsx(Switch, { checked: field.value, onChange: field.onChange }), label: "Notificarme sobre todos los visitantes" })) }) }), !watchNotifyAllVisitors && (_jsxs(Box, { mt: 2, children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "Tipos de visitantes permitidos sin notificaci\u00F3n:" }), _jsx(Controller, { name: "allowedVisitorTypes", control: control, render: ({ field }) => (_jsx(FormControl, { fullWidth: true, children: _jsxs(Select, Object.assign({}, field, { multiple: true, displayEmpty: true, renderValue: (selected) => {
                                                                if (selected.length === 0) {
                                                                    return _jsx("em", { children: "Seleccione tipos de visitantes" });
                                                                }
                                                                return (_jsx(Box, { sx: { display: 'flex', flexWrap: 'wrap', gap: 0.5 }, children: selected.map((value) => {
                                                                        const type = visitorTypes.find(t => t.id === value);
                                                                        return (_jsx(Chip, { label: (type === null || type === void 0 ? void 0 : type.name) || value }, value));
                                                                    }) }));
                                                            }, children: [_jsx(MenuItem, { disabled: true, value: "", children: _jsx("em", { children: "Seleccione tipos de visitantes" }) }), visitorTypes.map((type) => (_jsx(MenuItem, { value: type.id, children: type.name }, type.id)))] })) })) })] })), _jsxs(Box, { mt: 3, children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "Tipos de visitantes con aprobaci\u00F3n autom\u00E1tica:" }), _jsx(Controller, { name: "autoApproveTypes", control: control, render: ({ field }) => (_jsx(FormControl, { fullWidth: true, children: _jsxs(Select, Object.assign({}, field, { multiple: true, displayEmpty: true, renderValue: (selected) => {
                                                                if (selected.length === 0) {
                                                                    return _jsx("em", { children: "Seleccione tipos de visitantes" });
                                                                }
                                                                return (_jsx(Box, { sx: { display: 'flex', flexWrap: 'wrap', gap: 0.5 }, children: selected.map((value) => {
                                                                        const type = visitorTypes.find(t => t.id === value);
                                                                        return (_jsx(Chip, { label: (type === null || type === void 0 ? void 0 : type.name) || value }, value));
                                                                    }) }));
                                                            }, children: [_jsx(MenuItem, { disabled: true, value: "", children: _jsx("em", { children: "Seleccione tipos de visitantes" }) }), visitorTypes.map((type) => (_jsx(MenuItem, { value: type.id, children: type.name }, type.id)))] })) })) })] })] }), _jsx(Grid, { item: true, xs: 12, children: _jsx(Divider, {}) }), _jsxs(Grid, { item: true, xs: 12, children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [_jsx(AccessTime, { sx: { mr: 1, verticalAlign: 'middle' } }), "Horas de Silencio"] }), _jsx(FormGroup, { children: _jsx(FormControlLabel, { control: _jsx(Switch, { checked: quietHoursEnabled, onChange: handleQuietHoursChange }), label: "Activar horas de silencio" }) }), quietHoursEnabled && (_jsx(LocalizationProvider, { dateAdapter: AdapterDateFns, adapterLocale: es, children: _jsxs(Box, { mt: 2, children: [_jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(Controller, { name: "quietHoursStart", control: control, render: ({ field }) => (_jsx(TimePicker, { label: "Hora de inicio", value: field.value, onChange: field.onChange, slotProps: {
                                                                            textField: {
                                                                                fullWidth: true,
                                                                                variant: 'outlined'
                                                                            }
                                                                        } })) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(Controller, { name: "quietHoursEnd", control: control, render: ({ field }) => (_jsx(TimePicker, { label: "Hora de fin", value: field.value, onChange: field.onChange, slotProps: {
                                                                            textField: {
                                                                                fullWidth: true,
                                                                                variant: 'outlined'
                                                                            }
                                                                        } })) }) })] }), _jsx(Typography, { variant: "caption", color: "textSecondary", sx: { display: 'block', mt: 1 }, children: "Durante este per\u00EDodo no recibir\u00E1s notificaciones de visitantes" })] }) }))] }), _jsx(Grid, { item: true, xs: 12, children: _jsx(Box, { display: "flex", justifyContent: "flex-end", mt: 2, children: _jsx(Button, { type: "submit", variant: "contained", color: "primary", disabled: loading, children: loading ? (_jsxs(_Fragment, { children: [_jsx(CircularProgress, { size: 24, sx: { mr: 1 } }), "Guardando..."] })) : ('Guardar Preferencias') }) }) })] }) })] }), _jsx(Snackbar, { open: notification.open, autoHideDuration: 6000, onClose: handleCloseNotification, anchorOrigin: { vertical: 'bottom', horizontal: 'right' }, children: _jsx(Alert, { onClose: handleCloseNotification, severity: notification.severity, variant: "filled", children: notification.message }) })] }));
};
export default UserPreferences;
