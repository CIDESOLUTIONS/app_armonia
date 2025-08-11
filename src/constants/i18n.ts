export const locales = ['es', 'en'] as const;
export const defaultLocale = 'es';

export const pathnames = {
  '/': '/',
  '/login': '/login',
  '/register-complex': '/register-complex'
} as const;

export const localePrefix = 'always'; // Options: 'always' | 'as-needed' | 'never'