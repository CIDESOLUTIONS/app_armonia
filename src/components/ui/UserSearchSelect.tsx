
"use client";

import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface UserSearchSelectProps {
  onUserSelect: (userId: number | null) => void;
  initialUserId?: number | null;
}

interface User {
  id: number;
  name: string;
  email: string;
}

export function UserSearchSelect({ onUserSelect, initialUserId }: UserSearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number | null>(initialUserId || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchTerm.length < 2) {
        setUsers([]);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`/api/users/search?q=${searchTerm}`);
        if (!response.ok) {
          throw new Error("Error al buscar usuarios.");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    const handler = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (initialUserId) {
      // Si hay un initialUserId, buscar el usuario para mostrar su nombre
      const fetchInitialUser = async () => {
        try {
          const response = await fetch(`/api/users/${initialUserId}`);
          if (response.ok) {
            const data = await response.json();
            setValue(data.id);
          }
        } catch (error) {
          console.error("Error fetching initial user:", error);
        }
      };
      fetchInitialUser();
    }
  }, [initialUserId]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? users.find((user) => user.id === value)?.name ||
              (initialUserId && initialUserId === value
                ? `ID: ${initialUserId}`
                : "Seleccionar usuario...")
            : "Seleccionar usuario..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder="Buscar usuario..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandEmpty>
            {loading ? "Cargando..." : "No se encontraron usuarios."}
          </CommandEmpty>
          <CommandGroup>
            {users.map((user) => (
              <CommandItem
                key={user.id}
                value={user.name}
                onSelect={() => {
                  setValue(user.id);
                  onUserSelect(user.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === user.id ? "opacity-100" : "opacity-0",
                  )}
                />
                {user.name} ({user.email})
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
