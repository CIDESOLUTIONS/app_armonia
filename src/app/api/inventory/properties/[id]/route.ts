import { NextRequest, NextResponse } from "next/server";
import { getTenantPrismaClient } from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { z } from "zod";
import { ServerLogger } from "@/lib/logging/server-logger";

const PropertySchema = z.object({
  unitNumber: z.string().min(1, "El número de unidad es requerido."),
  address: z.string().min(1, "La dirección es requerida."),
  type: z.string().min(1, "El tipo es requerido."),
  area: z.number().min(0, "El área debe ser un número positivo."),
  bedrooms: z
    .number()
    .int()
    .min(0, "El número de habitaciones debe ser un entero positivo."),
  bathrooms: z
    .number()
    .min(0, "El número de baños debe ser un número positivo."),
  parkingSpaces: z
    .number()
    .int()
    .min(0, "El número de parqueaderos debe ser un entero positivo."),
  isActive: z.boolean().default(true),
});

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

    const propertyId = parseInt(params.id);
    if (isNaN(propertyId)) {
      return NextResponse.json({ message: "ID de propiedad inválido" }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = PropertySchema.partial().parse(body);

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    const updatedProperty = await tenantPrisma.property.update({
      where: { id: propertyId, complexId: payload.complexId },
      data: validatedData,
    });

    ServerLogger.info(
      `Propiedad ${propertyId} actualizada para el complejo ${payload.complexId}`,
    );
    return NextResponse.json(updatedProperty, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error(`Error al actualizar propiedad ${params.id}:`, error);
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

    const propertyId = parseInt(params.id);
    if (isNaN(propertyId)) {
      return NextResponse.json({ message: "ID de propiedad inválido" }, { status: 400 });
    }

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    await tenantPrisma.property.delete({
      where: { id: propertyId, complexId: payload.complexId },
    });

    ServerLogger.info(
      `Propiedad ${propertyId} eliminada para el complejo ${payload.complexId}`,
    );
    return NextResponse.json({ message: "Propiedad eliminada exitosamente" }, { status: 200 });
  } catch (error) {
    ServerLogger.error(`Error al eliminar propiedad ${params.id}:`, error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}