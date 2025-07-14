import { NextRequest, NextResponse } from "next/server";
import { getTenantPrismaClient } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { ServerLogger } from "@/lib/logging/server-logger";
import { z } from "zod";

const AssignPQRSchema = z.object({
  pqrId: z.number().int().positive("ID de PQR inválido."),
  assignedToId: z.number().int().positive("ID de asignado inválido."),
});

export async function PUT(request: NextRequest) {
  try {
    const { auth, payload } = await verifyAuth(request);
    if (!auth || !payload) {
      return NextResponse.json({ message: "Token requerido" }, { status: 401 });
    }

    if (!["ADMIN", "COMPLEX_ADMIN", "STAFF"].includes(payload.role)) {
      return NextResponse.json(
        { message: "Permisos insuficientes" },
        { status: 403 },
      );
    }

    if (!payload.complexId || !payload.schemaName) {
      return NextResponse.json(
        { message: "Usuario sin complejo o esquema asociado" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const validatedData = AssignPQRSchema.parse(body);

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);

    // Verificar que la PQR exista y pertenezca al complejo del usuario
    const existingPQR = await tenantPrisma.pQR.findUnique({
      where: { id: validatedData.pqrId, complexId: payload.complexId },
    });

    if (!existingPQR) {
      return NextResponse.json(
        { message: "PQR no encontrada" },
        { status: 404 },
      );
    }

    const updatedPQR = await tenantPrisma.pQR.update({
      where: { id: validatedData.pqrId },
      data: { assignedToId: validatedData.assignedToId },
    });

    ServerLogger.info(
      `PQR ${validatedData.pqrId} asignada a ${validatedData.assignedToId} por ${payload.email} en complejo ${payload.complexId}`,
    );
    return NextResponse.json(updatedPQR, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error("Error al asignar PQR:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
