// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuraciones básicas
  reactStrictMode: true,
  swcMinify: true,
  
  // Asegurar que Next.js maneje correctamente las rutas con grupos
  experimental: {
    // Opciones experimentales actualizadas para Next.js 14
    serverComponentsExternalPackages: ["@prisma/client"],
  }
}

module.exports = nextConfig;