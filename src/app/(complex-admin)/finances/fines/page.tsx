import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, PlusCircle, Edit, Trash2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  getFines,
  createFine,
  updateFine,
  deleteFine,
} from "@/services/fineService"; // Assuming fineService exists
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fineSchema, FineFormValues } from "@/validators/fine-schema"; // Assuming fine-schema exists
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getResidents } from "@/services/residentService";
import { getProperties } from "@/services/propertyService";

interface Fine {
  id: number;
  residentId: number;
  residentName: string;
  propertyId: number;
  unitNumber: string;
  reason: string;
  amount: number;
  issuedDate: string;
  paid: boolean;
}

interface ResidentOption {
  id: number;
  name: string;
}

interface PropertyOption {
  id: number;
  unitNumber: string;
}

export default function FinesPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFine, setCurrentFine] = useState<Fine | null>(null);
  const [residents, setResidents] = useState<ResidentOption[]>([]);
  const [properties, setProperties] = useState<PropertyOption[]>([]);

  const form = useForm<FineFormValues>({
    resolver: zodResolver(fineSchema),
    defaultValues: {
      residentId: 0,
      propertyId: 0,
      reason: "",
      amount: 0,
      issuedDate: "",
      paid: false,
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  const fetchFinesAndRelatedData = useCallback(async () => {
    setLoading(true);
    try {
      const [finesData, residentsData, propertiesData] = await Promise.all([
        getFines(),
        getResidents(),
        getProperties(),
      ]);
      setFines(finesData);
      setResidents(residentsData.map((r: any) => ({ id: r.id, name: r.name })));
      setProperties(propertiesData.map((p: any) => ({ id: p.id, unitNumber: p.unitNumber })));
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchFinesAndRelatedData();
    }
  }, [authLoading, user, fetchFinesAndRelatedData]);

  const handleAddFine = () => {
    setCurrentFine(null);
    reset({
      residentId: 0,
      propertyId: 0,
      reason: "",
      amount: 0,
      issuedDate: "",
      paid: false,
    });
    setIsModalOpen(true);
  };

  const handleEditFine = (fine: Fine) => {
    setCurrentFine(fine);
    reset({
      residentId: fine.residentId,
      propertyId: fine.propertyId,
      reason: fine.reason,
      amount: fine.amount,
      issuedDate: fine.issuedDate,
      paid: fine.paid,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: FineFormValues) => {
    try {
      if (currentFine) {
        await updateFine(currentFine.id, data);
        toast({
          title: "Éxito",
          description: "Multa actualizada correctamente.",
        });
      } else {
        await createFine(data);
        toast({
          title: "Éxito",
          description: "Multa creada correctamente.",
        });
      }
      setIsModalOpen(false);
      fetchFinesAndRelatedData();
    } catch (error) {
      console.error("Error saving fine:", error);
      toast({
        title: "Error",
        description: "Error al guardar la multa.",
        variant: "destructive",
      });
    }
  };

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [fineToDelete, setFineToDelete] = useState<number | null>(null);

  const handleDeleteFine = (id: number) => {
    setFineToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteFine = async () => {
    if (fineToDelete === null) return;
    try {
      await deleteFine(fineToDelete);
      toast({
        title: "Éxito",
        description: "Multa eliminada correctamente.",
      });
      fetchFinesAndRelatedData();
    } catch (error) {
      console.error("Error deleting fine:", error);
      toast({
        title: "Error",
        description: "Error al eliminar la multa.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setFineToDelete(null);
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
        Gestión de Multas e Intereses por Mora
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
              <TableHead>Residente</TableHead>
              <TableHead>Propiedad</TableHead>
              <TableHead>Razón</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Fecha Emisión</TableHead>
              <TableHead>Pagada</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fines.length > 0 ? (
              fines.map((fine) => (
                <TableRow key={fine.id}>
                  <TableCell>{fine.residentName}</TableCell>
                  <TableCell>{fine.unitNumber}</TableCell>
                  <TableCell>{fine.reason}</TableCell>
                  <TableCell>{fine.amount}</TableCell>
                  <TableCell>{fine.issuedDate}</TableCell>
                  <TableCell>
                    {fine.paid ? (
                      <Checkbox checked disabled />
                    ) : (
                      <Checkbox disabled />
                    )}
                  </TableCell>
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
                <TableCell colSpan={7} className="text-center py-5">
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
                name="residentId"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Residente</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value ? String(field.value) : ""}
                    >
                      <FormControl>
                        <SelectTrigger className="col-span-3 p-2 border rounded-md">
                          <SelectValue placeholder="Seleccionar Residente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {residents.map((resident) => (
                          <SelectItem
                            key={resident.id}
                            value={String(resident.id)}
                          >
                            {resident.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="propertyId"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Propiedad</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value ? String(field.value) : ""}
                    >
                      <FormControl>
                        <SelectTrigger className="col-span-3 p-2 border rounded-md">
                          <SelectValue placeholder="Seleccionar Propiedad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {properties.map((property) => (
                          <SelectItem
                            key={property.id}
                            value={String(property.id)}
                          >
                            {property.unitNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="reason"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Razón</FormLabel>
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
                name="issuedDate"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Fecha Emisión</FormLabel>
                    <FormControl>
                      <Input type="date" className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="paid"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Pagada</FormLabel>
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
                  {currentFine ? "Guardar Cambios" : "Añadir Multa"}
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
              ¿Estás seguro de que quieres eliminar esta multa? Esta acción no
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
            <Button onClick={confirmDeleteFine}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}