"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { inventoryService } from "@/services/inventory.service";
import PropertiesDataTable from "@/components/inventory/PropertiesDataTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import PropertyForm from "@/components/inventory/PropertyForm";

export default function PropertiesPage() {
  const { openModal } = useModal();

  const {
    data: properties,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["properties"],
    queryFn: () => inventoryService.getProperties(),
  });

  const handleAddProperty = () => {
    openModal(<PropertyForm />);
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar las propiedades</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Inmuebles</h1>
        <Button onClick={handleAddProperty}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Inmueble
        </Button>
      </div>
      <PropertiesDataTable data={properties || []} />
    </div>
  );
}
