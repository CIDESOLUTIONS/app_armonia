import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/lib/authOptions";

// Configuración de internacionalización
const intlMiddleware = createMiddleware({
  locales: ['es', 'en'],
  defaultLocale: 'es',
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
    `/${locale}/login`,
    `/${locale}/register-complex`,
    `/${locale}/public`,
    `/${locale}/checkout`,
    `/${locale}/forgot-password`,
    `/${locale}/reset-password`,
    '/api/auth', // Rutas de NextAuth
    '/api/public', // APIs públicas
  ];

  // Si la ruta es pública, permitir acceso
  if (publicPaths.some((path) => pathname.startsWith(path))) {
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // Incluir rutas de API de autenticación
    '/api/auth/:path*'
  ]
};

