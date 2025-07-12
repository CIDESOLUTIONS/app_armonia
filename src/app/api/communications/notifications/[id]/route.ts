import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/lib/auth";
import { ServerLogger } from "@/lib/logging/server-logger";
import { NotificationService } from "@/services/notificationService";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
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

    const notificationId = parseInt(params.id);

    if (!payload.complexId || !payload.schemaName || !payload.id) {
      return NextResponse.json(
        { message: "Usuario sin complejo asociado o ID de usuario faltante" },
        { status: 400 },
      );
    }

    const notificationService = new NotificationService(payload.schemaName);
    const notification = await notificationService.getNotifications(
      payload.id,
      payload.complexId,
      { id: notificationId },
    );

    if (!notification || notification.length === 0) {
      return NextResponse.json(
        { message: "Notificación no encontrada" },
        { status: 404 },
      );
    }

    // Asegurar que la notificación pertenece al usuario o que es admin/complex_admin
    const targetNotification = notification[0];
    if (
      targetNotification.userId !== payload.id &&
      !["ADMIN", "COMPLEX_ADMIN"].includes(payload.role)
    ) {
      return NextResponse.json(
        { message: "No tiene permiso para ver esta notificación" },
        { status: 403 },
      );
    }

    ServerLogger.info(
      `Notificación ${notificationId} obtenida para el usuario ${payload.id} en complejo ${payload.complexId}`,
    );
    return NextResponse.json(targetNotification, { status: 200 });
  } catch (error) {
    ServerLogger.error(`Error al obtener notificación ${params.id}:`, error);
    return NextResponse.json(
      { message: "Error al obtener notificación" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
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

    const notificationId = parseInt(params.id);

    if (!payload.complexId || !payload.schemaName || !payload.id) {
      return NextResponse.json(
        { message: "Usuario sin complejo asociado o ID de usuario faltante" },
        { status: 400 },
      );
    }

    const notificationService = new NotificationService(payload.schemaName);
    const updatedNotification =
      await notificationService.markAsRead(notificationId);

    ServerLogger.info(
      `Notificación ${notificationId} marcada como leída por el usuario ${payload.id} en complejo ${payload.complexId}`,
    );
    return NextResponse.json(updatedNotification, { status: 200 });
  } catch (error) {
    ServerLogger.error(
      `Error al marcar notificación ${params.id} como leída:`,
      error,
    );
    return NextResponse.json(
      { message: "Error al marcar notificación como leída" },
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

    const notificationId = parseInt(params.id);

    if (!payload.complexId || !payload.schemaName) {
      return NextResponse.json(
        { message: "Usuario sin complejo asociado" },
        { status: 400 },
      );
    }

    const notificationService = new NotificationService(payload.schemaName);
    await notificationService.deleteNotification(notificationId);

    ServerLogger.info(
      `Notificación ${notificationId} eliminada por el usuario ${payload.id} en complejo ${payload.complexId}`,
    );
    return NextResponse.json(
      { message: "Notificación eliminada exitosamente" },
      { status: 200 },
    );
  } catch (error) {
    ServerLogger.error(`Error al eliminar notificación ${params.id}:`, error);
    return NextResponse.json(
      { message: "Error al eliminar notificación" },
      { status: 500 },
    );
  }
}
