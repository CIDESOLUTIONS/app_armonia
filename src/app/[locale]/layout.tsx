import React from "react";
import { Providers } from "@/components/providers";
import { RealTimeNotificationProvider } from "@/context/RealTimeNotificationContext";
import { ModalProvider } from "@/hooks/useModal";

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export const metadata = {
  title: "Armonía | Gestión Integral de Conjuntos Residenciales",
  description:
    "Plataforma líder para la administración de conjuntos residenciales.",
};

export default function LocaleLayout({ children }: Props) {
  return (
    <Providers>
      <RealTimeNotificationProvider>
        <ModalProvider>{children}</ModalProvider>
      </RealTimeNotificationProvider>
    </Providers>
  );
}
