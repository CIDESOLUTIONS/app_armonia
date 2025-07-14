import { NextRequest, NextResponse } from "next/server";
import { getTenantPrismaClient } from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { z } from "zod";
import { ServerLogger } from "@/lib/logging/server-logger";

const ResidentSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  email: z.string().email("Email inválido."),
  phone: z.string().optional(),
  propertyId: z.number().int().positive("ID de propiedad inválido."),
  role: z.enum(["RESIDENT", "OWNER", "TENANT"], { message: "Rol inválido." }),
  isActive: z.boolean().default(true),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const authResult = await authMiddleware(request, [
      "ADMIN",
      "COMPLEX_ADMIN",
    ]);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const residentId = parseInt(params.id);
    if (isNaN(residentId)) {
      return NextResponse.json(
        { message: "ID de residente inválido" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const validatedData = ResidentSchema.partial().parse(body);

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    const updatedResident = await tenantPrisma.resident.update({
      where: { id: residentId, complexId: payload.complexId },
      data: validatedData,
    });

    ServerLogger.info(
      `Residente ${residentId} actualizado para el complejo ${payload.complexId}`,
    );
    return NextResponse.json(updatedResident, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error(`Error al actualizar residente ${params.id}:`, error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const authResult = await authMiddleware(request, [
      "ADMIN",
      "COMPLEX_ADMIN",
    ]);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const residentId = parseInt(params.id);
    if (isNaN(residentId)) {
      return NextResponse.json(
        { message: "ID de residente inválido" },
        { status: 400 },
      );
    }

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    await tenantPrisma.resident.delete({
      where: { id: residentId, complexId: payload.complexId },
    });

    ServerLogger.info(
      `Residente ${residentId} eliminado para el complejo ${payload.complexId}`,
    );
    return NextResponse.json(
      { message: "Residente eliminado exitosamente" },
      { status: 200 },
    );
  } catch (error) {
    ServerLogger.error(`Error al eliminar residente ${params.id}:`, error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}
