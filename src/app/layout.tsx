import type { Metadata } from "next";
import "./globals.css";
import I18nProvider from "@/components/providers/I18nProvider";
import initTranslations from "./i18n";

export const metadata: Metadata = {
  title: "Armonía - Gestión de Conjuntos Residenciales",
  description: "Sistema de gestión para conjuntos residenciales",
};

const i18nNamespaces = ["common", "header", "landing"];

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <html lang={locale}>
      <body className="font-sans">
        <I18nProvider
          namespaces={i18nNamespaces}
          locale={locale}
        >
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
