import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { z } from "zod";
import { ServerLogger } from "@/lib/logging/server-logger";

const VehicleUpdateSchema = z.object({
  licensePlate: z.string().min(1, "La placa es requerida.").optional(),
  brand: z.string().min(1, "La marca es requerida.").optional(),
  model: z.string().min(1, "El modelo es requerido.").optional(),
  color: z.string().min(1, "El color es requerido.").optional(),
  ownerName: z
    .string()
    .min(1, "El nombre del propietario es requerido.")
    .optional(),
  propertyId: z.number().int().positive("ID de propiedad inválido.").optional(),
  parkingSpace: z.string().optional(),
  isActive: z.boolean().optional(),
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

    const id = parseInt(params.id);
    const updateData = await request.json();
    const validatedData = VehicleUpdateSchema.parse(updateData);

    const tenantPrisma = getPrisma(payload.schemaName);
    const updatedVehicle = await tenantPrisma.vehicle.update({
      where: { id },
      data: validatedData,
    });

    ServerLogger.info(
      `Vehículo actualizado: ${updatedVehicle.licensePlate} en complejo ${payload.complexId}`,
    );
    return NextResponse.json(updatedVehicle, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error("Error al actualizar vehículo:", error);
    return NextResponse.json(
      { message: "Error al actualizar vehículo" },
      { status: 500 },
    );
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

    const id = parseInt(params.id);

    const tenantPrisma = getPrisma(payload.schemaName);
    await tenantPrisma.vehicle.delete({ where: { id } });

    ServerLogger.info(
      `Vehículo eliminado: ID ${id} en complejo ${payload.complexId}`,
    );
    return NextResponse.json(
      { message: "Vehículo eliminado exitosamente" },
      { status: 200 },
    );
  } catch (error) {
    ServerLogger.error("Error al eliminar vehículo:", error);
    return NextResponse.json(
      { message: "Error al eliminar vehículo" },
      { status: 500 },
    );
  }
}
