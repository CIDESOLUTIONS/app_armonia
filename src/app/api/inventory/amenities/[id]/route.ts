import { NextRequest, NextResponse } from "next/server";
import { getTenantPrismaClient } from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { z } from "zod";
import { ServerLogger } from "@/lib/logging/server-logger";

const AmenitySchema = z
  .object({
    name: z.string().min(1, "El nombre es requerido."),
    description: z.string().optional(),
    location: z.string().min(1, "La ubicación es requerida."),
    capacity: z
      .number()
      .int()
      .min(0, "La capacidad debe ser un número positivo."),
    requiresApproval: z.boolean().default(false),
    hasFee: z.boolean().default(false),
    feeAmount: z.number().optional(),
    isActive: z.boolean().default(true),
  })
  .refine(
    (data) =>
      !data.hasFee ||
      (data.hasFee && data.feeAmount !== undefined && data.feeAmount >= 0),
    {
      message: "El monto de la tarifa es requerido si tiene costo.",
      path: ["feeAmount"],
    },
  );

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authMiddleware(request, [
      "ADMIN",
      "COMPLEX_ADMIN",
    ]);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const amenityId = parseInt(params.id);
    if (isNaN(amenityId)) {
      return NextResponse.json({ message: "ID de amenidad inválido" }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = AmenitySchema.partial().parse(body);

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    const updatedAmenity = await tenantPrisma.commonArea.update({
      where: { id: amenityId, complexId: payload.complexId },
      data: validatedData,
    });

    ServerLogger.info(
      `Amenidad ${amenityId} actualizada para el complejo ${payload.complexId}`,
    );
    return NextResponse.json(updatedAmenity, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error(`Error al actualizar amenidad ${params.id}:`, error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authMiddleware(request, [
      "ADMIN",
      "COMPLEX_ADMIN",
    ]);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const amenityId = parseInt(params.id);
    if (isNaN(amenityId)) {
      return NextResponse.json({ message: "ID de amenidad inválido" }, { status: 400 });
    }

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    await tenantPrisma.commonArea.delete({
      where: { id: amenityId, complexId: payload.complexId },
    });

    ServerLogger.info(
      `Amenidad ${amenityId} eliminada para el complejo ${payload.complexId}`,
    );
    return NextResponse.json({ message: "Amenidad eliminada exitosamente" }, { status: 200 });
  } catch (error) {
    ServerLogger.error(`Error al eliminar amenidad ${params.id}:`, error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}