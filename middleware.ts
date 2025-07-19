import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // Rutas públicas que no requieren autenticación
    const publicPaths = [
      "/public",
      "/public/login",
      "/public/register-complex",
      "/public/checkout",
      "/public/login/forgot-password",
      "/public/login/reset-password",
      "/api/auth", // Rutas de NextAuth
    ];

    // Si la ruta es pública, permitir acceso
    if (publicPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.next();
    }

    // Si no hay token (no autenticado) y la ruta no es pública, redirigir a login
    if (!token) {
      return NextResponse.redirect(new URL("/public/login", req.url));
    }

    // Rutas protegidas por rol
    const adminPaths = ["/(admin)"];
    const complexAdminPaths = ["/(complex-admin)"];
    const residentPaths = ["/(resident)"];
    const receptionPaths = ["/(reception)"];

    if (adminPaths.some((path) => pathname.startsWith(path))) {
      if (token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/access-denied", req.url));
      }
    }

    if (complexAdminPaths.some((path) => pathname.startsWith(path))) {
      if (token.role !== "COMPLEX_ADMIN") {
        return NextResponse.redirect(new URL("/access-denied", req.url));
      }
    }

    if (residentPaths.some((path) => pathname.startsWith(path))) {
      if (token.role !== "RESIDENT") {
        return NextResponse.redirect(new URL("/access-denied", req.url));
      }
    }

    if (receptionPaths.some((path) => pathname.startsWith(path))) {
      if (token.role !== "RECEPTION") {
        return NextResponse.redirect(new URL("/access-denied", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/public/login",
    },
  },
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*) "], // Excluir rutas de API, estáticas y favicon
};
