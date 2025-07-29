"use client";

import React from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { inventoryService } from "@/services/inventory.service";
import { DataTable } from "@/components/ui/data-table";
import { petColumns } from "./petColumns";
import { useModal } from "@/hooks/useModal";
import PetForm from "./PetForm";
import { toast } from "@/components/ui/use-toast";

export default function PetsDataTable({ data }) {
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => inventoryService.deletePet(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["pets"]);
      toast({ title: "Mascota eliminada con éxito" });
    },
    onError: () => {
      toast({ title: "Error al eliminar la mascota", variant: "destructive" });
    },
  });

  const handleEdit = (pet) => {
    openModal(<PetForm pet={pet} />);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta mascota?")) {
      deleteMutation.mutate(id);
    }
  };

  const tableColumns = petColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return <DataTable columns={tableColumns} data={data} />;
}
