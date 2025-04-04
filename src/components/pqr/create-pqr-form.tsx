import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// Esquema de validación para la creación de PQR
const createPQRSchema = z.object({
  type: z.enum(['PETITION', 'COMPLAINT', 'CLAIM'], {
    required_error: 'Debe seleccionar un tipo de PQR'
  }),
  title: z.string()
    .min(5, { message: 'El título debe tener al menos 5 caracteres' })
    .max(100, { message: 'El título no puede exceder 100 caracteres' }),
  description: z.string()
    .min(10, { message: 'La descripción debe tener al menos 10 caracteres' })
    .max(500, { message: 'La descripción no puede exceder 500 caracteres' }),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    required_error: 'Debe seleccionar una prioridad'
  })
});

interface CreatePQRFormProps {
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

export function CreatePQRForm({ onSubmit, onCancel }: CreatePQRFormProps) {
  const form = useForm({
    resolver: zodResolver(createPQRSchema),
    defaultValues: {
      type: undefined,
      title: '',
      description: '',
      priority: undefined
    }
  });

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de PQR</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PETITION">Petición</SelectItem>
                  <SelectItem value="COMPLAINT">Queja</SelectItem>
                  <SelectItem value="CLAIM">Reclamo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título de la PQR" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describa detalladamente su solicitud" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prioridad</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una prioridad" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="LOW">Baja</SelectItem>
                  <SelectItem value="MEDIUM">Media</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancelar
            </Button>
          )}
          <Button type="submit">
            Crear PQR
          </Button>
        </div>
      </form>
    </Form>
  );
}
