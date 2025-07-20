"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  Loader2,
  PlusCircle,
  Edit,
  Trash2,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  getFees,
  createFee,
  updateFee,
  deleteFee,
  generateFees,
} from "@/services/feeService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { feeSchema, FeeFormValues } from "@/validators/fee-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Fee {
  id: number;
  name: string;
  description?: string;
  amount: number;
  type: "FIXED" | "VARIABLE";
  dueDate: string;
  isRecurring: boolean;
  frequency?: "MONTHLY" | "QUARTERLY" | "ANNUALLY";
  isActive: boolean;
}

export default function FeesPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFee, setCurrentFee] = useState<Fee | null>(null);
  const [isGeneratingFees, setIsGeneratingFees] = useState(false);

  const form = useForm<FeeFormValues>({
    resolver: zodResolver(feeSchema),
    defaultValues: {
      name: "",
      description: "",
      amount: 0,
      type: "FIXED",
      dueDate: "",
      isRecurring: false,
      frequency: undefined,
      isActive: true,
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { isSubmitting },
  } = form;

  const isRecurring = watch("isRecurring");

  const fetchFees = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFees();
      setFees(data);
    } catch (error: Error) {
      console.error("Error fetching fees:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las cuotas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchFees();
    }
  }, [authLoading, user, fetchFees]);

  const handleAddFee = () => {
    setCurrentFee(null);
    reset({
      name: "",
      description: "",
      amount: 0,
      type: "FIXED",
      dueDate: "",
      isRecurring: false,
      frequency: undefined,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEditFee = (fee: Fee) => {
    setCurrentFee(fee);
    reset({
      name: fee.name,
      description: fee.description || "",
      amount: fee.amount,
      type: fee.type,
      dueDate: fee.dueDate,
      isRecurring: fee.isRecurring,
      frequency: fee.frequency,
      isActive: fee.isActive,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: FeeFormValues) => {
    try {
      if (currentFee) {
        await updateFee(currentFee.id, data);
        toast({
          title: "Éxito",
          description: "Cuota actualizada correctamente.",
        });
      } else {
        await createFee(data);
        toast({
          title: "Éxito",
          description: "Cuota creada correctamente.",
        });
      }
      setIsModalOpen(false);
      fetchFees();
    } catch (error: Error) {
      console.error("Error saving fee:", error);
      toast({
        title: "Error",
        description: "Error al guardar la cuota.",
        variant: "destructive",
      });
    }
  };

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [feeToDelete, setFeeToDelete] = useState<number | null>(null);

  const handleDeleteFee = (id: number) => {
    setFeeToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteFee = async () => {
    if (feeToDelete === null) return;
    try {
      await deleteFee(feeToDelete);
      toast({
        title: "Éxito",
        description: "Cuota eliminada correctamente.",
      });
      fetchFees();
    } catch (error: Error) {
      console.error("Error deleting fee:", error);
      toast({
        title: "Error",
        description: "Error al eliminar la cuota.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setFeeToDelete(null);
    }
  };

  const handleGenerateFees = async () => {
    setIsGeneratingFees(true);
    try {
      await generateFees();
      toast({
        title: "Éxito",
        description: "Cuotas generadas para el próximo período.",
      });
      fetchFees();
    } catch (error: Error) {
      console.error("Error generating fees:", error);
      toast({
        title: "Error",
        description: "Error al generar las cuotas.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingFees(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || (user.role !== "ADMIN" && user.role !== "COMPLEX_ADMIN")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acceso Denegado
          </h1>
          <p className="text-gray-600">
            No tienes permisos para acceder a esta página.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Gestión de Cuotas de Administración
      </h1>

      <div className="flex justify-end mb-4">
        <Button onClick={handleAddFee}>
          <PlusCircle className="mr-2 h-4 w-4" /> Añadir Cuota
        </Button>
        <Button onClick={handleGenerateFees} disabled={isGeneratingFees}>
          {isGeneratingFees ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <DollarSign className="mr-2 h-4 w-4" />
          )}
          Generar Cuotas del Período
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Fecha Vencimiento</TableHead>
              <TableHead>Recurrente</TableHead>
              <TableHead>Frecuencia</TableHead>
              <TableHead>Activa</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fees.length > 0 ? (
              fees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell>{fee.name}</TableCell>
                  <TableCell>{fee.description}</TableCell>
                  <TableCell>{fee.amount}</TableCell>
                  <TableCell>{fee.type}</TableCell>
                  <TableCell>{fee.dueDate}</TableCell>
                  <TableCell>
                    {fee.isRecurring ? (
                      <Checkbox checked disabled />
                    ) : (
                      <Checkbox disabled />
                    )}
                  </TableCell>
                  <TableCell>{fee.frequency || "N/A"}</TableCell>
                  <TableCell>
                    {fee.isActive ? (
                      <Badge variant="default">Sí</Badge>
                    ) : (
                      <Badge variant="destructive">No</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditFee(fee)}
                      className="mr-2"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFee(fee.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-5">
                  No hay cuotas registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentFee ? "Editar Cuota" : "Añadir Nueva Cuota"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Nombre</FormLabel>
                    <FormControl>
                      <Input className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Descripción</FormLabel>
                    <FormControl>
                      <Textarea className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Monto</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="col-span-3"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="type"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="col-span-3 p-2 border rounded-md">
                          <SelectValue placeholder="Seleccionar Tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FIXED">Fija</SelectItem>
                        <SelectItem value="VARIABLE">Variable</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">
                      Fecha Vencimiento
                    </FormLabel>
                    <FormControl>
                      <Input type="date" className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="isRecurring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Es Recurrente</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isRecurring && (
                <FormField
                  control={control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Frecuencia</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="col-span-3 p-2 border rounded-md">
                            <SelectValue placeholder="Seleccionar Frecuencia" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MONTHLY">Mensual</SelectItem>
                          <SelectItem value="QUARTERLY">Trimestral</SelectItem>
                          <SelectItem value="ANNUALLY">Anual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="col-span-full text-right" />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Activa</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}{" "}
                  {currentFee ? "Guardar Cambios" : "Añadir Cuota"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar esta cuota? Esta acción no
              se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={confirmDeleteFee}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}