"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

const formSchema = z.object({
  complexName: z
    .string()
    .min(1, { message: "El nombre del conjunto es requerido." }),
  address: z.string().min(1, { message: "La dirección es requerida." }),
  adminName: z.string().min(1, { message: "Tu nombre es requerido." }),
  email: z.string().email({ message: "Por favor, introduce un email válido." }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
});

export default function RegisterComplexForm() {
  const { registerComplex, loading, error } = useAuth();
  const { toast } = useToast();
  const t = useTranslations("RegisterComplex");

  const form = useForm<BrandingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      complexName: "",
      address: "",
      adminName: "",
      email: "",
      password: "",
    } as BrandingFormValues,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { complexName, address, adminName, email, password } = values;
    const payload = {
      complexData: {
        name: complexName,
        address: address,
      },
      adminData: {
        name: adminName,
        email: email,
        password: password,
      },
    };
    await registerComplex(payload);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t("subtitle")}
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-6"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="complexName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("complexNameLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("complexNamePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("addressLabel")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("addressPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="adminName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("adminNameLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("adminNamePlaceholder")}
                        {...field}
                      />
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
                    <FormLabel>{t("emailLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("emailPlaceholder")}
                        {...field}
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("passwordLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("passwordPlaceholder")}
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("submitButton")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
