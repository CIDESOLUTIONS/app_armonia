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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
const PaymentModal = ({ isOpen, onClose, reservation, onPaymentComplete }) => {
    const { toast } = useToast();
    const [isCreatingPayment, setIsCreatingPayment] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [paymentStep, setPaymentStep] = useState('info');
    const handleCreatePayment = () => __awaiter(void 0, void 0, void 0, function* () {
        setIsCreatingPayment(true);
        try {
            const response = yield fetch(`/api/reservations/${reservation.id}/payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    returnUrl: `${window.location.origin}/reservations/payment-result`
                })
            });
            if (!response.ok) {
                const errorData = yield response.json();
                throw new Error(errorData.message || 'Error al crear el pago');
            }
            const data = yield response.json();
            setPaymentInfo(data.payment);
            setPaymentStep('payment');
            toast({
                title: 'Pago creado',
                description: 'Se ha generado el enlace de pago exitosamente'
            });
        }
        catch (error) {
            console.error('Error creando pago:', error);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Error al crear el pago',
                variant: 'destructive'
            });
        }
        finally {
            setIsCreatingPayment(false);
        }
    });
    return (_jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Detalles del Pago" }) }), _jsx("p", { children: "Contenido del modal de pago" }), _jsx(DialogFooter, { children: _jsx(Button, { onClick: onClose, children: "Cerrar" }) })] }) }));
};
export default PaymentModal;
