
"use client";

import React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { inventoryService } from '@/services/inventory.service';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { useModal } from '@/hooks/useModal';
import PropertyForm from './PropertyForm';
import { toast } from '@/components/ui/use-toast';

export default function PropertiesDataTable({ data }) {
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => inventoryService.deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['properties']);
      toast({ title: 'Inmueble eliminado con éxito' });
    },
    onError: () => {
      toast({ title: 'Error al eliminar el inmueble', variant: 'destructive' });
    },
  });

  const handleEdit = (property) => {
    openModal(<PropertyForm property={property} />);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este inmueble?')) {
      deleteMutation.mutate(id);
    }
  };

  const tableColumns = columns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return <DataTable columns={tableColumns} data={data} />;
}
