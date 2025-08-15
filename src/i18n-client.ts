import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

i18n
  .use(Backend)

  .use(initReactI18next)
  .init({
    fallbackLng: "es",
    debug: true, // Set to false in production
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // Path to your translation files
    },
    ns: ["common", "landing"], // Namespaces for your translations
    defaultNS: "common",
    react: {
      useSuspense: false, // Set to true if you want to use React.Suspense
    },
  });

export default i18n;
