import { NextRequest, NextResponse } from "next/server";
import { getTenantPrismaClient } from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { z } from "zod";
import { ServerLogger } from "@/lib/logging/server-logger";

const VehicleSchema = z.object({
  licensePlate: z.string().min(1, "La placa es requerida."),
  brand: z.string().min(1, "La marca es requerida."),
  model: z.string().min(1, "El modelo es requerido."),
  color: z.string().min(1, "El color es requerido."),
  ownerName: z.string().min(1, "El nombre del propietario es requerido."),
  propertyId: z.number().int().positive("ID de propiedad inválido."),
  parkingSpace: z.string().optional(),
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

    const vehicleId = parseInt(params.id);
    if (isNaN(vehicleId)) {
      return NextResponse.json({ message: "ID de vehículo inválido" }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = VehicleSchema.partial().parse(body);

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    const updatedVehicle = await tenantPrisma.vehicle.update({
      where: { id: vehicleId, complexId: payload.complexId },
      data: validatedData,
    });

    ServerLogger.info(
      `Vehículo ${vehicleId} actualizado para el complejo ${payload.complexId}`,
    );
    return NextResponse.json(updatedVehicle, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error(`Error al actualizar vehículo ${params.id}:`, error);
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

    const vehicleId = parseInt(params.id);
    if (isNaN(vehicleId)) {
      return NextResponse.json({ message: "ID de vehículo inválido" }, { status: 400 });
    }

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    await tenantPrisma.vehicle.delete({
      where: { id: vehicleId, complexId: payload.complexId },
    });

    ServerLogger.info(
      `Vehículo ${vehicleId} eliminado para el complejo ${payload.complexId}`,
    );
    return NextResponse.json({ message: "Vehículo eliminado exitosamente" }, { status: 200 });
  } catch (error) {
    ServerLogger.error(`Error al eliminar vehículo ${params.id}:`, error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}