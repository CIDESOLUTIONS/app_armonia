"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { staffService } from '@/services/staffService';
import StaffDataTable from '@/components/user-management/StaffDataTable';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useModal } from '@/hooks/useModal';
import StaffForm from '@/components/user-management/StaffForm';

export default function StaffPage() {
  const { openModal } = useModal();

  const { data: staffUsers, isLoading, error } = useQuery({
    queryKey: ['staffUsers'],
    queryFn: () => staffService.getStaffUsers(),
  });

  const handleAddStaff = () => {
    openModal(<StaffForm />);
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar el personal</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Personal Operativo</h1>
        <Button onClick={handleAddStaff}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Personal
        </Button>
      </div>
      <StaffDataTable data={staffUsers || []} />
    </div>
  );
}