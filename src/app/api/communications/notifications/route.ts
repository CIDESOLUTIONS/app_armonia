import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/lib/auth";
import { ServerLogger } from "@/lib/logging/server-logger";
import { NotificationService } from "@/services/notificationService";
import { z } from "zod";

const NotificationSchema = z.object({
  title: z.string().min(1, "El título es requerido."),
  message: z.string().min(1, "El mensaje es requerido."),
  recipientType: z.enum(["ALL", "RESIDENT", "PROPERTY", "USER"]).default("ALL"),
  recipientId: z.string().optional(), // ID of specific recipient if type is not ALL
});

const NotificationFilterSchema = z.object({
  type: z.string().optional(),
  read: z.boolean().optional(),
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

    if (!payload.complexId || !payload.schemaName || !payload.id) {
      return NextResponse.json(
        { message: "Usuario sin complejo asociado o ID de usuario faltante" },
        { status: 400 },
      );
    }

    const { searchParams } = new URL(request.url);
    const filters = {
      type: searchParams.get("type") || undefined,
      read: searchParams.has("read")
        ? searchParams.get("read") === "true"
        : undefined,
    };

    const validatedFilters = NotificationFilterSchema.parse(filters);

    const notificationService = new NotificationService(payload.schemaName);
    const notifications = await notificationService.getNotifications(
      payload.id,
      payload.complexId,
      validatedFilters,
    );

    ServerLogger.info(
      `Notificaciones listadas para el usuario ${payload.id} en complejo ${payload.complexId}`,
    );
    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error("Error al obtener notificaciones:", error);
    return NextResponse.json(
      { message: "Error al obtener notificaciones" },
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

    if (!payload.complexId || !payload.schemaName || !payload.id) {
      return NextResponse.json(
        { message: "Usuario sin complejo asociado o ID de usuario faltante" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const validatedData = NotificationSchema.parse(body);

    const notificationService = new NotificationService(payload.schemaName);
    await notificationService.sendNotificationToRecipients(
      payload.complexId,
      payload.schemaName,
      validatedData.title,
      validatedData.message,
      validatedData.recipientType,
      validatedData.recipientId,
      payload.id,
    );

    ServerLogger.info(
      `Notificación enviada a ${validatedData.recipientType} por ${payload.email} en complejo ${payload.complexId}`,
    );
    return NextResponse.json(
      { message: "Notificación enviada exitosamente" },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error("Error al enviar notificación:", error);
    return NextResponse.json(
      { message: "Error al enviar notificación" },
      { status: 500 },
    );
  }
}
