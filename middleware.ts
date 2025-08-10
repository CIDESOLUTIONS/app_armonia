import { locales, defaultLocale } from './src/constants/i18n';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/lib/authOptions";

// Configuración de internacionalización
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

// Middleware de autenticación
const authMiddleware = auth((req) => {
  const session = req.auth;
  const { pathname } = req.nextUrl;

  // Extraer locale de la URL
  const locale = pathname.split('/')[1] || 'es';

  // Rutas públicas que no requieren autenticación
  const publicPaths = [
    `/${locale}`,
    `/${locale}/login`,
    `/${locale}/register-complex`,
    `/${locale}/checkout`,
    `/${locale}/forgot-password`,
    `/${locale}/reset-password`,
  ];

  const publicApiPaths = [
    '/api/auth',
    '/api/public'
  ];

  // Si la ruta es una de las públicas o empieza por una API pública, permitir acceso.
  if (publicPaths.includes(pathname) || publicApiPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Si no hay sesión y la ruta no es pública, redirigir a login
  if (!session) {
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  // Rutas protegidas por rol
  const roleRoutes = {
    ADMIN: [`/${locale}/(admin)`],
    COMPLEX_ADMIN: [`/${locale}/(complex-admin)`],
    RESIDENT: [`/${locale}/(resident)`],
    RECEPTION: [`/${locale}/(reception)`]
  };

  // Verificar acceso por rol
  for (const [role, paths] of Object.entries(roleRoutes)) {
    if (paths.some(path => pathname.includes(path.replace(/[()]/g, '')))) {
      if (session.user?.role !== role) {
        return NextResponse.redirect(new URL(`/${locale}/access-denied`, req.url));
      }
    }
  }

  return NextResponse.next();
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Si la ruta es la raíz y no tiene prefijo de idioma, redirigir a /es
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  // Aplicar middleware de internacionalización primero
  const intlResponse = intlMiddleware(request);
  
  // Si hay redirección de internacionalización, aplicarla
  if (intlResponse.status !== 200) {
    return intlResponse;
  }

  // Luego aplicar middleware de autenticación
  return authMiddleware(request);
}

export const config = {
  matcher: [
    // Aplicar a todas las rutas excepto archivos estáticos y API
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
    // Incluir rutas de API de autenticación
    '/api/auth/:path*'
  ]
};