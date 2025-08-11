import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n'; // Import the new i18n config from root
import { Providers } from "@/components/providers";
import { RealTimeNotificationProvider } from "@/context/RealTimeNotificationContext";
import { ModalProvider } from "@/hooks/useModal";

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export const metadata = {
  title: "Armonía | Gestión Integral de Conjuntos Residenciales",
  description: "Plataforma líder para la administración de conjuntos residenciales.",
};

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  // i18next is initialized globally, so no need to pass messages here
  // We just need to ensure the i18n instance is available to components

  return (
    <html lang={locale}>
      <body>
        <I18nextProvider i18n={i18n}>
          <Providers>
            <RealTimeNotificationProvider>
              <ModalProvider>
                {children}
              </ModalProvider>
            </RealTimeNotificationProvider>
          </Providers>
        </I18nextProvider>
      </body>
    </html>
  );
}