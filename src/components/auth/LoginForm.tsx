"use client";

import React, { useEffect } from "react";
import Link from "next/link";
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
import { Loader2, Building, User, Shield, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, introduce un email válido." }),
  password: z.string().min(1, { message: "La contraseña es requerida." }),
  rememberMe: z.boolean().optional(),
});

interface LoginFormProps {
  portalType?: "admin" | "resident" | "reception" | null;
}

export default function LoginForm({ portalType = null }: LoginFormProps) {
  const { login, loading, error } = useAuth();
  const { toast } = useToast();
  const t = useTranslations("Login");
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        title: t("toast.authErrorTitle"),
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast, t]);

  const getPortalInfo = () => {
    switch (portalType) {
      case "admin":
        return {
          title: "Portal Administración",
          description: "Acceda al panel de gestión del conjunto residencial",
          icon: <Building className="h-6 w-6" />,
          color: "bg-indigo-600",
          textColor: "text-indigo-600",
          redirectTo: ROUTES.COMPLEX_ADMIN_DASHBOARD,
        };
      case "resident":
        return {
          title: "Portal Residentes",
          description: "Acceda a su información como residente del conjunto",
          icon: <User className="h-6 w-6" />,
          color: "bg-green-600",
          textColor: "text-green-600",
          redirectTo: ROUTES.RESIDENT_FINANCES_FEES,
        };
      case "reception":
        return {
          title: "Portal Recepción",
          description:
            "Acceda al sistema de control de acceso y correspondencia",
          icon: <Shield className="h-6 w-6" />,
          color: "bg-amber-600",
          textColor: "text-amber-600",
          redirectTo: ROUTES.RECEPTION_DASHBOARD,
        };
      default:
        return {
          title: "Iniciar Sesión",
          description: "Acceda a su cuenta en la plataforma Armonía",
          icon: <Building className="h-6 w-6" />,
          color: "bg-indigo-600",
          textColor: "text-indigo-600",
          redirectTo: ROUTES.APP_ADMIN_DASHBOARD,
        };
    }
  };

  const portalInfo = getPortalInfo();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // TODO: Implement logic to dynamically get complexId and schemaName
    // from the URL or a portal selection component.
    const complexId = 1; // Placeholder
    const schemaName = "tenant_cj0001"; // Placeholder

    await login(
      values.email,
      values.password,
      complexId,
      schemaName,
      portalInfo.redirectTo,
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="mb-4 flex">
        <Button
          variant="ghost"
          onClick={() => router.push(ROUTES.PORTAL_SELECTOR)}
          className={`${portalInfo.textColor}`}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver al selector
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className={`${portalInfo.color} p-6 text-white`}>
          <div className="flex items-center mb-4">
            {portalInfo.icon}
            <h2 className="text-2xl font-bold ml-2">{portalInfo.title}</h2>
          </div>
          <p>{portalInfo.description}</p>
        </div>

        <div className="p-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-8 space-y-6"
            >
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
                        autoComplete="email"
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
                        type="password"
                        placeholder={t("passwordPlaceholder")}
                        {...field}
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t("rememberMeLabel")}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <div className="text-sm">
                  <Link
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    {t("forgotPasswordLink")}
                  </Link>
                </div>
              </div>

              <div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("loginButton")}
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {t("orSeparator")}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/register-complex"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {t("registerLink")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
