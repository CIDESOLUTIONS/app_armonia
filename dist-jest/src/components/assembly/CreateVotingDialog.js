import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormHelperText, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// Esquema de validación
const schema = yup.object({
    agendaPoint: yup.number().required('Seleccione un punto de la agenda'),
    title: yup.string().required('El título es obligatorio').max(100, 'Máximo 100 caracteres'),
    description: yup.string().max(500, 'Máximo 500 caracteres'),
    type: yup.string().required('Seleccione un tipo de votación'),
    options: yup.array().of(yup.string()).min(2, 'Debe haber al menos 2 opciones'),
    requiredPercentage: yup.number().when('type', {
        is: (val) => val === 'QUALIFIED_MAJORITY' || val === 'COEFFICIENT_BASED',
        then: yup.number().required('Porcentaje requerido').min(1, 'Mínimo 1%').max(100, 'Máximo 100%')
    }),
    baseForPercentage: yup.string().when('type', {
        is: (val) => val === 'QUALIFIED_MAJORITY',
        then: yup.string().required('Seleccione la base para el cálculo')
    })
});
// Tipos de votación
const votingTypes = [
    { value: 'SIMPLE_MAJORITY', label: 'Mayoría simple (>50% de los votos)' },
    { value: 'QUALIFIED_MAJORITY', label: 'Mayoría calificada (% configurable del total)' },
    { value: 'UNANIMOUS', label: 'Unanimidad (todos los votos a favor)' },
    { value: 'COEFFICIENT_BASED', label: 'Basado en coeficientes (% configurable)' }
];
// Bases para cálculo de porcentaje
const percentageBases = [
    { value: 'ATTENDEES', label: 'Asistentes presentes' },
    { value: 'TOTAL_COEFFICIENTS', label: 'Coeficientes totales del conjunto' }
];
// Componente para crear una nueva votación
const CreateVotingDialog = ({ open, onClose, onSubmit, agendaPoints }) => {
    const [optionType, setOptionType] = useState('simple');
    // Configuración del formulario
    const { control, handleSubmit, watch, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            agendaPoint: '',
            title: '',
            description: '',
            type: 'SIMPLE_MAJORITY',
            options: ['Sí', 'No', 'Abstención'],
            requiredPercentage: 70,
            baseForPercentage: 'ATTENDEES'
        }
    });
    // Observar cambios en tipo de votación
    const watchType = watch('type');
    // Manejar cierre del diálogo
    const handleClose = () => {
        reset();
        onClose();
    };
    // Manejar envío del formulario
    const handleFormSubmit = (data) => {
        onSubmit(data);
        reset();
    };
    return (_jsxs(Dialog, { open: open, onClose: handleClose, maxWidth: "md", fullWidth: true, children: [_jsx(DialogTitle, { children: "Nueva Votaci\u00F3n" }), _jsxs("form", { onSubmit: handleSubmit(handleFormSubmit), children: [_jsx(DialogContent, { children: _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(FormControl, { fullWidth: true, error: !!errors.agendaPoint, children: [_jsx(InputLabel, { children: "Punto de la agenda" }), _jsx(Controller, { name: "agendaPoint", control: control, render: ({ field }) => (_jsx(Select, Object.assign({}, field, { label: "Punto de la agenda", children: agendaPoints === null || agendaPoints === void 0 ? void 0 : agendaPoints.map((point, index) => (_jsxs(MenuItem, { value: index + 1, children: [index + 1, ". ", point.topic] }, index))) }))) }), errors.agendaPoint && (_jsx(FormHelperText, { error: true, children: errors.agendaPoint.message }))] }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(FormControl, { fullWidth: true, error: !!errors.type, children: [_jsx(InputLabel, { children: "Tipo de votaci\u00F3n" }), _jsx(Controller, { name: "type", control: control, render: ({ field }) => (_jsx(Select, Object.assign({}, field, { label: "Tipo de votaci\u00F3n", children: votingTypes.map((type) => (_jsx(MenuItem, { value: type.value, children: type.label }, type.value))) }))) }), errors.type && (_jsx(FormHelperText, { error: true, children: errors.type.message }))] }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(Controller, { name: "title", control: control, render: ({ field }) => {
                                            var _a;
                                            return (_jsx(TextField, Object.assign({}, field, { label: "T\u00EDtulo de la votaci\u00F3n", fullWidth: true, error: !!errors.title, helperText: (_a = errors.title) === null || _a === void 0 ? void 0 : _a.message })));
                                        } }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(Controller, { name: "description", control: control, render: ({ field }) => {
                                            var _a;
                                            return (_jsx(TextField, Object.assign({}, field, { label: "Descripci\u00F3n (opcional)", fullWidth: true, multiline: true, rows: 3, error: !!errors.description, helperText: (_a = errors.description) === null || _a === void 0 ? void 0 : _a.message })));
                                        } }) }), (watchType === 'QUALIFIED_MAJORITY' || watchType === 'COEFFICIENT_BASED') && (_jsxs(_Fragment, { children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Controller, { name: "requiredPercentage", control: control, render: ({ field }) => {
                                                    var _a;
                                                    return (_jsx(TextField, Object.assign({}, field, { label: "Porcentaje requerido para aprobaci\u00F3n", type: "number", fullWidth: true, InputProps: { inputProps: { min: 1, max: 100 } }, error: !!errors.requiredPercentage, helperText: (_a = errors.requiredPercentage) === null || _a === void 0 ? void 0 : _a.message })));
                                                } }) }), watchType === 'QUALIFIED_MAJORITY' && (_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(FormControl, { fullWidth: true, error: !!errors.baseForPercentage, children: [_jsx(InputLabel, { children: "Base para c\u00E1lculo" }), _jsx(Controller, { name: "baseForPercentage", control: control, render: ({ field }) => (_jsx(Select, Object.assign({}, field, { label: "Base para c\u00E1lculo", children: percentageBases.map((base) => (_jsx(MenuItem, { value: base.value, children: base.label }, base.value))) }))) }), errors.baseForPercentage && (_jsx(FormHelperText, { error: true, children: errors.baseForPercentage.message }))] }) }))] })), _jsxs(Grid, { item: true, xs: 12, children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "Opciones de votaci\u00F3n" }), _jsx(FormControl, { component: "fieldset", children: _jsxs(RadioGroup, { value: optionType, onChange: (e) => setOptionType(e.target.value), row: true, children: [_jsx(FormControlLabel, { value: "simple", control: _jsx(Radio, {}), label: "S\u00ED/No/Abstenci\u00F3n" }), _jsx(FormControlLabel, { value: "custom", control: _jsx(Radio, {}), label: "Opciones personalizadas" })] }) }), optionType === 'simple' ? (_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Se utilizar\u00E1n las opciones est\u00E1ndar: S\u00ED, No, Abstenci\u00F3n" })) : (_jsx(Controller, { name: "options", control: control, render: ({ field }) => {
                                                var _a;
                                                return (_jsx(TextField, { value: field.value.join('\n'), onChange: (e) => field.onChange(e.target.value.split('\n').filter(Boolean)), label: "Opciones (una por l\u00EDnea)", fullWidth: true, multiline: true, rows: 4, error: !!errors.options, helperText: ((_a = errors.options) === null || _a === void 0 ? void 0 : _a.message) || "Ingrese cada opción en una línea separada", sx: { mt: 2 } }));
                                            } }))] })] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: handleClose, children: "Cancelar" }), _jsx(Button, { type: "submit", variant: "contained", color: "primary", children: "Crear Votaci\u00F3n" })] })] })] }));
};
export default CreateVotingDialog;
