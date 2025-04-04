import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, JWTVerifyResult } from 'jose';
import { ServerLogger } from './logging/server-logger';

// Interfaz para el payload del token JWT
export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  complexId?: number;
  schemaName?: string;
  iat: number;
  exp: number;
}

// Función para verificar autenticación
export async function verifyAuth(request: NextRequest) {
  try {
    // Obtener el token de la cabecera Authorization
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ServerLogger.warn('Autenticación fallida: No hay token Bearer');
      return { auth: false, payload: null };
    }
    
    const token = authHeader.split(' ')[1];

    // Verificar el token
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret');
    
    try {
      const { payload } = await jwtVerify(token, secretKey) as JWTVerifyResult & { payload: JWTPayload };
      
      ServerLogger.debug('Token verificado correctamente', { userId: payload.userId });
      
      return { auth: true, payload };
    } catch (jwtError) {
      ServerLogger.warn('Token JWT inválido', { error: jwtError });
      return { auth: false, payload: null };
    }
  } catch (error) {
    ServerLogger.error('Error verificando autenticación', { error });
    return { auth: false, payload: null };
  }
}

// Función de middleware para proteger rutas
export async function authMiddleware(
  request: NextRequest,
  allowedRoles: string[] = ['ADMIN', 'COMPLEX_ADMIN', 'RESIDENT', 'STAFF']
) {
  const { auth, payload } = await verifyAuth(request);
  
  if (!auth || !payload) {
    return NextResponse.json(
      { error: 'No autorizado: Token inválido o expirado' },
      { status: 401 }
    );
  }
  
  // Verificar roles
  if (!allowedRoles.includes(payload.role)) {
    ServerLogger.warn('Acceso denegado por rol', { 
      userId: payload.userId, 
      role: payload.role, 
      allowedRoles 
    });
    
    return NextResponse.json(
      { error: 'Prohibido: No tiene permisos para esta acción' },
      { status: 403 }
    );
  }
  
  return { proceed: true, payload };
}

// Función para devolver respuesta con error de autenticación
export function authError(message = 'No autorizado') {
  return NextResponse.json({ error: message }, { status: 401 });
}