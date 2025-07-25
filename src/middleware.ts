import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import createIntlMiddleware from "next-intl/middleware";

const locales = ["en", "es"];
const publicPages = ["/", "/login", "/register-complex"];

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: "es",
});

export default async function middleware(req: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join("|")}))?(${publicPages.join("|")})/?import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import createIntlMiddleware from "next-intl/middleware";

const locales = ["en", "es"];
const publicPages = ["/", "/login", "/register-complex"];

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: "es",
});

export default async function middleware(req: NextRequest) {
  ,
    "i"
  );
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  // Si la página es pública, solo aplicar el middleware de internacionalización
  if (isPublicPage) {
    return intlMiddleware(req);
  }

  // Para todas las demás páginas, verificar autenticación y roles
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Si no hay token, redirigir a login
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirigir la ruta raíz a /home
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // Lógica de autorización por rol
  const { pathname } = req.nextUrl;
  const userRole = token.role as string;

  if (pathname.startsWith("/admin-portal") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/resident-portal") && userRole !== "RESIDENT") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/reception-portal") && userRole !== "RECEPTION") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Si el usuario está autorizado, aplicar el middleware de internacionalización
  const response = intlMiddleware(req);
  const schemaName = token.schemaName as string;

  if (schemaName) {
    response.headers.set("X-Tenant-Schema", schemaName);
  }
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
