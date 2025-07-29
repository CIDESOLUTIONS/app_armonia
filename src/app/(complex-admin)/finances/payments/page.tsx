"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getPayments } from "@/services/paymentService";
import PaymentsDataTable from "@/components/finances/PaymentsDataTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import ManualPaymentForm from "@/components/finances/ManualPaymentForm";

export default function PaymentsPage() {
  const { openModal } = useModal();

  const {
    data: payments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["payments"],
    queryFn: () => getPayments(),
  });

  const handleAddManualPayment = () => {
    openModal(<ManualPaymentForm />);
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar los pagos</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Pagos</h1>
        <Button onClick={handleAddManualPayment}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Registrar Pago Manual
        </Button>
      </div>
      <PaymentsDataTable data={payments || []} />
    </div>
  );
}
