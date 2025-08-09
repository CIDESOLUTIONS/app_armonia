import {notFound} from 'next/navigation';
<<<<<<< HEAD
import {getRequestConfig} from 'next-intl/server';
import { locales, defaultLocale } from '@/constants/i18n';
 
export default getRequestConfig(async ({locale}) => {
=======
import {getRequestConfig, getRequestLocale} from 'next-intl/server';
import { locales } from '@/constants/i18n';
 
export default getRequestConfig(async () => {
  const locale = await getRequestLocale();
>>>>>>> bd1f6e45c82be9578f8acae398abe388b429bb0c
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();
 
  return {
    messages: (await import(`./locales/${locale}.json`)).default
  };
});