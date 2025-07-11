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
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
export default function MessagesPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [messageContent, setMessageContent] = useState('');
    const [recipient, setRecipient] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSendMessage = () => __awaiter(this, void 0, void 0, function* () {
        if (!messageContent.trim() || !recipient.trim()) {
            toast({
                title: 'Error',
                description: 'Por favor, ingrese un mensaje y un destinatario.',
                variant: 'destructive',
            });
            return;
        }
        setLoading(true);
        try {
            // Placeholder for actual API call to send message
            // In a real implementation, this would call an API endpoint
            // that integrates with Twilio (WhatsApp/SMS) or Telegram API.
            console.log(`Sending message to ${recipient}: ${messageContent}`);
            yield new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            toast({
                title: 'Éxito',
                description: 'Mensaje enviado correctamente (simulado).',
            });
            setMessageContent('');
            setRecipient('');
        }
        catch (error) {
            console.error('Error sending message:', error);
            toast({
                title: 'Error',
                description: 'Error al enviar el mensaje.',
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
    if (!user || (user.role !== 'ADMIN' && user.role !== 'COMPLEX_ADMIN' && user.role !== 'STAFF')) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Acceso Denegado" }), _jsx("p", { className: "text-gray-600", children: "No tienes permisos para acceder a esta p\u00E1gina." })] }) }));
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Mensajer\u00EDa Digital" }), _jsxs("div", { className: "bg-white shadow-md rounded-lg p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Enviar Mensaje" }), _jsxs("div", { className: "grid gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "recipient", children: "Destinatario (N\u00FAmero de Tel\u00E9fono o ID de Usuario)" }), _jsx(Input, { id: "recipient", value: recipient, onChange: (e) => setRecipient(e.target.value), placeholder: "Ej: +573001234567 o ID de Usuario" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "messageContent", children: "Mensaje" }), _jsx(Textarea, { id: "messageContent", value: messageContent, onChange: (e) => setMessageContent(e.target.value), rows: 5, placeholder: "Escribe tu mensaje aqu\u00ED..." })] }), _jsxs(Button, { onClick: handleSendMessage, disabled: loading, children: [loading ? _jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : _jsx(Send, { className: "mr-2 h-4 w-4" }), " Enviar Mensaje"] })] })] }), _jsxs("div", { className: "mt-8 bg-white shadow-md rounded-lg p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Historial de Mensajes (Pr\u00F3ximamente)" }), _jsx("p", { className: "text-gray-600", children: "El historial de mensajes y la integraci\u00F3n con plataformas como WhatsApp o Telegram se implementar\u00E1n en futuras actualizaciones." })] })] }));
}
