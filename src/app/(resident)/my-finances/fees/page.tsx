"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getFees, initiatePayment } from "@/services/feeService";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ResidentFeesPage() {
  const { user, loading: authLoading } = useAuthStore();

  const {
    data: fees,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["residentFees", user?.id],
    queryFn: () => getFees({ residentId: user?.id }),
    enabled: !!user?.id, // Only fetch if user ID is available
  });

  const handleInitiatePayment = async (feeId: number) => {
    try {
      const response = await initiatePayment(feeId);
      // Redirect to payment gateway URL
      window.location.href = response.paymentUrl;
    } catch (error: unknown) {
      toast({
        title: "Error al iniciar pago",
        description:
          error instanceof Error
            ? error.message
            : "Ocurrió un error al iniciar el pago.",
        variant: "destructive",
      });
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acceso Denegado
          </h1>
          <p className="text-gray-600">
            Por favor, inicie sesión para ver sus cuotas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Mis Cuotas de Administración
      </h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Fecha Vencimiento</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fees && fees.length > 0 ? (
              fees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell>{fee.name}</TableCell>
                  <TableCell>{fee.amount}</TableCell>
                  <TableCell>{fee.dueDate}</TableCell>
                  <TableCell>{fee.status}</TableCell>
                  <TableCell>
                    {fee.status === "PENDING" && (
                      <Button onClick={() => handleInitiatePayment(fee.id)}>
                        Pagar
                      </Button>
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
      </div>
    </div>
  );
}
