import { NextRequest, NextResponse } from "next/server";
import { getTenantPrismaClient } from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { z } from "zod";
import { ServerLogger } from "@/lib/logging/server-logger";

const ReservationSchema = z.object({
  commonAreaId: z.number().int().positive("ID de área común inválido."),
  userId: z.number().int().positive("ID de usuario inválido."),
  propertyId: z.number().int().positive("ID de propiedad inválido."),
  title: z.string().min(1, "El título es requerido."),
  description: z.string().optional(),
  startDateTime: z.string().datetime("Fecha y hora de inicio inválidas."),
  endDateTime: z.string().datetime("Fecha y hora de fin inválidas."),
  status: z
    .enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED", "COMPLETED"])
    .default("PENDING"),
  attendees: z
    .number()
    .int()
    .min(1, "El número de asistentes debe ser al menos 1."),
  requiresPayment: z.boolean().default(false),
  paymentAmount: z.number().optional(),
  paymentStatus: z.string().optional(),
  rejectionReason: z.string().optional(),
  approvedById: z.number().int().optional(),
  approvedAt: z.string().datetime().optional(),
  cancellationReason: z.string().optional(),
  cancelledAt: z.string().datetime().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const authResult = await authMiddleware(request, [
      "ADMIN",
      "COMPLEX_ADMIN",
      "RESIDENT",
    ]);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const reservationId = parseInt(params.id);
    if (isNaN(reservationId)) {
      return NextResponse.json(
        { message: "ID de reserva inválido" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const validatedData = ReservationSchema.partial().parse(body);

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    const updatedReservation = await tenantPrisma.reservation.update({
      where: { id: reservationId, complexId: payload.complexId },
      data: validatedData,
    });

    ServerLogger.info(
      `Reserva ${reservationId} actualizada para el complejo ${payload.complexId}`,
    );
    return NextResponse.json(updatedReservation, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error(`Error al actualizar reserva ${params.id}:`, error);
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
      "RESIDENT",
    ]);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const reservationId = parseInt(params.id);
    if (isNaN(reservationId)) {
      return NextResponse.json(
        { message: "ID de reserva inválido" },
        { status: 400 },
      );
    }

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    await tenantPrisma.reservation.delete({
      where: { id: reservationId, complexId: payload.complexId },
    });

    ServerLogger.info(
      `Reserva ${reservationId} eliminada para el complejo ${payload.complexId}`,
    );
    return NextResponse.json(
      { message: "Reserva eliminada exitosamente" },
      { status: 200 },
    );
  } catch (error) {
    ServerLogger.error(`Error al eliminar reserva ${params.id}:`, error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}
