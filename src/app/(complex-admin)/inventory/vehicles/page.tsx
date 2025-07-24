
"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { inventoryService } from '@/services/inventory.service';
import VehiclesDataTable from '@/components/inventory/VehiclesDataTable';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useModal } from '@/hooks/useModal';
import VehicleForm from '@/components/inventory/VehicleForm';

export default function VehiclesPage() {
  const { openModal } = useModal();

  const { data: vehicles, isLoading, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => inventoryService.getVehicles(),
  });

  const handleAddVehicle = () => {
    openModal(<VehicleForm />);
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar los vehículos</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Vehículos</h1>
        <Button onClick={handleAddVehicle}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Vehículo
        </Button>
      </div>
      <VehiclesDataTable data={vehicles || []} />
    </div>
  );
}
