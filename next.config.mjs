/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Configuración para imágenes
  images: {
    domains: ['localhost'],
    unoptimized: true
  }
};

export default nextConfig;

