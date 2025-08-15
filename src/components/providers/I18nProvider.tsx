"use client";

import { I18nextProvider } from "react-i18next";
import initTranslations from "@/app/i18n";
import { createInstance } from "i18next";
import { ReactNode } from "react";

interface I18nProviderProps {
  children: ReactNode;
  locale: string;
  namespaces: string[];
}

export default function I18nProvider({
  children,
  locale,
  namespaces,
}: I18nProviderProps) {
  const i18n = createInstance();
  initTranslations(locale, namespaces, i18n);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
