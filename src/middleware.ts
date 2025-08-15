import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { i18nRouter } from "next-i18n-router";

// Import locales and defaultLocale from constants
import { locales, defaultLocale } from "@/constants/i18n";

export async function middleware(req: NextRequest) {
  // Apply i18n routing first
  const i18nResponse = i18nRouter(req, { locales, defaultLocale });

  // If i18nRouter returned a redirect, use it
  if (i18nResponse) {
    return i18nResponse;
  }

  // Continue with existing authentication logic
  const { pathname } = req.nextUrl;

  // Define public pages (adjust as needed, based on your app's public routes)
  // Note: next-i18n-router handles locale prefixes, so publicPages should be without them
  const publicPages = [
    "/login",
    "/register-complex",
    "/", // Root path
  ];

  // Check if the current path (without locale prefix) is a public page
  const currentPathWithoutLocale = pathname.replace(
    new RegExp(`^/(${locales.join("|")})`),
    "",
  );
  const isPublicPage = publicPages.includes(currentPathWithoutLocale || "/"); // Handle root path

  // If the page is public, just return the response from the i18n middleware
  if (isPublicPage) {
    return NextResponse.next(); // Allow access to public pages
  }

  // For all other pages, verify authentication
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If no token, redirect to the login page, preserving the locale
  if (!token) {
    const locale =
      locales.find((l) => pathname.startsWith(`/${l}/`)) || defaultLocale;
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
    const response = NextResponse.next();
    response.headers.set("X-Tenant-Schema", schemaName);
    return response;
  }

  return NextResponse.next(); // Allow access if authenticated and authorized
}

export const config = {
  matcher: [
    // Skip all internal Next.js paths (_next, _vercel) and static files (.*\[^.)*)
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
