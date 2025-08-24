'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Plan } from '@/services/planService';

interface PlansDataTableProps {
  data: Plan[];
  onEdit: (plan: Plan) => void;
  onDelete: (planId: string) => void;
}

export const PlansDataTable: React.FC<PlansDataTableProps> = ({ data, onEdit, onDelete }) => {
  if (!data || data.length === 0) {
    return <p>No hay planes para mostrar.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planes Disponibles</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre del Plan</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Ciclo</TableHead>
              <TableHead>Suscriptores</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.name}</TableCell>
                <TableCell>{formatCurrency(plan.price)}</TableCell>
                <TableCell>{plan.billingCycle}</TableCell>
                <TableCell>{plan.subscriberCount || 0}</TableCell>
                <TableCell>
                  <Badge variant={plan.isActive ? "default" : "destructive"}>
                    {plan.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(plan)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(plan.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};