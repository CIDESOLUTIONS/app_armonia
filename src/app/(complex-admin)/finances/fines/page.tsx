"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, PlusCircle, Edit, Trash2 } from "lucide-react";
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
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  getFees,
  createFee,
  updateFee,
  deleteFee,
  FeeDto,
} from "@/services/feeService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { feeSchema, FeeFormValues } from "@/validators/fee-schema";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function FinesPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [fines, setFines] = useState<FeeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFine, setCurrentFine] = useState<FeeDto | null>(null);

  const form = useForm<FeeFormValues>({
    resolver: zodResolver(feeSchema),
    defaultValues: {
      title: "",
      description: "",
      amount: 0,
      dueDate: "",
      type: "FINE",
      propertyId: undefined,
      unitId: undefined,
      residentId: undefined,
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  const fetchFines = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFees({ type: "FINE" });
      setFines(data.data);
    } catch (error: Error) {
      console.error("Error fetching fines:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las multas: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchFines();
    }
  }, [authLoading, user, fetchFines]);

  const handleAddFine = () => {
    setCurrentFine(null);
    reset({
      title: "",
      description: "",
      amount: 0,
      dueDate: "",
      type: "FINE",
      propertyId: undefined,
      unitId: undefined,
      residentId: undefined,
    });
    setIsModalOpen(true);
  };

  const handleEditFine = (fine: FeeDto) => {
    setCurrentFine(fine);
    reset({
      title: fine.title,
      description: fine.description || "",
      amount: fine.amount,
      dueDate: fine.dueDate.split("T")[0], // Assuming date only for input type="date"
      type: fine.type,
      propertyId: fine.propertyId,
      unitId: fine.unitId || undefined,
      residentId: fine.residentId || undefined,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: FeeFormValues) => {
    try {
      if (currentFine) {
        await updateFee(currentFine.id, data);
        toast({
          title: "Éxito",
          description: "Multa actualizada correctamente.",
        });
      } else {
        await createFee(data);
        toast({
          title: "Éxito",
          description: "Multa creada correctamente.",
        });
      }
      setIsModalOpen(false);
      fetchFines();
    } catch (error: Error) {
      console.error("Error saving fine:", error);
      toast({
        title: "Error",
        description: "Error al guardar la multa: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteFine = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta multa?")) return;
    try {
      await deleteFee(id);
      toast({
        title: "Éxito",
        description: "Multa eliminada correctamente.",
      });
      fetchFines();
    } catch (error: Error) {
      console.error("Error deleting fine:", error);
      toast({
        title: "Error",
        description: "Error al eliminar la multa: " + error.message,
        variant: "destructive",
      });
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
        Gestión de Multas
      </h1>

      <div className="flex justify-end mb-4">
        <Button onClick={handleAddFine}>
          <PlusCircle className="mr-2 h-4 w-4" /> Añadir Multa
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Fecha Vencimiento</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Propiedad</TableHead>
              <TableHead>Unidad</TableHead>
              <TableHead>Residente</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fines.length > 0 ? (
              fines.map((fine) => (
                <TableRow key={fine.id}>
                  <TableCell>{fine.title}</TableCell>
                  <TableCell>${fine.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(fine.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        fine.status === "PENDING"
                          ? "destructive"
                          : fine.status === "PAID"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {fine.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{fine.propertyId || "N/A"}</TableCell>
                  <TableCell>{fine.unitId || "N/A"}</TableCell>
                  <TableCell>{fine.residentId || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditFine(fine)}
                      className="mr-2"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFine(fine.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-5">
                  No hay multas registradas.
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
              {currentFine ? "Editar Multa" : "Añadir Nueva Multa"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Título</FormLabel>
                    <FormControl>
                      <Input id="title" {...field} className="col-span-3" />
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
                      <Textarea
                        id="description"
                        {...field}
                        className="col-span-3"
                      />
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
                        id="amount"
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                        className="col-span-3"
                      />
                    </FormControl>
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
                      <Input
                        id="dueDate"
                        type="date"
                        {...field}
                        className="col-span-3"
                      />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="propertyId"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Propiedad ID</FormLabel>
                    <FormControl>
                      <Input
                        id="propertyId"
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                        className="col-span-3"
                      />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="unitId"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Unidad ID</FormLabel>
                    <FormControl>
                      <Input
                        id="unitId"
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                        className="col-span-3"
                      />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="residentId"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Residente ID</FormLabel>
                    <FormControl>
                      <Input
                        id="residentId"
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                        className="col-span-3"
                      />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}{" "}
                  {currentFine ? "Guardar Cambios" : "Añadir Multa"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
