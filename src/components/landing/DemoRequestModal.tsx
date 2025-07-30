"use client";

import React from "react";
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
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";

const formSchema = z.object({
  name: z.string().min(1, { message: "Tu nombre es requerido." }),
  email: z.string().email({ message: "Por favor, introduce un email válido." }),
  complexName: z
    .string()
    .min(1, { message: "El nombre del conjunto es requerido." }),
  units: z.number().min(1, { message: "El número de unidades es requerido." }),
});

interface DemoRequestModalProps {
  children: React.ReactNode;
}

export function DemoRequestModal({ children }: DemoRequestModalProps) {
  const { toast } = useToast();
  const t = useTranslations("DemoRequest");
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const form = useForm<BrandingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      complexName: "",
      units: 1,
    } as BrandingFormValues,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await axios.post("/api/request-demo", values);
      toast({
        title: t("toast.successTitle"),
        description: t("toast.successDescription"),
      });
      setOpen(false);
      form.reset();
    } catch (error: unknown) {
      toast({
        title: t("toast.errorTitle"),
        description: (error instanceof Error ? error.message : t("toast.errorDescription")),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("nameLabel")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("namePlaceholder")} {...field} />
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
              name="units"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("unitsLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("unitsPlaceholder")}
                      {...field}
                      type="number"
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("submitButton")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
