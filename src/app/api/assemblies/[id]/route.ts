import { NextRequest, NextResponse } from "next/server";
import { getTenantPrismaClient } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { ServerLogger } from "@/lib/logging/server-logger";
import { z } from "zod";
import { UpdateAssemblySchema } from "@/validators/assemblies/assemblies.validator";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { auth, payload } = await verifyAuth(request);
    if (!auth || !payload) {
      return NextResponse.json({ message: "Token requerido" }, { status: 401 });
    }

    if (!["ADMIN", "COMPLEX_ADMIN", "RESIDENT"].includes(payload.role)) {
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

    const assemblyId = parseInt(params.id);
    if (isNaN(assemblyId)) {
      return NextResponse.json({ message: "ID de asamblea inválido" }, { status: 400 });
    }

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    const assembly = await tenantPrisma.assembly.findUnique({
      where: { id: assemblyId, complexId: payload.complexId },
    });

    if (!assembly) {
      return NextResponse.json({ message: "Asamblea no encontrada" }, { status: 404 });
    }

    ServerLogger.info(
      `Asamblea ${assemblyId} obtenida para el complejo ${payload.complexId}`,
    );
    return NextResponse.json(assembly, { status: 200 });
  } catch (error) {
    ServerLogger.error(`Error al obtener asamblea ${params.id}:`, error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { auth, payload } = await verifyAuth(request);
    if (!auth || !payload) {
      return NextResponse.json({ message: "Token requerido" }, { status: 401 });
    }

    if (!["ADMIN", "COMPLEX_ADMIN"].includes(payload.role)) {
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

    const assemblyId = parseInt(params.id);
    if (isNaN(assemblyId)) {
      return NextResponse.json({ message: "ID de asamblea inválido" }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = UpdateAssemblySchema.parse(body);

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    const updatedAssembly = await tenantPrisma.assembly.update({
      where: { id: assemblyId, complexId: payload.complexId },
      data: validatedData,
    });

    ServerLogger.info(
      `Asamblea ${assemblyId} actualizada para el complejo ${payload.complexId}`,
    );
    return NextResponse.json(updatedAssembly, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error(`Error al actualizar asamblea ${params.id}:`, error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { auth, payload } = await verifyAuth(request);
    if (!auth || !payload) {
      return NextResponse.json({ message: "Token requerido" }, { status: 401 });
    }

    if (!["ADMIN", "COMPLEX_ADMIN"].includes(payload.role)) {
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

    const assemblyId = parseInt(params.id);
    if (isNaN(assemblyId)) {
      return NextResponse.json({ message: "ID de asamblea inválido" }, { status: 400 });
    }

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    await tenantPrisma.assembly.delete({
      where: { id: assemblyId, complexId: payload.complexId },
    });

    ServerLogger.info(
      `Asamblea ${assemblyId} eliminada para el complejo ${payload.complexId}`,
    );
    return NextResponse.json({ message: "Asamblea eliminada exitosamente" }, { status: 200 });
  } catch (error) {
    ServerLogger.error(`Error al eliminar asamblea ${params.id}:`, error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}
