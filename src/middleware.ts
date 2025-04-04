import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ServerLogger } from '@/lib/logging/server-logger';

export function middleware(request: NextRequest) {
  // Registrar solicitud HTTP
  ServerLogger.httpRequest({
    method: request.method,
    url: request.nextUrl.pathname,
    ip: request.ip || 'unknown'
  });

  // Verificar autenticación
  const token = request.cookies.get('auth_token')?.value;

  // Rutas protegidas
  const protectedRoutes = [
    '/dashboard',
    '/admin',
    '/profile'
  ];

  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    // Registrar intento de acceso no autorizado
    ServerLogger.security('Unauthorized access attempt', {
      route: request.nextUrl.pathname,
      ip: request.ip || 'unknown'
    });

    // Redirigir a página de login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Seguridad adicional: prevenir ataques
  const securityHeaders = {
    'X-XSS-Protection': '1; mode=block',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };

  const response = NextResponse.next();

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/admin/:path*', 
    '/profile/:path*'
  ]
};
