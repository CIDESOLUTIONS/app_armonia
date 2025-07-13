import { NextRequest, NextResponse } from "next/server";
import { NotificationService } from "@/services/notificationService"; // This is the backend service class
import { verifyAuth } from "@/lib/auth";
import { ServerLogger } from "@/lib/logging/server-logger";
import { z } from "zod";

const SendNotificationSchema = z.object({
  title: z.string().min(1, "El título es requerido."),
  message: z.string().min(1, "El mensaje es requerido."),
  recipientType: z.enum(["ALL", "RESIDENT", "PROPERTY", "USER"]),
  recipientId: z.string().optional(),
});

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const validatedData = SendNotificationSchema.parse(body);

    const notificationService = new NotificationService(payload.schemaName);

    await notificationService.sendNotificationToRecipients(
      payload.complexId,
      payload.schemaName,
      validatedData.title,
      validatedData.message,
      validatedData.recipientType,
      validatedData.recipientId,
      payload.id, // sentBy
    );

    ServerLogger.info(
      `Notificación enviada por ${payload.email} en complejo ${payload.complexId}`,
    );

    return NextResponse.json(
      { message: "Notificación enviada correctamente" },
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
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
