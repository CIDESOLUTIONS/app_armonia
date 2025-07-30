"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const contactSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  email: z.string().email("El email no es válido."),
  message: z.string().min(1, "El mensaje es requerido."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export const ContactForm = () => {
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const response = await fetch("/api/auth/request-demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al enviar el mensaje.");
      }

      toast({
        title: "Formulario enviado",
        description: "Gracias por contactarnos. Te responderemos pronto.",
      });
      form.reset();
    } catch (error) {
      console.error("Error sending contact form:", error);
      const description =
        error instanceof Error
          ? error.message
          : "No se pudo enviar el mensaje. Por favor, inténtalo de nuevo.";
      toast({
        title: "Error en el Envío",
        description,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Tu nombre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="tu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensaje</FormLabel>
              <FormControl>
                <Textarea placeholder="Escribe tu mensaje aquí." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Enviar Mensaje</Button>
      </form>
    </Form>
  );
};
