import { NextRequest, NextResponse } from "next/server";
import { getTenantPrismaClient } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { ServerLogger } from "@/lib/logging/server-logger";
import { z } from "zod";

const PQRCommentSchema = z.object({
  pqrId: z.number().int().positive("ID de PQR inválido."),
  comment: z.string().min(1, "El comentario no puede estar vacío."),
});

export async function POST(request: NextRequest) {
  try {
    const { auth, payload } = await verifyAuth(request);
    if (!auth || !payload) {
      return NextResponse.json({ message: "Token requerido" }, { status: 401 });
    }

    if (!payload.complexId || !payload.schemaName) {
      return NextResponse.json(
        { message: "Usuario sin complejo o esquema asociado" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const validatedData = PQRCommentSchema.parse(body);

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);

    // Verificar que la PQR exista y pertenezca al complejo del usuario
    const existingPQR = await tenantPrisma.pQR.findUnique({
      where: { id: validatedData.pqrId, complexId: payload.complexId },
    });

    if (!existingPQR) {
      return NextResponse.json(
        { message: "PQR no encontrada" },
        { status: 404 },
      );
    }

    const newComment = await tenantPrisma.pQRComment.create({
      data: {
        pqrId: validatedData.pqrId,
        comment: validatedData.comment,
        authorId: payload.id,
        createdAt: new Date(),
      },
    });

    ServerLogger.info(
      `Comentario añadido a PQR ${validatedData.pqrId} por ${payload.email} en complejo ${payload.complexId}`,
    );
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error("Error al añadir comentario a PQR:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
