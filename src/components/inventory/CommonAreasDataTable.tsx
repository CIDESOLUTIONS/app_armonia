
"use client";

import React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { inventoryService } from '@/services/inventory.service';
import { DataTable } from '@/components/ui/data-table';
import { commonAreaColumns } from './commonAreaColumns';
import { useModal } from '@/hooks/useModal';
import CommonAreaForm from './CommonAreaForm';
import { toast } from '@/components/ui/use-toast';

export default function CommonAreasDataTable({ data }) {
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => inventoryService.deleteCommonArea(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['commonAreas']);
      toast({ title: 'Área común eliminada con éxito' });
    },
    onError: () => {
      toast({ title: 'Error al eliminar el área común', variant: 'destructive' });
    },
  });

  const handleEdit = (commonArea) => {
    openModal(<CommonAreaForm commonArea={commonArea} />);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta área común?')) {
      deleteMutation.mutate(id);
    }
  };

  const tableColumns = commonAreaColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return <DataTable columns={tableColumns} data={data} />;
}
