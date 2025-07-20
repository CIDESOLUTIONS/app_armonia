"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Download, Camera } from "lucide-react";
import {
  createPreRegisteredVisitor,
  uploadVisitorImage,
} from "@/services/visitorService";
import { getUserProfile } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";
import QRCode from "qrcode";

const formSchema = z.object({
  name: z.string().min(3, "El nombre es requerido."),
  documentType: z.string().min(1, "El tipo de documento es requerido."),
  documentNumber: z.string().min(5, "El número de documento es requerido."),
  expectedDate: z.string().min(1, "La fecha esperada es requerida."),
  validFrom: z.string().min(1, "La fecha de inicio de validez es requerida."),
  validUntil: z.string().min(1, "La fecha de fin de validez es requerida."),
  purpose: z.string().optional(),
  photo: z.any().optional(), // Keep as any for now, as File type is tricky with Zod and file inputs
});

export default function PreRegisterVisitorPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userUnitId, setUserUnitId] = useState<number | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [visitorId, setVisitorId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserUnitId = async () => {
      if (user?.id) {
        try {
          const userProfile = await getUserProfile(user.id);
          if (userProfile && userProfile.unitId) {
            setUserUnitId(userProfile.unitId);
          } else {
            toast({
              title: "Advertencia",
              description: "No se encontró la unidad asociada a su perfil.",
              variant: "warning",
            });
          }
        } catch (error: Error) {
          console.error("Error fetching user unitId:", error);
          toast({
            title: "Error",
            description:
              "No se pudo obtener la información de la unidad del usuario: " +
              error.message,
            variant: "destructive",
          });
        }
      }
    };
    fetchUserUnitId();
  }, [user?.id, toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      documentType: "CC",
      documentNumber: "",
      expectedDate: "",
      validFrom: "",
      validUntil: "",
      purpose: "",
      photo: undefined, // Keep as undefined for file input
    },
  });

  const generateQrCode = async (visitorData: any) => {
    try {
      const qrData = JSON.stringify(visitorData);
      const url = await QRCode.toDataURL(qrData);
      setQrCodeDataUrl(url);
    } catch (err: Error) {
      console.error("Error generating QR code:", err);
      toast({
        title: "Error",
        description: "No se pudo generar el código QR: " + err.message,
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user?.id || !user?.complexId || userUnitId === null) {
      toast({
        title: "Error",
        description:
          "Información de usuario o unidad incompleta. Por favor, asegúrese de que su perfil tenga una unidad asociada.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    let photoUrl: string | undefined;

    try {
      if (values.photo) {
        const uploadedImage = await uploadVisitorImage(values.photo);
        photoUrl = uploadedImage.url;
      }

      const newVisitor = await createPreRegisteredVisitor({
        ...values,
        residentId: user.id,
        unitId: userUnitId,
        complexId: user.complexId,
        photoUrl: photoUrl, // Add photo URL to the visitor data
      });
      setVisitorId(newVisitor.id);
      generateQrCode({
        visitorId: newVisitor.id,
        validFrom: values.validFrom,
        validUntil: values.validUntil,
        unitId: userUnitId,
        complexId: user.complexId,
      });
      toast({
        title: "Éxito",
        description:
          "Visitante pre-registrado correctamente. Código QR generado.",
      });
      // Optionally, clear the form after successful submission and QR generation
      // form.reset();
    } catch (error: Error) {
      console.error("Error pre-registering visitor:", error);
      toast({
        title: "Error",
        description: "No se pudo pre-registrar al visitante: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQrCode = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement("a");
      link.href = qrCodeDataUrl;
      link.download = `qr_visitante_${visitorId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      form.setValue("photo", file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      form.setValue("photo", undefined);
      setImagePreview(null);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Pre-registrar Visitante
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del visitante" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="documentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Documento</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: CC, CE, Pasaporte" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="documentNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Documento</FormLabel>
                <FormControl>
                  <Input placeholder="Número de identificación" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expectedDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha Esperada de Visita</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="validFrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Válido Desde</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="validUntil"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Válido Hasta</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Propósito de la Visita (Opcional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: Visita familiar, entrega"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="photo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foto del Visitante (Opcional)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </FormControl>
                <FormMessage />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Vista previa de la foto"
                      className="w-32 h-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Pre-registrar Visitante
          </Button>
        </form>
      </Form>

      {qrCodeDataUrl && (
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Código QR para el Visitante
          </h2>
          <img
            src={qrCodeDataUrl}
            alt="Código QR del visitante"
            className="mx-auto border p-2"
          />
          <Button onClick={handleDownloadQrCode} className="mt-4">
            <Download className="mr-2 h-4 w-4" /> Descargar QR
          </Button>
        </div>
      )}
    </div>
  );
}
