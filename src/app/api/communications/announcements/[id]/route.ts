import { NextRequest, NextResponse } from "next/server";
import { getTenantPrismaClient } from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { z } from "zod";
import { ServerLogger } from "@/lib/logging/server-logger";

const AnnouncementSchema = z.object({
  title: z.string().min(1, "El título es requerido."),
  content: z.string().min(1, "El contenido es requerido."),
  publishedAt: z.string().datetime("Fecha de publicación inválida."),
  expiresAt: z
    .string()
    .datetime("Fecha de expiración inválida.")
    .optional()
    .nullable(),
  isActive: z.boolean().default(true),
  targetRoles: z.array(z.string()).default([]), // Roles a los que va dirigido el anuncio
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

    const announcementId = parseInt(params.id);
    if (isNaN(announcementId)) {
      return NextResponse.json({ message: "ID de anuncio inválido" }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = AnnouncementSchema.partial().parse(body);

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    const updatedAnnouncement = await tenantPrisma.announcement.update({
      where: { id: announcementId, complexId: payload.complexId },
      data: validatedData,
    });

    ServerLogger.info(
      `Anuncio ${announcementId} actualizado para el complejo ${payload.complexId}`,
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

    const announcementId = parseInt(params.id);
    if (isNaN(announcementId)) {
      return NextResponse.json({ message: "ID de anuncio inválido" }, { status: 400 });
    }

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    await tenantPrisma.announcement.delete({
      where: { id: announcementId, complexId: payload.complexId },
    });

    ServerLogger.info(
      `Anuncio ${announcementId} eliminado para el complejo ${payload.complexId}`,
    );
    return NextResponse.json({ message: "Anuncio eliminado exitosamente" }, { status: 200 });
  } catch (error) {
    ServerLogger.error(`Error al eliminar anuncio ${params.id}:`, error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}