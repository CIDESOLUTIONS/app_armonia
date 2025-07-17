import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

export const metadata: Metadata = {
  title: "Armonía - Gestión de Conjuntos Residenciales",
  description: "Sistema de gestión para conjuntos residenciales",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="font-sans">
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
