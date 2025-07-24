
"use client";

import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const commonAreaColumns = ({ onEdit, onDelete }) => [
  { accessorKey: "name", header: "Nombre" },
  { accessorKey: "description", header: "Descripción" },
  { accessorKey: "capacity", header: "Capacidad" },
  {
    id: "actions",
    cell: ({ row }) => {
      const commonArea = row.original;
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
            <DropdownMenuItem onClick={() => onEdit(commonArea)}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(commonArea.id)}>Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
