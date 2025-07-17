import { withAuth } from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const locales = ["es", "en", "pt"];
const publicPages = ["/public", "/public/login", "/public/register-complex"];

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: "es",
  localePrefix: "always", // or 'never' or 'as-needed'
});

const authMiddleware = withAuth(
  async function middleware(request) {
    const intlResponse = intlMiddleware(request);
    const path = request.nextUrl.pathname;
    const isApiRoute = path.startsWith("/api/");

    // Lógica para inyectar X-Tenant-Schema en rutas de API
    if (isApiRoute) {
      const token = request.nextauth.token;
      const schemaName = token?.schemaName as string | undefined;

      const requestHeaders = new Headers(request.headers);
      if (schemaName) {
        requestHeaders.set("X-Tenant-Schema", schemaName);
      }

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    return intlResponse;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // Permitir acceso a páginas públicas sin autenticación
        if (publicPages.some((p) => path.startsWith(p))) {
          return true;
        }
        // Requerir autenticación para todas las demás rutas
        return !!token;
      },
    },
    pages: {
      signIn: "/public/login",
    },
  },
);

export default async function middleware(request: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join("|")}))?(${publicPages.join("|")})/?$`,
    "i",
  );
  const isPublicPage = publicPathnameRegex.test(request.nextUrl.pathname);

  if (isPublicPage) {
    return intlMiddleware(request);
  } else {
    return (authMiddleware as any)(request);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)],
};