"use client";

import { Providers } from "@/components/providers";
import { RealTimeNotificationProvider } from "@/context/RealTimeNotificationContext";
import { ModalProvider } from "@/hooks/useModal";
import "../globals.css";

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
