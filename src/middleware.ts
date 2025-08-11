import createMiddleware from 'next-intl/middleware';
import {NextRequest, NextResponse} from 'next/server';
import {locales, pathnames, defaultLocale, localePrefix} from '@/constants/i18n';
import {getToken} from 'next-auth/jwt';

const intlMiddleware = createMiddleware({
  defaultLocale,
  locales,
  pathnames,
  localePrefix
});

export default async function middleware(req: NextRequest) {
  const response = intlMiddleware(req);

  const { pathname } = req.nextUrl;

  const publicPages = Object.values(pathnames);
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join("|")}))?(${publicPages.join("|")}|/?)$`,
    "i",
  );

  const isPublicPage = publicPathnameRegex.test(pathname);

  if (isPublicPage) {
    return response;
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const locale = locales.find((l) => pathname.startsWith(`/${l}/`)) || defaultLocale;
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

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

  const schemaName = token.schemaName as string;
  if (schemaName) {
    response.headers.set("X-Tenant-Schema", schemaName);
  }

  return response;
}

export const config = {
  matcher: [
    '/',
    '/(es|en)/:path*',
    '/((?!_next|_vercel|.*\..*).*)'
  ]
};