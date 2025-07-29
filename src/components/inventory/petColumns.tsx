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

export const petColumns = ({ onEdit, onDelete }) => [
  { accessorKey: "name", header: "Nombre" },
  { accessorKey: "type", header: "Tipo" },
  { accessorKey: "breed", header: "Raza" },
  { accessorKey: "residentName", header: "Residente" },
  {
    id: "actions",
    cell: ({ row }) => {
      const pet = row.original;
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
            <DropdownMenuItem onClick={() => onEdit(pet)}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(pet.id)}>
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
