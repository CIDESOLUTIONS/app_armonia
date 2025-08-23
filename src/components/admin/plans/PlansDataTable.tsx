"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

export const PlansDataTable = ({ data }) => {
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
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
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
