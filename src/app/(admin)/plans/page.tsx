"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getPlans } from "@/services/planService";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { PlansDataTable } from "@/components/admin/plans/PlansDataTable";

export default function PlansManagementPage() {
  const { data: plans, isLoading, error } = useQuery({
    queryKey: ["plans"],
    queryFn: () => getPlans(true), // Include inactive for admin view
  });

  const handleCreatePlan = () => {
    // Logic to open a creation modal/form
    console.log("Open create plan form");
  };

  if (isLoading) return <div>Cargando planes...</div>;
  if (error) return <div>Error al cargar los planes.</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Planes y Suscripciones</h1>
        <Button onClick={handleCreatePlan}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Nuevo Plan
        </Button>
      </div>
      <PlansDataTable data={plans || []} />
    </div>
  );
}
