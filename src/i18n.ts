import { getRequestConfig } from "next-intl/server";

// Lista de locales soportados
export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

// Locale por defecto
export const defaultLocale: Locale = 'es';

export default getRequestConfig(async ({ locale }) => {
  // Validar que el locale sea soportado
  if (!locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    messages: (await import(`./locales/${locale}.json`)).default,
    timeZone: "America/Bogota"
  };
});

