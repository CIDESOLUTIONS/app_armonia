"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { inventoryService } from "@/services/inventory.service";
import PetsDataTable from "@/components/inventory/PetsDataTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import PetForm from "@/components/inventory/PetForm";

export default function PetsPage() {
  const { openModal } = useModal();

  const {
    data: pets,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pets"],
    queryFn: () => inventoryService.getPets(),
  });

  const handleAddPet = () => {
    openModal(<PetForm />);
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar las mascotas</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Mascotas</h1>
        <Button onClick={handleAddPet}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Mascota
        </Button>
      </div>
      <PetsDataTable data={pets || []} />
    </div>
  );
}
