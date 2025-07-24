
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { inventoryService } from '@/services/inventory.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useModal } from '@/hooks/useModal';
import { toast } from '@/components/ui/use-toast';

const formSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es requerido.' }),
  type: z.string().min(1, { message: 'El tipo es requerido.' }),
  breed: z.string().optional(),
  residentId: z.number(),
});

export default function PetForm({ pet }) {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: pet || {
      name: '',
      type: '',
      breed: '',
      residentId: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      pet
        ? inventoryService.updatePet(pet.id, data)
        : inventoryService.createPet(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['pets']);
      toast({ title: `Mascota ${pet ? 'actualizada' : 'creada'} con éxito` });
      closeModal();
    },
    onError: () => {
      toast({ title: `Error al ${pet ? 'actualizar' : 'crear'} la mascota`, variant: 'destructive' });
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="breed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Raza</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="residentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID de Residente</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? 'Guardando...' : 'Guardar'}
        </Button>
      </form>
    </Form>
  );
}
