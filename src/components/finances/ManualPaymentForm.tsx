import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { registerManualPayment } from "@/services/financeService"; // Assuming financeService exists
import { getFees } from "@/services/feeService"; // Assuming feeService exists
import { getResidents } from "@/services/residentService"; // Assuming residentService exists
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  feeId: z.number().min(1, "La cuota es requerida."),
  userId: z.number().min(1, "El usuario es requerido."),
  amount: z.number().positive("El monto debe ser un número positivo."),
  paymentDate: z.string().min(1, "La fecha de pago es requerida."),
  paymentMethod: z.string().min(1, "El método de pago es requerido."),
  transactionId: z.string().optional(),
});

type ManualPaymentFormValues = z.infer<typeof formSchema>;

interface FeeOption {
  id: number;
  name: string;
  amount: number;
  dueDate: string;
}

interface ResidentOption {
  id: number;
  name: string;
}

export function ManualPaymentForm() {
  const { toast } = useToast();
  const [fees, setFees] = useState<FeeOption[]>([]);
  const [residents, setResidents] = useState<ResidentOption[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<ManualPaymentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feeId: 0,
      userId: 0,
      amount: 0,
      paymentDate: new Date().toISOString().slice(0, 10),
      paymentMethod: "",
      transactionId: "",
    },
  });

  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [feesData, residentsData] = await Promise.all([
          getFees({ status: "PENDING" }), // Only fetch pending fees
          getResidents(),
        ]);
        setFees(feesData.fees.map((fee: any) => ({ id: fee.id, name: fee.title, amount: fee.amount, dueDate: fee.dueDate })) || []);
        setResidents(residentsData.map((resident: any) => ({ id: resident.id, name: resident.name })) || []);
      } catch (error: any) {
        console.error("Error fetching data for manual payment form:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos necesarios para el formulario de pago manual.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const onSubmit = async (data: ManualPaymentFormValues) => {
    try {
      await registerManualPayment(data);
      toast({
        title: "Éxito",
        description: "Pago manual registrado correctamente.",
      });
      reset();
    } catch (error: any) {
      console.error("Error registering manual payment:", error);
      toast({
        title: "Error",
        description: "Error al registrar el pago manual: " + error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <FormField
            control={control}
            name="feeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cuota</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(parseInt(value));
                    const selectedFee = fees.find(fee => fee.id === parseInt(value));
                    if (selectedFee) {
                      form.setValue("amount", selectedFee.amount);
                    }
                  }}
                  value={field.value ? String(field.value) : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar Cuota" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {fees.map((fee) => (
                      <SelectItem key={fee.id} value={String(fee.id)}>
                        {fee.name} - ${fee.amount.toFixed(2)} (Vence: {fee.dueDate})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Residente</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value ? String(field.value) : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar Residente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {residents.map((resident) => (
                      <SelectItem key={resident.id} value={String(resident.id)}>
                        {resident.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monto</FormLabel>
                <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="paymentDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Pago</FormLabel>
                <Input type="date" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Método de Pago</FormLabel>
                <Input placeholder="Ej: Efectivo, Transferencia" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="transactionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID de Transacción (Opcional)</FormLabel>
                <Input placeholder="Ej: Ref123" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}{" "}
            Registrar Pago Manual
          </Button>
        </form>
      </Form>
    </div>
  );
}
