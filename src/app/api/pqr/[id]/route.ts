import { NextRequest, NextResponse } from "next/server";
import { getTenantPrismaClient } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { ServerLogger } from "@/lib/logging/server-logger";
import { z } from "zod";
import { UpdatePQRSchema } from "@/validators/pqr/pqr.validator";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { auth, payload } = await verifyAuth(request);
    if (!auth || !payload) {
      return NextResponse.json({ message: "Token requerido" }, { status: 401 });
    }

    if (!["ADMIN", "COMPLEX_ADMIN", "STAFF", "RESIDENT"].includes(payload.role)) {
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

    const pqrId = parseInt(params.id);
    if (isNaN(pqrId)) {
      return NextResponse.json({ message: "ID de PQR inválido" }, { status: 400 });
    }

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    const pqr = await tenantPrisma.pQR.findUnique({
      where: { id: pqrId, complexId: payload.complexId },
      include: {
        reportedBy: { select: { name: true } },
        assignedTo: { select: { name: true } },
        comments: { include: { author: { select: { name: true } } } },
      },
    });

    if (!pqr) {
      return NextResponse.json({ message: "PQR no encontrada" }, { status: 404 });
    }

    // Si es residente, asegurarse de que solo pueda ver sus propias PQRs
    if (payload.role === "RESIDENT" && pqr.reportedById !== payload.id) {
      return NextResponse.json(
        { message: "Permisos insuficientes para ver esta PQR" },
        { status: 403 },
      );
    }

    ServerLogger.info(
      `PQR ${pqrId} obtenida para el complejo ${payload.complexId}`,
    );
    return NextResponse.json(pqr, { status: 200 });
  } catch (error) {
    ServerLogger.error(`Error al obtener PQR ${params.id}:`, error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const pqrId = parseInt(params.id);
    if (isNaN(pqrId)) {
      return NextResponse.json({ message: "ID de PQR inválido" }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = UpdatePQRSchema.parse(body);

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    const updatedPQR = await tenantPrisma.pQR.update({
      where: { id: pqrId, complexId: payload.complexId },
      data: validatedData,
    });

    ServerLogger.info(
      `PQR ${pqrId} actualizada para el complejo ${payload.complexId}`,
    );
    return NextResponse.json(updatedPQR, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error(`Error al actualizar PQR ${params.id}:`, error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const pqrId = parseInt(params.id);
    if (isNaN(pqrId)) {
      return NextResponse.json({ message: "ID de PQR inválido" }, { status: 400 });
    }

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    await tenantPrisma.pQR.delete({
      where: { id: pqrId, complexId: payload.complexId },
    });

    ServerLogger.info(
      `PQR ${pqrId} eliminada para el complejo ${payload.complexId}`,
    );
    return NextResponse.json({ message: "PQR eliminada exitosamente" }, { status: 200 });
  } catch (error) {
    ServerLogger.error(`Error al eliminar PQR ${params.id}:`, error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}