import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth"; // Asumiendo que verifyToken es adecuado para rutas de API

const prisma = getPrisma();

/**
 * API para confirmar la lectura de un anuncio que requiere confirmación
 *
 * POST: Confirma la lectura de un anuncio específico por el usuario actual
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Verificar autenticación usando el token del encabezado
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { error: "No autorizado: Token no proporcionado" },
        { status: 401 },
      );
    }

    const decoded = await verifyToken(token); // Decodificar y verificar el token
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: "No autorizado: Token inválido o usuario no encontrado" },
        { status: 401 },
      );
    }

    const userId = decoded.userId;
    const { id } = params; // Obtener el ID del anuncio de los parámetros de la URL

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "ID de anuncio no válido" },
        { status: 400 },
      );
    }

    // Verificar si el anuncio existe y requiere confirmación
    const announcement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!announcement) {
      return NextResponse.json(
        { error: "Anuncio no encontrado" },
        { status: 404 },
      );
    }

    if (!announcement.requiresConfirmation) {
      return NextResponse.json(
        { error: "Este anuncio no requiere confirmación" },
        { status: 400 },
      );
    }

    // Verificar si ya está confirmado
    const existingConfirmation =
      await prisma.announcementConfirmation.findFirst({
        where: {
          announcementId: id,
          userId,
        },
      });

    if (existingConfirmation) {
      return NextResponse.json(
        { message: "Anuncio ya confirmado" },
        { status: 200 },
      );
    }

    // Registrar confirmación
    const confirmation = await prisma.announcementConfirmation.create({
      data: {
        announcementId: id,
        userId,
        confirmedAt: new Date(),
      },
    });

    // También marcar como leído
    await prisma.announcementRead.upsert({
      where: {
        announcementId_userId: {
          announcementId: id,
          userId,
        },
      },
      update: {},
      create: {
        announcementId: id,
        userId,
        readAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        id: confirmation.id,
        announcementId: confirmation.announcementId,
        userId: confirmation.userId,
        confirmedAt: confirmation.confirmedAt,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error al confirmar lectura de anuncio:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
