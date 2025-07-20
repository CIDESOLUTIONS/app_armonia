"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  getFees,
  initiatePayment,
  FeeDto,
  FeeStatus,
} from "@/services/feeService";
import { Badge } from "@/components/ui/badge";

export default function ResidentFeesPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [fees, setFees] = useState<FeeDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFees = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getFees({ residentId: user?.id }); // Fetch fees for the current resident
      setFees(response); // Assuming getFees returns the data directly
    } catch (error: Error) {
      console.error("Error fetching fees:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar tus cuotas: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchFees();
    }
  }, [authLoading, user, fetchFees]);

  const handlePayFee = async (feeId: number) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "Usuario no autenticado.",
        variant: "destructive",
      });
      return;
    }
    try {
      const paymentUrl = await initiatePayment(feeId);
      toast({
        title: "Pago Iniciado",
        description: "Redirigiendo a la pasarela de pago... (Simulado)",
      });
      // In a real app, you would redirect the user to paymentUrl
      window.open(paymentUrl, "_blank");
    } catch (error: Error) {
      console.error("Error initiating payment:", error);
      toast({
        title: "Error",
        description: "Error al iniciar el pago: " + error.message,
        variant: "destructive",
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Redirect handled by AuthLayout
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Mis Cuotas de Administración
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Resumen de Cuotas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Fecha Vencimiento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fees.length > 0 ? (
                fees.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell>{fee.title}</TableCell>
                    <TableCell>${fee.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(fee.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          fee.status === FeeStatus.PENDING
                            ? "destructive"
                            : fee.status === FeeStatus.PAID
                              ? "default"
                              : "secondary"
                        }
                      >
                        {fee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {fee.status === FeeStatus.PENDING && (
                        <Button onClick={() => handlePayFee(fee.id)} size="sm">
                          <DollarSign className="mr-2 h-4 w-4" /> Pagar
                        </Button>
                      )}
                      {fee.status === FeeStatus.PAID && (
                        <Badge variant="default">
                          <CheckCircle className="mr-1 h-4 w-4" /> Pagado
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-5">
                    No tienes cuotas pendientes.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
