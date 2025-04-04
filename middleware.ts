// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  
  // Limpiar la ruta de los grupos (public) y (auth)
  const path = request.nextUrl.pathname;
  console.log('[Middleware] Verificando ruta:', path);

  // Todas las rutas bajo /auth requieren autenticación
  const isAuthRoute = path.startsWith('/auth');
  const isLoginRoute = path === '/login';

  if (isAuthRoute && !token) {
    console.log('[Middleware] Redirigiendo a login - no autenticado');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isLoginRoute) {
    console.log('[Middleware] Redirigiendo a dashboard - ya autenticado');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Proteger todas las rutas /auth
    '/auth/:path*',
    // Rutas públicas que necesitan lógica de redirección
    '/login',
    '/forgot-password',
  ],
};