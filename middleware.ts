import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  const tokenCookie = request.cookies.get("token");
  if (tokenCookie) {
    return tokenCookie.value;
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isApiRoute = path.startsWith('/api/');

  // Solo aplicar lógica de tenant a rutas de API protegidas
  if (isApiRoute) {
    const token = getToken(request);

    if (!token) {
      // Para las rutas de API, no redirigimos, devolvemos un error 401
      return new NextResponse(JSON.stringify({ message: "Authentication token not found." }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret || jwtSecret === "default_secret") {
        console.error("CRITICAL SECURITY WARNING: JWT_SECRET is not set or is using the default value.");
        return new NextResponse(JSON.stringify({ message: "Server configuration error." }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }

      const secretKey = new TextEncoder().encode(jwtSecret);
      const { payload } = await jwtVerify(token, secretKey);

      const schemaName = payload.schemaName as string | undefined;

      if (!schemaName) {
        // Si la ruta requiere un tenant pero el token no lo tiene, es un error.
        if (!path.startsWith('/api/auth')) { // Las rutas de auth pueden no tener schema
             return new NextResponse(JSON.stringify({ message: "Tenant schema not found in token." }), { status: 403, headers: { 'Content-Type': 'application/json' } });
        }
      }

      // Inyectar el schemaName en las cabeceras para que los endpoints lo usen
      const requestHeaders = new Headers(request.headers);
      if (schemaName) {
        requestHeaders.set('X-Tenant-Schema', schemaName);
      }

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

    } catch (error) {
      return new NextResponse(JSON.stringify({ message: "Invalid or expired token." }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
  }

  // Para las rutas de páginas (no API), mantener la lógica de redirección
  const isProtectedRoute = path.startsWith("/admin") || path.startsWith("/resident") || path.startsWith("/reception");
  if (isProtectedRoute) {
      const token = getToken(request);
      if (!token) {
          const loginUrl = new URL("/public/login", request.url);
          return NextResponse.redirect(loginUrl);
      }
      // Aquí se podría añadir la verificación del token si se quiere ser más estricto antes de renderizar la página
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Proteger rutas de API y de páginas
    "/api/:path*",
    "/admin/:path*",
    "/resident/:path*",
    "/reception/:path*",
  ],
};