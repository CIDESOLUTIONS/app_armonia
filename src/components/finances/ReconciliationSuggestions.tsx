"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ReconciliationSuggestion {
  statementEntry: unknown;
  payment: unknown;
  status: string;
}

interface Props {
  suggestions: ReconciliationSuggestion[];
}

import { approveReconciliation } from "@/services/financeService";

export function ReconciliationSuggestions({ suggestions }: Props) {
  const handleApprove = async (suggestion: ReconciliationSuggestion) => {
    try {
      await approveReconciliation(suggestion);
      // Aquí podrías actualizar el estado local o recargar las sugerencias
      
    } catch (error) {
      console.error("Error al aprobar la conciliación:", error);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">
        Sugerencias de Conciliación
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha (Extracto)</TableHead>
            <TableHead>Descripción (Extracto)</TableHead>
            <TableHead>Monto (Extracto)</TableHead>
            <TableHead>Residente (Sugerido)</TableHead>
            <TableHead>Monto (Sugerido)</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suggestions.map((s, i) => (
            <TableRow key={i}>
              <TableCell>{s.statementEntry.date}</TableCell>
              <TableCell>{s.statementEntry.description}</TableCell>
              <TableCell>{s.statementEntry.amount}</TableCell>
              <TableCell>{s.payment?.resident.name || "N/A"}</TableCell>
              <TableCell>{s.payment?.amount || "N/A"}</TableCell>
              <TableCell>{s.status}</TableCell>
              <TableCell>
                {s.status === "SUGGESTED" && (
                  <Button onClick={() => handleApprove(s)} size="sm">
                    Aprobar
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
