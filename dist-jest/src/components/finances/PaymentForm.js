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
import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Divider, FormControl, FormControlLabel, FormHelperText, Grid, InputAdornment, Radio, RadioGroup, Stack, TextField, Typography, useTheme } from '@mui/material';
import { CreditCard as CreditCardIcon, AccountBalance as BankIcon, Receipt as ReceiptIcon, Lock as LockIcon, CheckCircle as CheckIcon, Error as ErrorIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
// Servicios y utilidades
import { createTransaction, processTransaction } from '@/lib/api/payments';
import { formatCurrency } from '@/lib/utils/format';
// Esquema de validación
const paymentSchema = yup.object({
    amount: yup.number().required('El monto es obligatorio').positive('El monto debe ser positivo'),
    description: yup.string().required('La descripción es obligatoria').min(3, 'Mínimo 3 caracteres'),
    paymentMethodId: yup.number().required('Seleccione un método de pago'),
    invoiceId: yup.number().optional(),
    savePaymentMethod: yup.boolean().optional()
});
// Componente principal de pago
const PaymentForm = ({ initialAmount = 0, invoiceId = null, description = '', onSuccess, onCancel }) => {
    const theme = useTheme();
    const router = useRouter();
    const { data: session } = useSession();
    // Estados
    const [loading, setLoading] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([
        { id: 1, name: 'Tarjeta de Crédito', type: 'CREDIT_CARD', icon: _jsx(CreditCardIcon, {}) },
        { id: 2, name: 'PSE - Débito bancario', type: 'PSE', icon: _jsx(BankIcon, {}) },
        { id: 3, name: 'Efectivo (Efecty, Baloto)', type: 'CASH', icon: _jsx(ReceiptIcon, {}) }
    ]);
    const [processingStatus, setProcessingStatus] = useState(null);
    // Configuración del formulario
    const { control, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: yupResolver(paymentSchema),
        defaultValues: {
            amount: initialAmount,
            description: description,
            paymentMethodId: '',
            invoiceId: invoiceId,
            savePaymentMethod: false
        }
    });
    // Observar método de pago seleccionado
    const selectedMethodId = watch('paymentMethodId');
    const selectedMethod = paymentMethods.find(m => m.id === selectedMethodId);
    // Manejar envío del formulario
    const onSubmit = (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setLoading(true);
            setProcessingStatus('processing');
            // Crear transacción
            const transaction = yield createTransaction(Object.assign(Object.assign({}, data), { returnUrl: `${window.location.origin}/payments/return` }));
            // Procesar transacción
            const result = yield processTransaction(transaction.id);
            // Manejar redirección a pasarela si es necesario
            if (result.redirectUrl) {
                window.location.href = result.redirectUrl;
                return;
            }
            // Actualizar estado
            setProcessingStatus('success');
            // Notificar éxito
            toast.success('Pago procesado correctamente');
            // Llamar callback de éxito
            if (onSuccess) {
                onSuccess(transaction);
            }
            // Redireccionar a página de confirmación
            setTimeout(() => {
                router.push(`/payments/confirmation/${transaction.id}`);
            }, 2000);
        }
        catch (error) {
            console.error('Error al procesar pago:', error);
            setProcessingStatus('error');
            toast.error('Error al procesar el pago. Por favor intente nuevamente.');
        }
        finally {
            setLoading(false);
        }
    });
    // Renderizar estado de procesamiento
    const renderProcessingStatus = () => {
        if (!processingStatus)
            return null;
        const statusConfig = {
            processing: {
                icon: _jsx(CircularProgress, { size: 40 }),
                title: 'Procesando pago',
                description: 'Por favor espere mientras procesamos su pago...'
            },
            success: {
                icon: _jsx(CheckIcon, { color: "success", sx: { fontSize: 40 } }),
                title: 'Pago exitoso',
                description: 'Su pago ha sido procesado correctamente.'
            },
            error: {
                icon: _jsx(ErrorIcon, { color: "error", sx: { fontSize: 40 } }),
                title: 'Error en el pago',
                description: 'Ha ocurrido un error al procesar su pago. Por favor intente nuevamente.'
            }
        };
        const config = statusConfig[processingStatus];
        return (_jsxs(Box, { sx: { textAlign: 'center', py: 4 }, children: [config.icon, _jsx(Typography, { variant: "h6", sx: { mt: 2 }, children: config.title }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: config.description })] }));
    };
    // Si está procesando, mostrar solo el estado
    if (processingStatus === 'processing' || processingStatus === 'success') {
        return (_jsxs(Card, { children: [_jsx(CardHeader, { title: "Procesando Pago" }), _jsx(CardContent, { children: renderProcessingStatus() })] }));
    }
    return (_jsxs(Card, { children: [_jsx(CardHeader, { title: "Realizar Pago", subheader: "Complete los datos para procesar su pago", avatar: _jsx(LockIcon, { color: "primary" }) }), _jsxs(CardContent, { children: [processingStatus === 'error' && (_jsx(Box, { sx: { mb: 3 }, children: renderProcessingStatus() })), _jsx("form", { onSubmit: handleSubmit(onSubmit), children: _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Controller, { name: "amount", control: control, render: ({ field }) => {
                                            var _a;
                                            return (_jsx(TextField, Object.assign({}, field, { label: "Monto a pagar", fullWidth: true, type: "number", InputProps: {
                                                    startAdornment: _jsx(InputAdornment, { position: "start", children: "$" }),
                                                }, error: !!errors.amount, helperText: (_a = errors.amount) === null || _a === void 0 ? void 0 : _a.message, disabled: !!invoiceId })));
                                        } }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Controller, { name: "description", control: control, render: ({ field }) => {
                                            var _a;
                                            return (_jsx(TextField, Object.assign({}, field, { label: "Descripci\u00F3n", fullWidth: true, error: !!errors.description, helperText: (_a = errors.description) === null || _a === void 0 ? void 0 : _a.message, disabled: !!invoiceId })));
                                        } }) }), _jsxs(Grid, { item: true, xs: 12, children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Seleccione un m\u00E9todo de pago" }), _jsx(Controller, { name: "paymentMethodId", control: control, render: ({ field }) => (_jsxs(FormControl, { fullWidth: true, error: !!errors.paymentMethodId, children: [_jsx(RadioGroup, Object.assign({}, field, { onChange: (e) => field.onChange(parseInt(e.target.value)), value: field.value, children: _jsx(Grid, { container: true, spacing: 2, children: paymentMethods.map((method) => (_jsx(Grid, { item: true, xs: 12, sm: 4, children: _jsx(Card, { sx: {
                                                                        border: field.value === method.id ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
                                                                        cursor: 'pointer',
                                                                        transition: 'all 0.2s',
                                                                        '&:hover': {
                                                                            boxShadow: 3
                                                                        }
                                                                    }, onClick: () => field.onChange(method.id), children: _jsx(CardContent, { children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(FormControlLabel, { value: method.id, control: _jsx(Radio, {}), label: "", sx: { mr: 0 } }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', ml: 1 }, children: [method.icon, _jsx(Typography, { variant: "body1", sx: { ml: 1 }, children: method.name })] })] }) }) }) }, method.id))) }) })), errors.paymentMethodId && (_jsx(FormHelperText, { error: true, children: errors.paymentMethodId.message }))] })) })] }), (selectedMethod === null || selectedMethod === void 0 ? void 0 : selectedMethod.type) === 'CREDIT_CARD' && (_jsx(Grid, { item: true, xs: 12, children: _jsx(Controller, { name: "savePaymentMethod", control: control, render: ({ field }) => (_jsx(FormControlLabel, { control: _jsx(Radio, { checked: field.value, onChange: (e) => field.onChange(e.target.checked) }), label: "Guardar esta tarjeta para pagos futuros" })) }) })), (selectedMethod === null || selectedMethod === void 0 ? void 0 : selectedMethod.type) === 'PSE' && (_jsx(Grid, { item: true, xs: 12, children: _jsxs(Card, { variant: "outlined", sx: { p: 2, bgcolor: 'background.default' }, children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "Informaci\u00F3n importante" }), _jsx(Typography, { variant: "body2", children: "Al seleccionar PSE, ser\u00E1 redirigido a su banco para completar la transacci\u00F3n. Aseg\u00FArese de tener habilitado su servicio de banca en l\u00EDnea." })] }) })), (selectedMethod === null || selectedMethod === void 0 ? void 0 : selectedMethod.type) === 'CASH' && (_jsx(Grid, { item: true, xs: 12, children: _jsxs(Card, { variant: "outlined", sx: { p: 2, bgcolor: 'background.default' }, children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "Informaci\u00F3n importante" }), _jsx(Typography, { variant: "body2", children: "Al seleccionar pago en efectivo, recibir\u00E1 un c\u00F3digo que deber\u00E1 presentar en los puntos de pago autorizados para completar la transacci\u00F3n." })] }) })), _jsxs(Grid, { item: true, xs: 12, children: [_jsx(Divider, { sx: { my: 2 } }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 2 }, children: [_jsx(Typography, { variant: "subtitle1", children: "Total a pagar:" }), _jsx(Typography, { variant: "h6", color: "primary", children: formatCurrency(watch('amount') || 0) })] })] }), _jsx(Grid, { item: true, xs: 12, children: _jsxs(Stack, { direction: "row", spacing: 2, justifyContent: "flex-end", children: [_jsx(Button, { variant: "outlined", onClick: onCancel, disabled: loading, children: "Cancelar" }), _jsx(Button, { type: "submit", variant: "contained", disabled: loading, startIcon: loading ? _jsx(CircularProgress, { size: 20 }) : null, children: loading ? 'Procesando...' : 'Realizar Pago' })] }) })] }) })] })] }));
};
export default PaymentForm;
