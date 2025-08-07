import { Providers } from "@/components/providers";
import { RealTimeNotificationProvider } from "@/context/RealTimeNotificationContext";
import { ModalProvider } from "@/hooks/useModal";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  
  // Load messages manually to avoid getMessages() issues
  let messages;
  try {
    messages = (await import(`@/locales/${locale}.json`)).default;
  } catch (error) {
    // Fallback to Spanish if locale not found
    messages = (await import(`@/locales/es.json`)).default;
  }

  return (
    <html lang={locale}>
      <body className="font-sans">
        <NextIntlClientProvider messages={messages} locale={locale}>
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