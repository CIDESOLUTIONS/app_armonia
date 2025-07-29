"use client";

import React from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { staffService } from "@/services/staffService";
import { DataTable } from "@/components/ui/data-table";
import { staffColumns } from "./staffColumns";
import { useModal } from "@/hooks/useModal";
import StaffForm from "./StaffForm";
import { toast } from "@/components/ui/use-toast";

export default function StaffDataTable({ data }) {
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => staffService.deleteStaffUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["staffUsers"]);
      toast({ title: "Usuario de personal eliminado con éxito" });
    },
    onError: () => {
      toast({
        title: "Error al eliminar el usuario de personal",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (staffUser) => {
    openModal(<StaffForm staffUser={staffUser} />);
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar este usuario de personal?",
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  const tableColumns = staffColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return <DataTable columns={tableColumns} data={data} />;
}
