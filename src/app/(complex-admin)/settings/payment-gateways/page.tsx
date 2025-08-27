"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, PlusCircle, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
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
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getPaymentGateways,
  createPaymentGateway,
  updatePaymentGateway,
  deletePaymentGateway,
  PaymentGatewayConfigDto,
  PaymentGatewayType,
  CreatePaymentGatewayDto,
  UpdatePaymentGatewayDto,
} from "@/services/paymentGatewayService";
import { Badge } from "@/components/ui/badge";

const gatewaySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  type: z.nativeEnum(PaymentGatewayType),
  apiKey: z.string().min(1, "La clave API es requerida"),
  secretKey: z.string().min(1, "La clave secreta es requerida"),
  webhookSecret: z.string().optional(),
  isActive: z.boolean(),
  testMode: z.boolean(),
});

type GatewayFormData = z.infer<typeof gatewaySchema>;

export default function PaymentGatewaysPage() {
  const { toast } = useToast();
  const [gateways, setGateways] = useState<PaymentGatewayConfigDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGateway, setEditingGateway] =
    useState<PaymentGatewayConfigDto | null>(null);

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm<GatewayFormData>({
    resolver: zodResolver(gatewaySchema),
    defaultValues: {
      name: "",
      type: PaymentGatewayType.STRIPE,
      apiKey: "",
      secretKey: "",
      webhookSecret: "",
      isActive: true,
      testMode: true,
    },
  });

  const fetchGateways = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPaymentGateways();
      setGateways(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las pasarelas de pago.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchGateways();
  }, [fetchGateways]);

  const handleOpenDialog = (gateway: PaymentGatewayConfigDto | null = null) => {
    setEditingGateway(gateway);
    if (gateway) {
      reset({
        name: gateway.name,
        type: gateway.type,
        apiKey: gateway.apiKey, // Note: This will be masked
        secretKey: gateway.secretKey, // Note: This will be masked
        webhookSecret: "", // Not provided by API for security
        isActive: gateway.isActive,
        testMode: gateway.testMode,
      });
    } else {
      reset({
        name: "",
        type: PaymentGatewayType.STRIPE,
        apiKey: "",
        secretKey: "",
        webhookSecret: "",
        isActive: true,
        testMode: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta pasarela?")) return;

    try {
      await deletePaymentGateway(id);
      toast({
        title: "Éxito",
        description: "Pasarela de pago eliminada correctamente.",
      });
      fetchGateways();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la pasarela de pago.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: GatewayFormData) => {
    setIsSubmitting(true);
    try {
      const payload: CreatePaymentGatewayDto | UpdatePaymentGatewayDto = {
        ...data,
      };

      if (editingGateway) {
        // If keys haven't changed, don't send them
        if (data.apiKey === editingGateway.apiKey) delete payload.apiKey;
        if (data.secretKey === editingGateway.secretKey) delete payload.secretKey;
        await updatePaymentGateway(editingGateway.id, payload);
      } else {
        await createPaymentGateway(payload as CreatePaymentGatewayDto);
      }

      toast({
        title: "Éxito",
        description: `Pasarela de pago ${
          editingGateway ? "actualizada" : "creada"
        } correctamente.`,
      });
      fetchGateways();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `No se pudo ${
          editingGateway ? "actualizar" : "crear"
        } la pasarela.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Pasarelas de Pago
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir Pasarela
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingGateway ? "Editar" : "Añadir"} Pasarela de Pago
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nombre
                  </Label>
                  <Input id="name" {...register("name")} className="col-span-3" />
                  {errors.name && <p className="col-span-4 text-red-500 text-sm">{errors.name.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Tipo
                  </Label>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(PaymentGatewayType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="apiKey" className="text-right">
                    Clave API
                  </Label>
                  <Input id="apiKey" {...register("apiKey")} className="col-span-3" placeholder={editingGateway ? "Sin cambios" : ""}/>
                  {errors.apiKey && <p className="col-span-4 text-red-500 text-sm">{errors.apiKey.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="secretKey" className="text-right">
                    Clave Secreta
                  </Label>
                  <Input id="secretKey" {...register("secretKey")} className="col-span-3" placeholder={editingGateway ? "Sin cambios" : ""}/>
                  {errors.secretKey && <p className="col-span-4 text-red-500 text-sm">{errors.secretKey.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="webhookSecret" className="text-right">
                    Webhook Secret
                  </Label>
                  <Input id="webhookSecret" {...register("webhookSecret")} className="col-span-3" />
                </div>
                <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center space-x-2">
                        <Controller
                            name="isActive"
                            control={control}
                            render={({ field }) => <Switch id="isActive" checked={field.value} onCheckedChange={field.onChange} />}
                        />
                        <Label htmlFor="isActive">Activa</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Controller
                            name="testMode"
                            control={control}
                            render={({ field }) => <Switch id="testMode" checked={field.value} onCheckedChange={field.onChange} />}
                        />
                        <Label htmlFor="testMode">Modo de Prueba</Label>
                    </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingGateway ? "Guardar Cambios" : "Crear Pasarela"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Modo de Prueba</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gateways.length > 0 ? (
              gateways.map((gateway) => (
                <TableRow key={gateway.id}>
                  <TableCell className="font-medium">{gateway.name}</TableCell>
                  <TableCell>{gateway.type}</TableCell>
                  <TableCell>
                    <Badge variant={gateway.testMode ? "outline" : "default"}>
                      {gateway.testMode ? "Sí" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={gateway.isActive ? "default" : "destructive"}>
                      {gateway.isActive ? "Activa" : "Inactiva"}
                    </badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(gateway)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(gateway.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No hay pasarelas de pago configuradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
