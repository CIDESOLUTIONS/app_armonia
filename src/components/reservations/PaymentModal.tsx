'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Clock, DollarSign, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: {
    id: number;
    title: string;
    commonArea: {
      name: string;
      feeAmount?: number;
    };
    startDateTime: Date | string;
    endDateTime: Date | string;
    paymentStatus?: string;
    requiresPayment: boolean;
  };
  onPaymentComplete: () => void;
}

interface PaymentInfo {
  transactionId: string;
  paymentUrl?: string;
  amount: number;
  currency: string;
  expiresAt?: Date;
  status: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  reservation,
  onPaymentComplete
}) => {
  const { toast } = useToast();
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [paymentStep, setPaymentStep] = useState<'info' | 'payment' | 'confirmation'>('info');

  const handleCreatePayment = async () => {
    setIsCreatingPayment(true);
    
    try {
      const response = await fetch(`/api/reservations/${reservation.id}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/reservations/payment-result`
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el pago');
      }

      const data = await response.json();
      setPaymentInfo(data.payment);
      setPaymentStep('payment');

      toast({
        title: 'Pago creado',
        description: 'Se ha generado el enlace de pago exitosamente'
      });

    } catch (error) {
      console.error('Error creando pago:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al crear el pago',
        variant: 'destructive'
      });
    } finally {
      setIsCreatingPayment(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Detalles del Pago</DialogTitle>
            </DialogHeader>
            <p>Contenido del modal de pago</p>
            <DialogFooter>
                <Button onClick={onClose}>Cerrar</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
