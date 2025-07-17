import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';
import {
  FeeDto,
  CreateFeeDto,
  UpdateFeeDto,
  getFees,
  createFee,
  updateFee,
} from '@/services/financeService';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const fineFormSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio.'),
  description: z.string().optional(),
  amount: z.preprocess(
    (val) => Number(val),
    z.number().positive('El monto debe ser un número positivo.'),
  ),
  dueDate: z.string().min(1, 'La fecha de vencimiento es obligatoria.'),
  unitId: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().int().positive('La unidad debe ser un número entero positivo.').optional(),
  ),
  residentId: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().int().positive('El residente debe ser un número entero positivo.').optional(),
  ),
});

type FineFormValues = z.infer<typeof fineFormSchema>;

export function FineManagementForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [fines, setFines] = useState<FeeDto[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFine, setCurrentFine] = useState<FeeDto | null>(null);

  const form = useForm<FineFormValues>({
    resolver: zodResolver(fineFormSchema),
    defaultValues: {
      title: '',
      description: '',
      amount: 0,
      dueDate: '',
      unitId: undefined,
      residentId: undefined,
    },
  });

  const fetchFines = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getFees({ type: 'FINE' });
      setFines(response.data);
    } catch (error) {
      console.error('Error fetching fines:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las multas.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchFines();
  }, [fetchFines]);

  const onSubmit = async (values: FineFormValues) => {
    setLoading(true);
    try {
      const fineData: CreateFeeDto = {
        ...values,
        type: 'FINE',
        propertyId: 1, // TODO: Get actual propertyId from user context
      };

      if (isEditing && currentFine) {
        await updateFee(currentFine.id, fineData);
        toast({
          title: 'Éxito',
          description: 'Multa actualizada correctamente.',
        });
      } else {
        await createFee(fineData);
        toast({
          title: 'Éxito',
          description: 'Multa creada correctamente.',
        });
      }
      form.reset();
      setIsFormOpen(false);
      setIsEditing(false);
      setCurrentFine(null);
      fetchFines();
    } catch (error) {
      console.error('Error saving fine:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar la multa.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (fine: FeeDto) => {
    setIsEditing(true);
    setCurrentFine(fine);
    form.reset({
      title: fine.title,
      description: fine.description || '',
      amount: fine.amount,
      dueDate: fine.dueDate.split('T')[0], // Format date for input type="date"
      unitId: fine.unitId || undefined,
      residentId: fine.residentId || undefined,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta multa?')) {
      return;
    }
    setLoading(true);
    try {
      await deleteFee(id);
      toast({
        title: 'Éxito',
        description: 'Multa eliminada correctamente.',
      });
      fetchFines();
    } catch (error) {
      console.error('Error deleting fine:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la multa.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: FeeDto['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Multas e Intereses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button onClick={() => {
            setIsFormOpen(true);
            setIsEditing(false);
            setCurrentFine(null);
            form.reset();
          }}>
            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Multa
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : fines.length === 0 ? (
          <p className="text-center text-gray-500">No hay multas registradas.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Residente</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fines.map((fine) => (
                <TableRow key={fine.id}>
                  <TableCell>{fine.title}</TableCell>
                  <TableCell>${fine.amount.toFixed(2)}</TableCell>
                  <TableCell>{new Date(fine.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{fine.unitId || 'N/A'}</TableCell>
                  <TableCell>{fine.residentId || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(fine.status)}>{fine.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(fine)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(fine.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Editar Multa' : 'Añadir Nueva Multa'}</DialogTitle>
              <DialogDescription>
                {isEditing ? 'Modifica los detalles de la multa.' : 'Crea una nueva multa para una unidad o residente.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input id="title" {...form.register('title')} />
                {form.formState.errors.title && (
                  <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>
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
                  <p className="text-red-500 text-sm">{form.formState.errors.amount.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="dueDate">Fecha de Vencimiento</Label>
                <Input id="dueDate" type="date" {...form.register('dueDate')} />
                {form.formState.errors.dueDate && (
                  <p className="text-red-500 text-sm">{form.formState.errors.dueDate.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="unitId">ID de Unidad (Opcional)</Label>
                <Input id="unitId" type="number" {...form.register('unitId')} />
                {form.formState.errors.unitId && (
                  <p className="text-red-500 text-sm">{form.formState.errors.unitId.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="residentId">ID de Residente (Opcional)</Label>
                <Input id="residentId" type="number" {...form.register('residentId')} />
                {form.formState.errors.residentId && (
                  <p className="text-red-500 text-sm">{form.formState.errors.residentId.message}</p>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isEditing ? 'Guardar Cambios' : 'Añadir Multa'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
