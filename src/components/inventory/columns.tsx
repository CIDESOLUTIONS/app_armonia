
"use client";

import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const columns = ({ onEdit, onDelete }) => [
  { accessorKey: "unitNumber", header: "Unidad" },
  { accessorKey: "type", header: "Tipo" },
  { accessorKey: "status", header: "Estado" },
  { accessorKey: "ownerName", header: "Propietario" },
  {
    id: "actions",
    cell: ({ row }) => {
      const property = row.original;
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
            <DropdownMenuItem onClick={() => onEdit(property)}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(property.id)}>Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
