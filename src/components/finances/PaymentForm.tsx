import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import {
  CreditCard,
  Banknote,
  Receipt,
  Lock,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Servicios y utilidades
import { createTransaction, processTransaction } from "@/lib/api/payments";
import { formatCurrency } from "@/lib/utils/format";

// Esquema de validación
const paymentSchema = z.object({
  amount: z.preprocess(
    (val) => Number(val),
    z.number().positive("El monto debe ser positivo."),
  ),
  description: z
    .string()
    .min(
      3,
      "La descripción es obligatoria y debe tener al menos 3 caracteres.",
    ),
  paymentMethodId: z.number().int().positive("Seleccione un método de pago."),
  invoiceId: z.number().optional(),
  savePaymentMethod: z.boolean().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

// Componente principal de pago
const PaymentForm = ({
  initialAmount = 0,
  invoiceId = null,
  description = "",
  onSuccess,
  onCancel,
}) => {
  const router = useRouter();
  const { data: session } = useSession();

  // Estados
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      name: "Tarjeta de Crédito",
      type: "CREDIT_CARD",
      icon: <CreditCard />,
    },
    { id: 2, name: "PSE - Débito bancario", type: "PSE", icon: <Banknote /> },
    {
      id: 3,
      name: "Efectivo (Efecty, Baloto)",
      type: "CASH",
      icon: <Receipt />,
    },
  ]);
  const [processingStatus, setProcessingStatus] = useState(null);

  // Configuración del formulario
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: initialAmount,
      description: description,
      paymentMethodId: 0, // Default to 0 or a valid initial ID
      invoiceId: invoiceId,
      savePaymentMethod: false,
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  // Observar método de pago seleccionado
  const selectedMethodId = watch("paymentMethodId");
  const selectedMethod = paymentMethods.find((m) => m.id === selectedMethodId);

  // Manejar envío del formulario
  const onSubmit = async (data: PaymentFormValues) => {
    try {
      setLoading(true);
      setProcessingStatus("processing");

      // Crear transacción
      const transaction = await createTransaction({
        ...data,
        returnUrl: `${window.location.origin}/payments/return`,
      });

      // Procesar transacción
      const result = await processTransaction(transaction.id);

      // Manejar redirección a pasarela si es necesario
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
        return;
      }

      // Actualizar estado
      setProcessingStatus("success");

      // Notificar éxito
      toast.success("Pago procesado correctamente");

      // Llamar callback de éxito
      if (onSuccess) {
        onSuccess(transaction);
      }

      // Redireccionar a página de confirmación
      setTimeout(() => {
        router.push(`/payments/confirmation/${transaction.id}`);
      }, 2000);
    } catch (error) {
      console.error("Error al procesar pago:", error);
      setProcessingStatus("error");
      toast.error("Error al procesar el pago. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Renderizar estado de procesamiento
  const renderProcessingStatus = () => {
    if (!processingStatus) return null;

    const statusConfig = {
      processing: {
        icon: <Loader2 className="h-10 w-10 animate-spin text-primary" />,
        title: "Procesando pago",
        description: "Por favor espere mientras procesamos su pago...",
      },
      success: {
        icon: <CheckCircle className="h-10 w-10 text-green-500" />,
        title: "Pago exitoso",
        description: "Su pago ha sido procesado correctamente.",
      },
      error: {
        icon: <XCircle className="h-10 w-10 text-red-500" />,
        title: "Error en el pago",
        description:
          "Ha ocurrido un error al procesar su pago. Por favor intente nuevamente.",
      },
    };

    const config = statusConfig[processingStatus];

    return (
      <div className="text-center py-4">
        {config.icon}
        <h3 className="text-lg font-semibold mt-2">{config.title}</h3>
        <p className="text-sm text-gray-500">{config.description}</p>
      </div>
    );
  };

  // Si está procesando, mostrar solo el estado
  if (processingStatus === "processing" || processingStatus === "success") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Procesando Pago</CardTitle>
        </CardHeader>
        <CardContent>{renderProcessingStatus()}</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Realizar Pago"
        description="Complete los datos para procesar su pago"
        // avatar={<LockIcon color="primary" />}
      />
      <CardContent>
        {processingStatus === "error" && (
          <div className="mb-3">{renderProcessingStatus()}</div>
        )}

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            {/* Monto */}
            <FormField
              control={control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto a pagar</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Ej: 100000"
                      // InputProps={{
                      //   startAdornment: (
                      //     <InputAdornment position="start">$</InputAdornment>
                      //   ),
                      // }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descripción */}
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ej: Pago de cuota de administración"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Métodos de pago */}
            <FormItem>
              <FormLabel>Seleccione un método de pago</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) =>
                    form.setValue("paymentMethodId", parseInt(value))
                  }
                  value={String(watch("paymentMethodId"))}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {paymentMethods.map((method) => (
                    <FormItem key={method.id}>
                      <FormLabel className="[&:has([data-state=checked])]:border-primary flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground">
                        <RadioGroupItem
                          value={String(method.id)}
                          className="sr-only"
                        />
                        {method.icon}
                        <span className="block text-sm font-medium mt-2">
                          {method.name}
                        </span>
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage>{errors.paymentMethodId?.message}</FormMessage>
            </FormItem>

            {/* Guardar método de pago */}
            {selectedMethod?.type === "CREDIT_CARD" && (
              <FormField
                control={control}
                name="savePaymentMethod"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Guardar esta tarjeta para pagos futuros
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            )}

            {/* Información adicional según método de pago */}
            {selectedMethod?.type === "PSE" && (
              <Card className="p-4 bg-blue-50 border-blue-200 text-blue-800">
                <CardTitle className="text-base">
                  Información importante
                </CardTitle>
                <CardDescription className="text-sm">
                  Al seleccionar PSE, será redirigido a su banco para completar
                  la transacción. Asegúrese de tener habilitado su servicio de
                  banca en línea.
                </CardDescription>
              </Card>
            )}

            {selectedMethod?.type === "CASH" && (
              <Card className="p-4 bg-yellow-50 border-yellow-200 text-yellow-800">
                <CardTitle className="text-base">
                  Información importante
                </CardTitle>
                <CardDescription className="text-sm">
                  Al seleccionar pago en efectivo, recibirá un código que deberá
                  presentar en los puntos de pago autorizados para completar la
                  transacción.
                </CardDescription>
              </Card>
            )}

            {/* Resumen de pago */}
            <Separator className="my-4" />
            <div className="flex justify-between items-center mb-2">
              <Label className="text-lg">Total a pagar:</Label>
              <span className="text-xl font-bold text-primary">
                {formatCurrency(watch("amount") || 0)}
              </span>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onCancel} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}{" "}
                Realizar Pago
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
