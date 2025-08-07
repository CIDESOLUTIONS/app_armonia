import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@prisma/client"],
  // Configuración para imágenes
  images: {
    domains: ['localhost'],
    unoptimized: true
  }
};

export default withNextIntl(nextConfig);

