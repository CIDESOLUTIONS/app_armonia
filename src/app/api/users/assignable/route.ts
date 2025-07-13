import { NextRequest, NextResponse } from "next/server";
import { getTenantPrismaClient } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { ServerLogger } from "@/lib/logging/server-logger";

export async function GET(request: NextRequest) {
  try {
    const { auth, payload } = await verifyAuth(request);
    if (!auth || !payload) {
      return NextResponse.json({ message: "Token requerido" }, { status: 401 });
    }

    if (!payload.complexId || !payload.schemaName) {
      return NextResponse.json(
        { message: "Usuario sin complejo o esquema asociado" },
        { status: 400 },
      );
    }

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);

    // Obtener usuarios con roles de ADMIN, COMPLEX_ADMIN o STAFF dentro del mismo complejo
    const assignableUsers = await tenantPrisma.user.findMany({
      where: {
        complexId: payload.complexId,
        role: { in: ["ADMIN", "COMPLEX_ADMIN", "STAFF"] },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    ServerLogger.info(
      `Usuarios asignables listados para el complejo ${payload.complexId}`,
    );
    return NextResponse.json(assignableUsers, { status: 200 });
  } catch (error) {
    ServerLogger.error("Error al obtener usuarios asignables:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
