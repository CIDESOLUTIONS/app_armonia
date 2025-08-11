import { NextIntlClientProvider, useMessages } from 'next-intl';
import { Providers } from "@/components/providers";
import { RealTimeNotificationProvider } from "@/context/RealTimeNotificationContext";
import { ModalProvider } from "@/hooks/useModal";
import { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Armonía | Gestión Integral de Conjuntos Residenciales",
  description:
    "Plataforma líder para la administración de conjuntos residenciales. Gestiona finanzas, asambleas, comunicación y seguridad en un solo lugar.",
  keywords: [
    "administración de conjuntos",
    "software para conjuntos",
    "gestión de propiedades",
    "asambleas virtuales",
    "app para residentes",
  ],
};

// Create a separate Client Component to handle NextIntlClientProvider and useMessages
// This component will receive the locale and messages as props
function IntlProviderWrapper({ children, locale, messages }: { children: ReactNode, locale: string, messages: any }) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers>
        <RealTimeNotificationProvider>
          <ModalProvider>
            <div className="public-layout">
              <Header
                theme="Claro"
                setTheme={() => {}} // Placeholder for setTheme
                language="Español"
                setLanguage={() => {}} // Placeholder for setLanguage
                currency="Pesos"
                setCurrency={() => {}} // Placeholder for setCurrency
                isLoggedIn={false}
              />
              <div className="pt-16">{children}</div>
            </div>
          </ModalProvider>
        </RealTimeNotificationProvider>
      </Providers>
    </NextIntlClientProvider>
  );
}

export default function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // LocaleLayout is NOT async
  const locale = params.locale; // Access locale directly
  const messages = useMessages(); // This is now called in a non-async component

  return (
    <IntlProviderWrapper locale={locale} messages={messages}>
      {children}
    </IntlProviderWrapper>
  );
}