import { createInstance, i18n } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { i18nConfig } from "../../../i18nConfig";

export default function initTranslations(
  locale: string,
  namespaces: string[],
  i18nInstance?: i18n,
) {
  const instance = i18nInstance || createInstance();

  instance.use(initReactI18next);

  instance.use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`@/locales/${language}/${namespace}.json`),
    ),
  );

  instance.init({
    lng: locale,
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    defaultNS: namespaces[0],
    fallbackNS: namespaces[0],
    ns: namespaces,
    preload: typeof window === "undefined" ? i18nConfig.locales : [],
  });

  return instance;
}
