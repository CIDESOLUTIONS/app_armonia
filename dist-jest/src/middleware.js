import { withAuth } from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
const locales = ["en", "es"];
const publicPages = ["/", "/login", "/register-complex"];
const intlMiddleware = createIntlMiddleware({
    locales,
    defaultLocale: "es",
});
const authMiddleware = withAuth(
// Note that this callback is only invoked if
// the `authorized` callback has returned `true`.
function onSuccess(req) {
    return intlMiddleware(req);
}, {
    callbacks: {
        authorized: ({ token }) => token != null,
    },
    pages: {
        signIn: "/login",
    },
});
export default function middleware(req) {
    const publicPathnameRegex = RegExp(`^(/(${locales.join("|")}))?(${publicPages.join("|")})/?$`, "i");
    const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);
    if (isPublicPage) {
        return intlMiddleware(req);
    }
    else {
        return authMiddleware(req);
    }
}
export const config = {
    matcher: ['/((?!api|_next|.*\..*).*)'],
};
