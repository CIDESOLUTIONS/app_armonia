// src/app/api/test-auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { ServerLogger } from "@/lib/logging/server-logger";

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticación
    const { auth, payload } = await verifyAuth(req);
    
    if (!auth || !payload) {
      ServerLogger.warn('Test de autenticación fallido: No autenticado');
      return NextResponse.json({ 
        success: false, 
        message: "No autenticado",
        debug: {
          headerAuth: req.headers.get('authorization') ? "Presente" : "Ausente",
          cookieAuth: req.cookies.get('token') ? "Presente" : "Ausente",
        } 
      }, { status: 401 });
    }
    
    // Autenticación exitosa
    ServerLogger.info(`Test de autenticación exitoso para usuario: ${payload.email}`);
    return NextResponse.json({
      success: true,
      message: "Autenticación exitosa",
      user: {
        id: payload.id,
        email: payload.email,
        role: payload.role,
        name: payload.name,
        complexId: payload.complexId,
        complexName: payload.complexName,
        schema: payload.schemaName,
        isGlobalAdmin: payload.isGlobalAdmin
      }
    });
  } catch (error) {
    ServerLogger.error('Error en test de autenticación:', error);
    return NextResponse.json({
      success: false,
      message: "Error al verificar autenticación",
      error: error instanceof Error ? error.message : "Error desconocido"
    }, { status: 500 });
  }
}