import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { RealTimeNotificationProvider } from "@/context/RealTimeNotificationContext";
import { ModalProvider } from "@/hooks/useModal.tsx"; // Importar ModalProvider
import "./globals.css";

export const metadata: Metadata = {
  title: "Armonía - Gestión de Conjuntos Residenciales",
  description: "Sistema de gestión para conjuntos residenciales",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-sans">
        <Providers>
          <RealTimeNotificationProvider>
            <ModalProvider>{children}</ModalProvider>
          </RealTimeNotificationProvider>
        </Providers>
      </body>
    </html>
  );
}
