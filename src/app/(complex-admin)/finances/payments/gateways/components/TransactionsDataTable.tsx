"use client";

import React from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { refundTransaction } from "@/services/paymentGatewayService";
import { DataTable } from "@/components/ui/data-table";
import { transactionColumns } from "./transactionColumns";
import { toast } from "@/components/ui/use-toast";

export default function TransactionsDataTable({ data }) {
  const queryClient = useQueryClient();

  const refundMutation = useMutation({
    mutationFn: (transactionId: string) => refundTransaction(transactionId),
    onSuccess: (data, transactionId) => {
      queryClient.invalidateQueries(["transactions"]);
      toast({ 
        title: "Reembolso procesado", 
        description: `La transacción #${transactionId} ha sido reembolsada exitosamente`
      });
    },
    onError: (error) => {
      toast({ 
        title: "Error al procesar reembolso", 
        description: error.message || "No se pudo procesar el reembolso",
        variant: "destructive" 
      });
    },
  });

  const handleRefund = (transactionId) => {
    if (window.confirm("\u00bfEst\u00e1s seguro de que quieres reembolsar esta transacci\u00f3n?")) {
      refundMutation.mutate(transactionId);
    }
  };

  const handleViewDetails = (transaction) => {
    // TODO: Implementar modal de detalles de transacción
    console.log("Ver detalles de:", transaction);
  };

  const tableColumns = transactionColumns({
    onRefund: handleRefund,
    onViewDetails: handleViewDetails,
    isRefunding: refundMutation.isLoading,
  });

  return (
    <div className="space-y-4">
      <DataTable 
        columns={tableColumns} 
        data={data}
        searchKey="providerTransactionId"
        searchPlaceholder="Buscar por ID de transacci\u00f3n..."
      />
    </div>
  );
}