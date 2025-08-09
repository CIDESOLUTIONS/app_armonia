import {notFound} from 'next/navigation';
import {getRequestConfig, getRequestLocale} from 'next-intl/server';
import { locales } from '@/constants/i18n';
 
export default getRequestConfig(async () => {
  const locale = await getRequestLocale();
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();
 
  return {
    messages: (await import(`./locales/${locale}.json`)).default
  };
});

