"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { inventoryService } from '@/services/inventory.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useModal } from '@/hooks/useModal';
import { toast } from '@/components/ui/use-toast';

const formSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es requerido.' }),
  email: z.string().email({ message: 'El email no es válido.' }),
  phone: z.string().optional(),
  propertyId: z.number(),
  isOwner: z.boolean(),
  biometricId: z.string().optional(),
});

export default function ResidentForm({ resident }) {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: resident || {
      name: '',
      email: '',
      phone: '',
      propertyId: undefined,
      isOwner: false,
      biometricId: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      resident
        ? inventoryService.updateResident(resident.id, data)
        : inventoryService.createResident(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['residents']);
      toast({ title: `Residente ${resident ? 'actualizado' : 'creado'} con éxito` });
      closeModal();
    },
    onError: () => {
      toast({ title: `Error al ${resident ? 'actualizar' : 'crear'} el residente`, variant: 'destructive' });
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="propertyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID de Inmueble</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="biometricId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Biométrico</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isOwner"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  ¿Es propietario?
                </FormLabel>
              </div>
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