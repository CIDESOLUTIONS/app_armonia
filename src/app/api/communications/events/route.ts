import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/lib/auth";
import { ServerLogger } from "@/lib/logging/server-logger";
import { CommunityEventService } from "@/services/communityEventService";
import { z } from "zod";

const EventSchema = z
  .object({
    title: z.string().min(1, "El título es requerido."),
    description: z.string().optional(),
    startDate: z.string().datetime("Fecha de inicio inválida."),
    endDate: z.string().datetime("Fecha de fin inválida."),
    location: z.string().min(1, "La ubicación es requerida."),
    type: z.string().default("other"),
    visibility: z.enum(["public", "private", "roles"]).default("public"),
    targetRoles: z.array(z.string()).default([]),
    maxAttendees: z
      .number()
      .int()
      .min(0, "El número máximo de asistentes debe ser un número positivo.")
      .optional()
      .nullable(),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: "La fecha de inicio debe ser anterior o igual a la fecha de fin.",
    path: ["startDate"],
  });

export async function GET(request: NextRequest) {
  try {
    const authResult = await authMiddleware(request, [
      "ADMIN",
      "COMPLEX_ADMIN",
      "RESIDENT",
      "STAFF",
    ]);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    if (!payload.complexId || !payload.schemaName) {
      return NextResponse.json(
        { message: "Usuario sin complejo asociado" },
        { status: 400 },
      );
    }

    const { searchParams } = new URL(request.url);
    const filters = {
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      type: searchParams.get("type") || undefined,
    };

    const communityEventService = new CommunityEventService(payload.schemaName);
    const events = await communityEventService.getEvents(
      payload.complexId,
      filters,
      payload.role,
    );

    ServerLogger.info(`Eventos listados para el complejo ${payload.complexId}`);
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error("Error al obtener eventos:", error);
    return NextResponse.json(
      { message: "Error al obtener eventos" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await authMiddleware(request, [
      "ADMIN",
      "COMPLEX_ADMIN",
    ]);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    if (!payload.complexId || !payload.schemaName) {
      return NextResponse.json(
        { message: "Usuario sin complejo asociado" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const validatedData = EventSchema.parse(body);

    const communityEventService = new CommunityEventService(payload.schemaName);
    const newEvent = await communityEventService.createEvent({
      ...validatedData,
      startDate: new Date(validatedData.startDate),
      endDate: new Date(validatedData.endDate),
      createdById: payload.id,
      complexId: payload.complexId,
    });

    ServerLogger.info(
      `Evento creado: ${newEvent.title} en complejo ${payload.complexId}`,
    );
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error("Error al crear evento:", error);
    return NextResponse.json(
      { message: "Error al crear evento" },
      { status: 500 },
    );
  }
}
