"use client";

import { Providers } from "@/components/providers";
import { RealTimeNotificationProvider } from "@/context/RealTimeNotificationContext";
import { ModalProvider } from "@/hooks/useModal";
import "../globals.css";

export default async function LocaleLayout({
  children,
  params, // Await params before destructuring
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params; // Destructure locale after awaiting params

  return (
    <html lang={locale}>
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