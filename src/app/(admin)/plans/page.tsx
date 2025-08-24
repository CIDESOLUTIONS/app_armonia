'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPlans, createPlan, updatePlan, deletePlan, Plan } from '@/services/planService';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { PlansDataTable } from '@/components/admin/plans/PlansDataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PlanForm } from '@/components/admin/plans/PlanForm';
import { useToast } from '@/components/ui/use-toast';

export default function PlansManagementPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const { data: plans, isLoading, error } = useQuery<Plan[]>({
    queryKey: ['plans'],
    queryFn: () => getPlans(true), // Include inactive for admin view
  });

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      setIsDialogOpen(false);
      setEditingPlan(null);
      toast({ title: 'Éxito', description: 'La operación se completó correctamente.' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: `Ocurrió un error: ${error.message}`, variant: 'destructive' });
    },
  };

  const createMutation = useMutation({ mutationFn: createPlan, ...mutationOptions });
  const updateMutation = useMutation({ mutationFn: (data: Partial<Plan>) => updatePlan(editingPlan!.id, data), ...mutationOptions });
  const deleteMutation = useMutation({ mutationFn: deletePlan, ...mutationOptions });

  const handleCreateClick = () => {
    setEditingPlan(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (plan: Plan) => {
    const planForEdit = { ...plan, features: (plan.features || []).join(', ') };
    setEditingPlan(planForEdit as any);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (planId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este plan?')) {
      deleteMutation.mutate(planId);
    }
  };

  const handleFormSubmit = (data: Partial<Plan>) => {
    if (editingPlan) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) return <div>Cargando planes...</div>;
  if (error) return <div>Error al cargar los planes.</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Planes y Suscripciones</h1>
        <Button onClick={handleCreateClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Nuevo Plan
        </Button>
      </div>
      <PlansDataTable data={plans || []} onEdit={handleEditClick} onDelete={handleDeleteClick} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPlan ? 'Editar Plan' : 'Crear Nuevo Plan'}</DialogTitle>
            <DialogDescription>
              {editingPlan ? `Editando el plan \"${editingPlan.name}\".` : 'Completa los detalles para crear un nuevo plan.'}
            </DialogDescription>
          </DialogHeader>
          <PlanForm 
            initialData={editingPlan}
            onSubmit={handleFormSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}