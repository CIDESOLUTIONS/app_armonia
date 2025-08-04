"use client";

import { Providers } from "@/components/providers";
import { RealTimeNotificationProvider } from "@/context/RealTimeNotificationContext";
import { ModalProvider } from "@/hooks/useModal";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl"; // Import NextIntlClientProvider
import { getMessages } from "@/i18n"; // Assuming this function exists to load messages

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  const messages = await getMessages(locale); // Load messages for the current locale

  return (
    <html lang={locale}>
      <body className="font-sans">
        <NextIntlClientProvider messages={messages} locale={locale}> {/* Wrap with NextIntlClientProvider */}
          <Providers>
            <RealTimeNotificationProvider>
              <ModalProvider>{children}</ModalProvider>
            </RealTimeNotificationProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}