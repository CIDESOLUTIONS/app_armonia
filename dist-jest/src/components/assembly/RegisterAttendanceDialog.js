import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// Esquema de validación
const schema = yup.object({
    propertyUnitId: yup.number().required('Seleccione una unidad'),
    coefficient: yup.number().required('El coeficiente es obligatorio').min(0.01, 'Mínimo 0.01%').max(100, 'Máximo 100%'),
    attendanceType: yup.string().required('Seleccione un tipo de asistencia'),
    proxyUserId: yup.number().when('attendanceType', {
        is: 'PROXY',
        then: yup.number().required('Seleccione el propietario que otorga el poder')
    }),
    proxyDocumentUrl: yup.string().when('attendanceType', {
        is: 'PROXY',
        then: yup.string().required('Ingrese la URL del documento de poder')
    })
});
// Tipos de asistencia
const attendanceTypes = [
    { value: 'PRESENT', label: 'Presencial' },
    { value: 'PROXY', label: 'Por poder' },
    { value: 'VIRTUAL', label: 'Virtual' }
];
// Componente para registrar asistencia a una asamblea
const RegisterAttendanceDialog = ({ open, onClose, onSubmit, propertyUnits, owners }) => {
    // Configuración del formulario
    const { control, handleSubmit, watch, formState: { errors }, reset, setValue } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            propertyUnitId: '',
            coefficient: '',
            attendanceType: 'PRESENT',
            proxyUserId: '',
            proxyDocumentUrl: ''
        }
    });
    // Observar cambios en tipo de asistencia
    const watchAttendanceType = watch('attendanceType');
    const watchPropertyUnitId = watch('propertyUnitId');
    // Manejar cierre del diálogo
    const handleClose = () => {
        reset();
        onClose();
    };
    // Manejar envío del formulario
    const handleFormSubmit = (data) => {
        // Agregar información del dispositivo para asistencia virtual
        if (data.attendanceType === 'VIRTUAL') {
            data.ipAddress = window.location.hostname;
            data.userAgent = navigator.userAgent;
        }
        onSubmit(data);
        reset();
    };
    // Actualizar coeficiente automáticamente al seleccionar unidad
    const updateCoefficient = useCallback((propertyUnitId) => {
        if (!propertyUnitId)
            return '';
        const unit = propertyUnits.find((u) => u.id === propertyUnitId);
        return unit ? unit.coefficient : '';
    }, [propertyUnits]);
    useEffect(() => {
        if (watchPropertyUnitId) {
            const coef = updateCoefficient(watchPropertyUnitId);
            if (coef) {
                setValue('coefficient', coef);
            }
        }
    }, [watchPropertyUnitId, setValue, updateCoefficient]);
    return (_jsx(Dialog, { open: open, onOpenChange: handleClose, children: _jsxs(DialogContent, { className: "sm:max-w-[600px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Registrar Asistencia" }), _jsx(DialogDescription, { children: "Complete los datos para registrar la asistencia a la asamblea." })] }), _jsxs("form", { onSubmit: handleSubmit(handleFormSubmit), className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "propertyUnitId", children: "Unidad" }), _jsx(Controller, { name: "propertyUnitId", control: control, render: ({ field }) => (_jsxs(Select, { value: String(field.value), onValueChange: (value) => {
                                                    field.onChange(Number(value));
                                                    const coef = updateCoefficient(Number(value));
                                                    if (coef) {
                                                        setValue('coefficient', coef);
                                                    }
                                                }, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Seleccione una unidad" }) }), _jsx(SelectContent, { children: propertyUnits === null || propertyUnits === void 0 ? void 0 : propertyUnits.map((unit) => (_jsxs(SelectItem, { value: String(unit.id), children: [unit.number, " - ", unit.ownerName] }, unit.id))) })] })) }), errors.propertyUnitId && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.propertyUnitId.message }))] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "coefficient", children: "Coeficiente (%)" }), _jsx(Controller, { name: "coefficient", control: control, render: ({ field }) => (_jsx(Input, Object.assign({}, field, { id: "coefficient", type: "number", step: "0.01", placeholder: "Ej: 0.5, 1.2" }))) }), errors.coefficient && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.coefficient.message }))] })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Tipo de asistencia" }), _jsx(Controller, { name: "attendanceType", control: control, render: ({ field }) => (_jsx(RadioGroup, { onValueChange: field.onChange, value: field.value, className: "flex space-x-4", children: attendanceTypes.map((type) => (_jsxs("div", { className: "flex items-center", children: [_jsx(RadioGroupItem, { value: type.value, id: type.value }), _jsx(Label, { htmlFor: type.value, className: "ml-2", children: type.label })] }, type.value))) })) }), errors.attendanceType && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.attendanceType.message }))] }), watchAttendanceType === 'PROXY' && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "proxyUserId", children: "Propietario que otorga el poder" }), _jsx(Controller, { name: "proxyUserId", control: control, render: ({ field }) => (_jsxs(Select, { value: String(field.value), onValueChange: (value) => field.onChange(Number(value)), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Seleccione propietario" }) }), _jsx(SelectContent, { children: owners === null || owners === void 0 ? void 0 : owners.map((owner) => (_jsx(SelectItem, { value: String(owner.id), children: owner.name }, owner.id))) })] })) }), errors.proxyUserId && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.proxyUserId.message }))] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "proxyDocumentUrl", children: "URL del documento de poder" }), _jsx(Controller, { name: "proxyDocumentUrl", control: control, render: ({ field }) => (_jsx(Input, Object.assign({}, field, { id: "proxyDocumentUrl", placeholder: "URL del documento" }))) }), errors.proxyDocumentUrl && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.proxyDocumentUrl.message }))] })] })), watchAttendanceType === 'VIRTUAL' && (_jsx("p", { className: "text-sm text-gray-500", children: "La asistencia virtual registrar\u00E1 autom\u00E1ticamente su direcci\u00F3n IP y navegador para verificaci\u00F3n." })), _jsxs(DialogFooter, { children: [_jsx(Button, { type: "button", variant: "outline", onClick: handleClose, children: "Cancelar" }), _jsx(Button, { type: "submit", children: "Registrar Asistencia" })] })] })] }) }));
};
export default RegisterAttendanceDialog;
