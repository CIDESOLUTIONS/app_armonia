import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReactNode } from 'react';
import { Providers } from "@/components/providers";
import { RealTimeNotificationProvider } from "@/context/RealTimeNotificationContext";
import { ModalProvider } from "@/hooks/useModal";

type Props = {
  children: ReactNode;
  params: { locale: string };
};

// Metadata can be defined here
export const metadata = {
  title: "Armonía | Gestión Integral de Conjuntos Residenciales",
  description: "Plataforma líder para la administración de conjuntos residenciales.",
};

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <RealTimeNotificationProvider>
              <ModalProvider>
                {children}
              </ModalProvider>
            </RealTimeNotificationProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
