"use client";

import React from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { inventoryService } from "@/services/inventory.service";
import { DataTable } from "@/components/ui/data-table";
import { residentColumns } from "./residentColumns"; // Renamed to avoid conflict
import { useModal } from "@/hooks/useModal";
import ResidentForm from "./ResidentForm";
import { toast } from "@/components/ui/use-toast";

export default function ResidentsDataTable({ data }) {
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => inventoryService.deleteResident(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["residents"]);
      toast({ title: "Residente eliminado con éxito" });
    },
    onError: () => {
      toast({
        title: "Error al eliminar el residente",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (resident) => {
    openModal(<ResidentForm resident={resident} />);
  };

  const handleDelete = (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este residente?")
    ) {
      deleteMutation.mutate(id);
    }
  };

  const tableColumns = residentColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return <DataTable columns={tableColumns} data={data} />;
}
