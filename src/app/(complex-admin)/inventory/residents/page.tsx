
"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { inventoryService } from '@/services/inventory.service';
import ResidentsDataTable from '@/components/inventory/ResidentsDataTable';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText } from 'lucide-react';
import { useModal } from '@/hooks/useModal';
import ResidentForm from '@/components/inventory/ResidentForm';
import GeneratePeaceAndSafeForm from '@/components/reports/GeneratePeaceAndSafeForm';

export default function ResidentsPage() {
  const { openModal } = useModal();

  const { data: residents, isLoading, error } = useQuery({
    queryKey: ['residents'],
    queryFn: () => inventoryService.getResidents(),
  });

  const handleAddResident = () => {
    openModal(<ResidentForm />);
  };

  const handleGeneratePeaceAndSafe = () => {
    openModal(<GeneratePeaceAndSafeForm />);
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar los residentes</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Residentes</h1>
        <div className="flex space-x-2">
          <Button onClick={handleAddResident}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Residente
          </Button>
          <Button onClick={handleGeneratePeaceAndSafe}>
            <FileText className="mr-2 h-4 w-4" />
            Generar Paz y Salvo
          </Button>
        </div>
      </div>
      <ResidentsDataTable data={residents || []} />
    </div>
  );
}
