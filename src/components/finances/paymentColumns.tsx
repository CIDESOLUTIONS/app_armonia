"use client";

import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const paymentColumns = ({ onDelete }) => [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "feeId", header: "ID Cuota" },
  { accessorKey: "userId", header: "ID Usuario" },
  { accessorKey: "amount", header: "Monto" },
  { accessorKey: "paymentDate", header: "Fecha Pago" },
  { accessorKey: "status", header: "Estado" },
  { accessorKey: "paymentMethod", header: "Método Pago" },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onDelete(payment.id)}>
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
