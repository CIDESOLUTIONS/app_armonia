import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { z } from "zod";
import { ServerLogger } from "@/lib/logging/server-logger";

const AnnouncementUpdateSchema = z.object({
  title: z.string().min(1, "El título es requerido.").optional(),
  content: z.string().min(1, "El contenido es requerido.").optional(),
  publishedAt: z.string().datetime("Fecha de publicación inválida.").optional(),
  expiresAt: z
    .string()
    .datetime("Fecha de expiración inválida.")
    .optional()
    .nullable(),
  isActive: z.boolean().optional(),
  targetRoles: z.array(z.string()).optional(),
});

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

    const announcementId = parseInt(params.id);

    const tenantPrisma = getPrisma(payload.schemaName);
    const announcement = await tenantPrisma.announcement.findUnique({
      where: { id: announcementId, complexId: payload.complexId },
    });

    if (!announcement) {
      return NextResponse.json(
        { message: "Anuncio no encontrado" },
        { status: 404 },
      );
    }

    ServerLogger.info(
      `Anuncio ${announcementId} obtenido para el complejo ${payload.complexId}`,
    );
    return NextResponse.json(announcement, { status: 200 });
  } catch (error) {
    ServerLogger.error(`Error al obtener anuncio ${params.id}:`, error);
    return NextResponse.json(
      { message: "Error al obtener anuncio" },
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
    ]);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const announcementId = parseInt(params.id);
    const body = await request.json();
    const validatedData = AnnouncementUpdateSchema.parse(body);

    const tenantPrisma = getPrisma(payload.schemaName);
    const updatedAnnouncement = await tenantPrisma.announcement.update({
      where: { id: announcementId, complexId: payload.complexId },
      data: validatedData,
    });

    ServerLogger.info(
      `Anuncio ${announcementId} actualizado en complejo ${payload.complexId}`,
    );
    return NextResponse.json(updatedAnnouncement, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error(`Error al actualizar anuncio ${params.id}:`, error);
    return NextResponse.json(
      { message: "Error al actualizar anuncio" },
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

    const announcementId = parseInt(params.id);

    const tenantPrisma = getPrisma(payload.schemaName);
    await tenantPrisma.announcement.delete({
      where: { id: announcementId, complexId: payload.complexId },
    });

    ServerLogger.info(
      `Anuncio ${announcementId} eliminado del complejo ${payload.complexId}`,
    );
    return NextResponse.json(
      { message: "Anuncio eliminado exitosamente" },
      { status: 200 },
    );
  } catch (error) {
    ServerLogger.error(`Error al eliminar anuncio ${params.id}:`, error);
    return NextResponse.json(
      { message: "Error al eliminar anuncio" },
      { status: 500 },
    );
  }
}
