
"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { inventoryService } from '@/services/inventory.service';
import CommonAreasDataTable from '@/components/inventory/CommonAreasDataTable';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useModal } from '@/hooks/useModal';
import CommonAreaForm from '@/components/inventory/CommonAreaForm';

export default function CommonAreasPage() {
  const { openModal } = useModal();

  const { data: commonAreas, isLoading, error } = useQuery({
    queryKey: ['commonAreas'],
    queryFn: () => inventoryService.getCommonAreas(),
  });

  const handleAddCommonArea = () => {
    openModal(<CommonAreaForm />);
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar las áreas comunes</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Áreas Comunes</h1>
        <Button onClick={handleAddCommonArea}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Área Común
        </Button>
      </div>
      <CommonAreasDataTable data={commonAreas || []} />
    </div>
  );
}
