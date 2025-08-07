import createMiddleware from 'next-intl/middleware';
import { auth } from "@/lib/authOptions";
import { NextResponse } from "next/server";

// Configuración de internacionalización
const intlMiddleware = createMiddleware({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'always'
});

export default auth((req) => {
  const session = req.auth;
  const { pathname } = req.nextUrl;

  // Aplicar middleware de internacionalización primero
  const intlResponse = intlMiddleware(req);
  
  // Si el middleware de internacionalización redirige, usar esa respuesta
  if (intlResponse.status !== 200) {
    return intlResponse;
  }

  // Rutas públicas que no requieren autenticación (con prefijo de locale)
  const publicPaths = [
    "/es/public",
    "/en/public", 
    "/es/login",
    "/en/login",
    "/es/register-complex",
    "/en/register-complex",
    "/es/checkout",
    "/en/checkout",
    "/es/forgot-password",
    "/en/forgot-password",
    "/es/reset-password", 
    "/en/reset-password",
    "/api/auth", // Rutas de NextAuth
  ];

  // Si la ruta es pública, permitir acceso
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Si no hay sesión (no autenticado) y la ruta no es pública, redirigir a login
  if (!session) {
    const locale = pathname.split('/')[1] || 'es';
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  // Rutas protegidas por rol (con prefijo de locale)
  const adminPaths = ["/es/(admin)", "/en/(admin)"];
  const complexAdminPaths = ["/es/(complex-admin)", "/en/(complex-admin)"];
  const residentPaths = ["/es/(resident)", "/en/(resident)"];
  const receptionPaths = ["/es/(reception)", "/en/(reception)"];

  if (adminPaths.some((path) => pathname.includes(path))) {
    if (session.user?.role !== "ADMIN") {
      const locale = pathname.split('/')[1] || 'es';
      return NextResponse.redirect(new URL(`/${locale}/access-denied`, req.url));
    }
  }

  if (complexAdminPaths.some((path) => pathname.includes(path))) {
    if (session.user?.role !== "COMPLEX_ADMIN") {
      const locale = pathname.split('/')[1] || 'es';
      return NextResponse.redirect(new URL(`/${locale}/access-denied`, req.url));
    }
  }

  if (residentPaths.some((path) => pathname.includes(path))) {
    if (session.user?.role !== "RESIDENT") {
      const locale = pathname.split('/')[1] || 'es';
      return NextResponse.redirect(new URL(`/${locale}/access-denied`, req.url));
    }
  }

  if (receptionPaths.some((path) => pathname.includes(path))) {
    if (session.user?.role !== "RECEPTION") {
      const locale = pathname.split('/')[1] || 'es';
      return NextResponse.redirect(new URL(`/${locale}/access-denied`, req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Aplicar a todas las rutas excepto API, archivos estáticos y favicon
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // Incluir rutas de API de autenticación si es necesario
    '/api/auth/:path*'
  ]
};

