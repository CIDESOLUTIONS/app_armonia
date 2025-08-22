import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

/**
 * Proxy para las APIs de pasarelas de pago
 * Redirige todas las peticiones al backend NestJS
 */
export async function GET(request: NextRequest) {
  return handleProxyRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return handleProxyRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return handleProxyRequest(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
  return handleProxyRequest(request, 'DELETE');
}

export async function PATCH(request: NextRequest) {
  return handleProxyRequest(request, 'PATCH');
}

async function handleProxyRequest(request: NextRequest, method: string) {
  try {
    const { pathname, search } = new URL(request.url);
    
    // Extraer la ruta después de /api/payment-gateways
    const backendPath = pathname.replace('/api/payment-gateways', '/api/payment-gateways');
    const backendUrl = `${BACKEND_URL}${backendPath}${search}`;

    // Preparar headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Copiar headers de autorización
    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Copiar otros headers importantes
    const userAgent = request.headers.get('User-Agent');
    if (userAgent) {
      headers['User-Agent'] = userAgent;
    }

    // Preparar el cuerpo de la petición
    let body: string | undefined;
    if (method !== 'GET' && method !== 'DELETE') {
      try {
        const requestBody = await request.text();
        if (requestBody) {
          body = requestBody;
        }
      } catch (error) {
        console.error('Error reading request body:', error);
      }
    }

    // Realizar la petición al backend
    const response = await fetch(backendUrl, {
      method,
      headers,
      body,
    });

    // Obtener la respuesta
    const responseText = await response.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    // Preparar headers de respuesta
    const responseHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Copiar headers CORS si están presentes
    const corsHeaders = [
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Credentials',
    ];

    corsHeaders.forEach(header => {
      const value = response.headers.get(header);
      if (value) {
        responseHeaders[header] = value;
      }
    });

    return NextResponse.json(responseData, {
      status: response.status,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('Proxy error:', error);
    
    return NextResponse.json(
      {
        error: 'Error de conexión con el servidor',
        message: 'No se pudo conectar con el backend',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}