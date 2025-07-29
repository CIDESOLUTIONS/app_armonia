import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import createIntlMiddleware from "next-intl/middleware";

const locales = ["en", "es"];
const publicPages = ["/login", "/register-complex"]; // Root '/' is handled separately

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: "es",
});

export default async function middleware(req: NextRequest) {
  // First, apply the i18n middleware to get the correct locale handling
  const response = intlMiddleware(req);
  const { pathname } = req.nextUrl;

  // Create a regex to check for public paths, including the root
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join("|")}))?(${publicPages.join("|")}|/?)$`,
    "i",
  );

  const isPublicPage = publicPathnameRegex.test(pathname);

  // If the page is public, just return the response from the i18n middleware
  if (isPublicPage) {
    return response;
  }

  // For all other pages, verify authentication
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If no token, redirect to the login page, preserving the locale
  if (!token) {
    const locale = locales.find((l) => pathname.startsWith(`/${l}/`)) || "es";
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  // Role-based authorization logic
  const userRole = token.role as string;

  if (pathname.includes("/admin-portal") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.includes("/resident-portal") && userRole !== "RESIDENT") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.includes("/reception-portal") && userRole !== "RECEPTION") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // If authorized, add the tenant schema header and return
  const schemaName = token.schemaName as string;
  if (schemaName) {
    response.headers.set("X-Tenant-Schema", schemaName);
  }
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
