"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { useTranslation } from "react-i18next";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const { t } = useTranslation("ResetPassword");

  const formSchema = z
    .object({
      password: z.string().min(8, t("validation.passwordMinLength")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordsMismatch"),
      path: ["confirmPassword"],
    });

  const form = useForm<BrandingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirmPassword: "" } as BrandingFormValues,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!token) {
      toast({
        title: t("toast.errorTitle"),
        description: t("toast.invalidToken"),
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      // Lógica para llamar a la API de reseteo de contraseña
      // console.log({ ...values, token }); // Removed console.log
      toast({
        title: t("toast.passwordUpdatedTitle"),
        description: t("toast.passwordUpdatedDescription"),
      });
    } catch (error: unknown) {
      toast({
        title: t("toast.errorTitle"),
        description:
          error instanceof Error
            ? error.message
            : t("toast.updateErrorDescription"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
            {t("title")}
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("newPasswordLabel")}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("confirmPasswordLabel")}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("updatePasswordButton")}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
