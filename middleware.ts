// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Función para obtener el token de diferentes fuentes (autorización o cookies)
function getToken(request: NextRequest): string | null {
  // Verificar primero en las cabeceras de autorización
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  
  // Si no está en las cabeceras, verificar en cookies
  const tokenCookie = request.cookies.get('token');
  if (tokenCookie) {
    return tokenCookie.value;
  }
  
  return null;
}

export async function middleware(request: NextRequest) {
  // Obtener la ruta actual
  const path = request.nextUrl.pathname;
  console.log('[Middleware] Verificando ruta:', path);

  // Determinar si es una ruta protegida
  const isProtectedRoute = 
    path.startsWith('/dashboard') || 
    path.startsWith('/resident');
    
  // Ruta de redirección por defecto
  const loginUrl = new URL('/login', request.url);
  
  // Si es una ruta protegida, verificar autenticación
  if (isProtectedRoute) {
    // Obtener el token
    const token = getToken(request);
    
    if (!token) {
      console.log('[Middleware] Redirigiendo a login - no autenticado');
      return NextResponse.redirect(loginUrl);
    }
    
    try {
      // Verificar el token
      const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret');
      await jwtVerify(token, secretKey);
      
      // Token válido, continuar
      return NextResponse.next();
    } catch (error) {
      console.log('[Middleware] Token inválido - redirigiendo a login');
      return NextResponse.redirect(loginUrl);
    }
  }

  // Para rutas no protegidas, continuar
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Proteger todas las rutas de dashboard y resident
    '/dashboard/:path*',
    '/resident/:path*',
  ],
};