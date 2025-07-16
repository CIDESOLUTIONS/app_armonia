import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { generateOrdinaryFees } from '@/services/financeService';

const formSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio.'),
  description: z.string().optional(),
  amount: z.preprocess(
    (val) => Number(val),
    z.number().positive('El monto debe ser un número positivo.'),
  ),
  dueDate: z.string().min(1, 'La fecha de vencimiento es obligatoria.'),
});

type FeeFormValues = z.infer<typeof formSchema>;

export function FeeGenerationForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<FeeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      amount: 0,
      dueDate: '',
    },
  });

  const onSubmit = async (values: FeeFormValues) => {
    setLoading(true);
    try {
      await generateOrdinaryFees(values.amount, values.dueDate, values.title, values.description);
      toast({
        title: 'Éxito',
        description: 'Cuotas generadas correctamente.',
      });
      form.reset();
    } catch (error) {
      console.error('Error generating fees:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron generar las cuotas.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generación de Cuotas</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input id="title" {...form.register('title')} />
            {form.formState.errors.title && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Descripción (Opcional)</Label>
            <Textarea id="description" {...form.register('description')} />
          </div>
          <div>
            <Label htmlFor="amount">Monto</Label>
            <Input id="amount" type="number" step="0.01" {...form.register('amount')} />
            {form.formState.errors.amount && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.amount.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="dueDate">Fecha de Vencimiento</Label>
            <Input id="dueDate" type="date" {...form.register('dueDate')} />
            {form.formState.errors.dueDate && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.dueDate.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Generar Cuotas
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
