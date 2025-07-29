"use client";

import React from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { inventoryService } from "@/services/inventory.service";
import { DataTable } from "@/components/ui/data-table";
import { vehicleColumns } from "./vehicleColumns";
import { useModal } from "@/hooks/useModal";
import VehicleForm from "./VehicleForm";
import { toast } from "@/components/ui/use-toast";

export default function VehiclesDataTable({ data }) {
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => inventoryService.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["vehicles"]);
      toast({ title: "Vehículo eliminado con éxito" });
    },
    onError: () => {
      toast({ title: "Error al eliminar el vehículo", variant: "destructive" });
    },
  });

  const handleEdit = (vehicle) => {
    openModal(<VehicleForm vehicle={vehicle} />);
  };

  const handleDelete = (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este vehículo?")
    ) {
      deleteMutation.mutate(id);
    }
  };

  const tableColumns = vehicleColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return <DataTable columns={tableColumns} data={data} />;
}
