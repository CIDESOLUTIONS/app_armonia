
"use client";

import React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { deletePayment } from '@/services/paymentService';
import { DataTable } from '@/components/ui/data-table';
import { paymentColumns } from './paymentColumns';
import { toast } from '@/components/ui/use-toast';

export default function PaymentsDataTable({ data }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['payments']);
      toast({ title: 'Pago eliminado con éxito' });
    },
    onError: () => {
      toast({ title: 'Error al eliminar el pago', variant: 'destructive' });
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este pago?')) {
      deleteMutation.mutate(id);
    }
  };

  const tableColumns = paymentColumns({
    onDelete: handleDelete,
  });

  return <DataTable columns={tableColumns} data={data} />;
}
