import { NextRequest, NextResponse } from "next/server";
import { getTenantPrismaClient } from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { z } from "zod";
import { ServerLogger } from "@/lib/logging/server-logger";

const PetSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  species: z.string().min(1, "La especie es requerida."),
  breed: z.string().min(1, "La raza es requerida."),
  ownerName: z.string().min(1, "El nombre del propietario es requerido."),
  propertyId: z.number().int().positive("ID de propiedad inválido."),
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

    const petId = parseInt(params.id);
    if (isNaN(petId)) {
      return NextResponse.json(
        { message: "ID de mascota inválido" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const validatedData = PetSchema.partial().parse(body);

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    const updatedPet = await tenantPrisma.pet.update({
      where: { id: petId, complexId: payload.complexId },
      data: validatedData,
    });

    ServerLogger.info(
      `Mascota ${petId} actualizada para el complejo ${payload.complexId}`,
    );
    return NextResponse.json(updatedPet, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error(`Error al actualizar mascota ${params.id}:`, error);
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

    const petId = parseInt(params.id);
    if (isNaN(petId)) {
      return NextResponse.json(
        { message: "ID de mascota inválido" },
        { status: 400 },
      );
    }

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    await tenantPrisma.pet.delete({
      where: { id: petId, complexId: payload.complexId },
    });

    ServerLogger.info(
      `Mascota ${petId} eliminada para el complejo ${payload.complexId}`,
    );
    return NextResponse.json(
      { message: "Mascota eliminada exitosamente" },
      { status: 200 },
    );
  } catch (error) {
    ServerLogger.error(`Error al eliminar mascota ${params.id}:`, error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}
