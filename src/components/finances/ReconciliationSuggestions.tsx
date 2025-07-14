
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
  statementEntry: any;
  payment: any;
  status: string;
}

interface Props {
  suggestions: ReconciliationSuggestion[];
}

export function ReconciliationSuggestions({ suggestions }: Props) {
  const handleApprove = (suggestion: ReconciliationSuggestion) => {
    // Lógica para aprobar la conciliación
    console.log("Approving:", suggestion);
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Sugerencias de Conciliación</h3>
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
