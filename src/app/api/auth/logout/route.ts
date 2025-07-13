import { NextRequest, NextResponse } from "next/server";
import { ServerLogger } from "@/lib/logging/server-logger";

export async function POST(_request: NextRequest) {
  try {
    const response = NextResponse.json({
      message: "Sesión cerrada exitosamente",
    });
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 0, // Expira la cookie inmediatamente
    });
    ServerLogger.info("Usuario ha cerrado sesión");
    return response;
  } catch (error) {
    ServerLogger.error("Error al cerrar sesión:", error);
    return NextResponse.json(
      { message: "Error al cerrar sesión" },
      { status: 500 },
    );
  }
}
