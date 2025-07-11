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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { AdminPanelSettings, Save, RefreshCw, Loader2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { intercomService } from '../../lib/services/intercom-service';
// Esquema de validación
const schema = yup.object({
    whatsappEnabled: yup.boolean(),
    whatsappProvider: yup.string().when('whatsappEnabled', {
        is: true,
        then: yup.string().required('El proveedor de WhatsApp es obligatorio')
    }),
    telegramEnabled: yup.boolean(),
    telegramBotToken: yup.string().when('telegramEnabled', {
        is: true,
        then: yup.string().required('El token del bot de Telegram es obligatorio')
    }),
    defaultResponseTimeout: yup.number().required('El tiempo de espera es obligatorio').min(10, 'Mínimo 10 segundos'),
    maxRetries: yup.number().required('El número de reintentos es obligatorio').min(0, 'No puede ser negativo'),
    retryDelay: yup.number().required('El tiempo entre reintentos es obligatorio').min(5, 'Mínimo 5 segundos')
}).required();
const IntercomAdminPanel = () => {
    // Estados
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    // Configuración del formulario
    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            whatsappEnabled: true,
            whatsappProvider: '',
            whatsappConfig: {},
            telegramEnabled: true,
            telegramBotToken: '',
            telegramConfig: {},
            defaultResponseTimeout: 60,
            maxRetries: 2,
            retryDelay: 30,
            messageTemplates: {}
        }
    });
    // Observar cambios en campos relevantes
    const watchWhatsappEnabled = watch('whatsappEnabled');
    const watchTelegramEnabled = watch('telegramEnabled');
    const watchWhatsappProvider = watch('whatsappProvider');
    // Cargar datos iniciales
    useEffect(() => {
        const fetchSettings = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const settings = yield intercomService.getSettings();
                if (settings) {
                    setValue('whatsappEnabled', settings.whatsappEnabled);
                    setValue('whatsappProvider', settings.whatsappProvider || '');
                    setValue('whatsappConfig', settings.whatsappConfig || {});
                    setValue('telegramEnabled', settings.telegramEnabled);
                    setValue('telegramBotToken', settings.telegramBotToken || '');
                    setValue('telegramConfig', settings.telegramConfig || {});
                    setValue('defaultResponseTimeout', settings.defaultResponseTimeout);
                    setValue('maxRetries', settings.maxRetries);
                    setValue('retryDelay', settings.retryDelay);
                    setValue('messageTemplates', settings.messageTemplates || {});
                }
            }
            catch (error) {
                console.error('Error al cargar configuración:', error);
                toast({
                    title: 'Error',
                    description: 'No se pudo cargar la configuración.',
                    variant: 'destructive',
                });
            }
            finally {
                setLoadingData(false);
            }
        });
        fetchSettings();
    }, [setValue, toast]);
    // Manejar envío del formulario
    const onSubmit = (data) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        try {
            if (data.whatsappEnabled) {
                if (data.whatsappProvider === 'twilio') {
                    data.whatsappConfig = {
                        accountSid: data.twilioAccountSid,
                        authToken: data.twilioAuthToken,
                        fromNumber: data.twilioFromNumber
                    };
                }
                else if (data.whatsappProvider === 'messagebird') {
                    data.whatsappConfig = {
                        apiKey: data.messagebirdApiKey,
                        channelId: data.messagebirdChannelId
                    };
                }
            }
            if (data.telegramEnabled) {
                data.telegramConfig = {
                    webhookUrl: data.telegramWebhookUrl
                };
            }
            delete data.twilioAccountSid;
            delete data.twilioAuthToken;
            delete data.twilioFromNumber;
            delete data.messagebirdApiKey;
            delete data.messagebirdChannelId;
            delete data.telegramWebhookUrl;
            yield intercomService.updateSettings(data);
            toast({
                title: 'Éxito',
                description: 'Configuración guardada correctamente.',
            });
        }
        catch (error) {
            console.error('Error al guardar configuración:', error);
            toast({
                title: 'Error',
                description: 'No se pudo guardar la configuración.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    });
    if (loadingData) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-[300px]", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(AdminPanelSettings, { className: "mr-2 h-6 w-6" }), "Panel de Administraci\u00F3n de Citofon\u00EDa Virtual"] }) }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Configuraci\u00F3n de WhatsApp" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Controller, { name: "whatsappEnabled", control: control, render: ({ field }) => (_jsx(Switch, { checked: field.value, onCheckedChange: field.onChange, id: "whatsappEnabled" })) }), _jsx(Label, { htmlFor: "whatsappEnabled", children: "Habilitar integraci\u00F3n con WhatsApp" })] }), watchWhatsappEnabled && (_jsxs("div", { className: "space-y-4 mt-4 pl-6 border-l-2", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: _jsxs("div", { children: [_jsx(Label, { htmlFor: "whatsappProvider", children: "Proveedor de WhatsApp" }), _jsx(Controller, { name: "whatsappProvider", control: control, render: ({ field }) => (_jsxs(Select, { value: field.value, onValueChange: field.onChange, children: [_jsx(SelectTrigger, { id: "whatsappProvider", children: _jsx(SelectValue, { placeholder: "Seleccione un proveedor" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "", children: "Seleccione un proveedor" }), _jsx(SelectItem, { value: "twilio", children: "Twilio" }), _jsx(SelectItem, { value: "messagebird", children: "MessageBird" }), _jsx(SelectItem, { value: "gupshup", children: "Gupshup" })] })] })) }), errors.whatsappProvider && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.whatsappProvider.message }))] }) }), watchWhatsappProvider === 'twilio' && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "twilioAccountSid", children: "Account SID" }), _jsx(Controller, { name: "twilioAccountSid", control: control, defaultValue: "", render: ({ field }) => _jsx(Input, Object.assign({}, field, { id: "twilioAccountSid", placeholder: "ACxxxxxxxxxxxxxxxxxxxxxxxx" })) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "twilioAuthToken", children: "Auth Token" }), _jsx(Controller, { name: "twilioAuthToken", control: control, defaultValue: "", render: ({ field }) => _jsx(Input, Object.assign({}, field, { id: "twilioAuthToken", type: "password", placeholder: "Your Auth Token" })) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "twilioFromNumber", children: "N\u00FAmero de WhatsApp (Twilio)" }), _jsx(Controller, { name: "twilioFromNumber", control: control, defaultValue: "", render: ({ field }) => _jsx(Input, Object.assign({}, field, { id: "twilioFromNumber", placeholder: "whatsapp:+14155238886" })) })] })] })), watchWhatsappProvider === 'messagebird' && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "messagebirdApiKey", children: "API Key" }), _jsx(Controller, { name: "messagebirdApiKey", control: control, defaultValue: "", render: ({ field }) => _jsx(Input, Object.assign({}, field, { id: "messagebirdApiKey", placeholder: "Your API Key" })) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "messagebirdChannelId", children: "Channel ID" }), _jsx(Controller, { name: "messagebirdChannelId", control: control, defaultValue: "", render: ({ field }) => _jsx(Input, Object.assign({}, field, { id: "messagebirdChannelId", placeholder: "Your Channel ID" })) })] })] }))] }))] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Configuraci\u00F3n de Telegram" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Controller, { name: "telegramEnabled", control: control, render: ({ field }) => (_jsx(Switch, { checked: field.value, onCheckedChange: field.onChange, id: "telegramEnabled" })) }), _jsx(Label, { htmlFor: "telegramEnabled", children: "Habilitar integraci\u00F3n con Telegram" })] }), watchTelegramEnabled && (_jsxs("div", { className: "space-y-4 mt-4 pl-6 border-l-2", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "telegramBotToken", children: "Token del Bot" }), _jsx(Controller, { name: "telegramBotToken", control: control, render: ({ field }) => _jsx(Input, Object.assign({}, field, { id: "telegramBotToken", placeholder: "Token del Bot" })) }), errors.telegramBotToken && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.telegramBotToken.message }))] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "telegramWebhookUrl", children: "URL del Webhook" }), _jsx(Controller, { name: "telegramWebhookUrl", control: control, defaultValue: "", render: ({ field }) => _jsx(Input, Object.assign({}, field, { id: "telegramWebhookUrl", placeholder: "https://tu-dominio.com/api/webhooks/telegram" })) })] })] }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Para crear un bot de Telegram, contacta a @BotFather en Telegram y sigue las instrucciones." })] }))] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Configuraci\u00F3n General" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "defaultResponseTimeout", children: "Tiempo de espera (segundos)" }), _jsx(Controller, { name: "defaultResponseTimeout", control: control, render: ({ field }) => _jsx(Input, Object.assign({}, field, { id: "defaultResponseTimeout", type: "number" })) }), errors.defaultResponseTimeout && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.defaultResponseTimeout.message }))] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "maxRetries", children: "M\u00E1ximo de reintentos" }), _jsx(Controller, { name: "maxRetries", control: control, render: ({ field }) => _jsx(Input, Object.assign({}, field, { id: "maxRetries", type: "number" })) }), errors.maxRetries && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.maxRetries.message }))] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "retryDelay", children: "Tiempo entre reintentos (segundos)" }), _jsx(Controller, { name: "retryDelay", control: control, render: ({ field }) => _jsx(Input, Object.assign({}, field, { id: "retryDelay", type: "number" })) }), errors.retryDelay && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.retryDelay.message }))] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Plantillas de Mensajes" }), _jsxs("div", { className: "grid grid-cols-1 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "whatsappTemplate", children: "Plantilla para WhatsApp (Notificaci\u00F3n de Visitante)" }), _jsx(Controller, { name: "messageTemplates.WHATSAPP.visitor_notification", control: control, defaultValue: "\u00A1Hola! Tienes un visitante: {{visitor.name}} para {{unit.number}}. Motivo: {{purpose}}", render: ({ field }) => _jsx(Textarea, Object.assign({}, field, { id: "whatsappTemplate", rows: 3 })) }), _jsxs("p", { className: "text-sm text-gray-500 mt-1", children: ["Variables: ", `{{visitor.name}}`, ", ", `{{visitor.type}}`, ", ", `{{unit.number}}`, ", ", `{{purpose}}`] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "telegramTemplate", children: "Plantilla para Telegram (Notificaci\u00F3n de Visitante)" }), _jsx(Controller, { name: "messageTemplates.TELEGRAM.visitor_notification", control: control, defaultValue: "\uD83D\uDD14 *Nuevo visitante*\r\n\r\n*Nombre:* {{visitor.name}}\r\n*Tipo:* {{visitor.type}}\r\n*Unidad:* {{unit.number}}\r\n*Motivo:* {{purpose}}", render: ({ field }) => _jsx(Textarea, Object.assign({}, field, { id: "telegramTemplate", rows: 4 })) }), _jsxs("p", { className: "text-sm text-gray-500 mt-1", children: ["Variables: ", `{{visitor.name}}`, ", ", `{{visitor.type}}`, ", ", `{{unit.number}}`, ", ", `{{purpose}}`, ". Soporta Markdown."] })] })] })] }), _jsxs("div", { className: "flex justify-end space-x-4 pt-4", children: [_jsxs(Button, { type: "button", variant: "outline", onClick: () => window.location.reload(), children: [_jsx(RefreshCw, { className: "mr-2 h-4 w-4" }), "Recargar"] }), _jsxs(Button, { type: "submit", disabled: loading, children: [loading ? _jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : _jsx(Save, { className: "mr-2 h-4 w-4" }), "Guardar Configuraci\u00F3n"] })] })] }) })] }));
};
export default IntercomAdminPanel;
