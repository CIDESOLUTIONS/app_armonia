"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/format";

export const ComplexMetricsTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No hay datos de conjuntos residenciales para mostrar.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Desglose por Conjunto</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Conjunto Residencial</TableHead>
              <TableHead className="text-right">Residentes</TableHead>
              <TableHead className="text-right">Ingresos</TableHead>
              <TableHead className="text-right">Gastos</TableHead>
              <TableHead className="text-right">Cuotas Pendientes</TableHead>
              <TableHead className="text-right">PQRs Abiertos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((complex) => (
              <TableRow key={complex.id}>
                <TableCell className="font-medium">{complex.name}</TableCell>
                <TableCell className="text-right">{complex.residents}</TableCell>
                <TableCell className="text-right">{formatCurrency(complex.income)}</TableCell>
                <TableCell className="text-right">{formatCurrency(complex.expenses)}</TableCell>
                <TableCell className="text-right">{formatCurrency(complex.pendingFees)}</TableCell>
                <TableCell className="text-right">{complex.openPqrs}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
