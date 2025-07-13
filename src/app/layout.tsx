import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { useMessages } from "next-intl";

export const metadata: Metadata = {
  title: "Armonía - Gestión de Conjuntos Residenciales",
  description: "Sistema de gestión para conjuntos residenciales",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = useMessages();

  return (
    <html lang="es">
      <body className="font-sans">
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
