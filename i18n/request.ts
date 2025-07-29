import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => ({
  locale: locale ?? "es",
  messages: (await import(`../src/messages/${locale ?? "es"}.json`)).default,
}));
