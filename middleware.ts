import { i18nRouter } from "next-i18n-router";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/authOptions";
import { i18nConfig } from "./i18nConfig";

// Middleware de autenticación
const authMiddleware = auth((req) => {
  const session = req.auth;
  const { pathname } = req.nextUrl;

  // Extraer locale de la URL
  const locale = pathname.split("/")[1] || i18nConfig.defaultLocale;

  // Rutas públicas que no requieren autenticación
  const publicPaths = [
    `/`,
    `/${locale}`,
    `/${locale}/login`,
    `/${locale}/register-complex`,
    `/${locale}/checkout`,
    `/${locale}/forgot-password`,
    `/${locale}/reset-password`,
  ];

  const publicApiPaths = ["/api/auth", "/api/public"];

  // Si la ruta es una de las públicas o empieza por una API pública, permitir acceso.
  if (
    publicPaths.includes(pathname) ||
    publicApiPaths.some((p) => pathname.startsWith(p))
  ) {
    return null; // No hacer nada, dejar que el siguiente middleware (i18n) se encargue
  }

  // Si no hay sesión y la ruta no es pública, redirigir a login
  if (!session) {
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  // Rutas protegidas por rol (ejemplo, ajustar según la estructura real)
  const roleProtectedPaths = {
    ADMIN: `/${locale}/admin`,
    RESIDENT: `/${locale}/resident`,
  };

  const userRole = session.user?.role;

  if (pathname.startsWith(roleProtectedPaths.ADMIN) && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL(`/${locale}/access-denied`, req.url));
  }

  if (
    pathname.startsWith(roleProtectedPaths.RESIDENT) &&
    userRole !== "RESIDENT"
  ) {
    return NextResponse.redirect(new URL(`/${locale}/access-denied`, req.url));
  }

  return null; // El usuario está autenticado y tiene el rol correcto
});

export function middleware(request: NextRequest) {
  // Ejecutar primero el middleware de autenticación
  const authResponse = (authMiddleware as any)(request);
  if (authResponse) {
    return authResponse; // Si hay redirección de auth, aplicarla
  }

  // Si la autenticación pasa, ejecutar el middleware de i18n
  if (request.nextUrl.pathname.startsWith("/api")) {
    return;
  }
  return i18nRouter(request, i18nConfig);
}

// Aplica el middleware a todas las rutas excepto las estáticas.
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
