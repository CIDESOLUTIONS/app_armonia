import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { z } from "zod";
import { ServerLogger } from "@/lib/logging/server-logger";

const PQRCommentSchema = z.object({
  comment: z.string().min(1, "El comentario no puede estar vacío."),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const authResult = await authMiddleware(request, [
      "ADMIN",
      "COMPLEX_ADMIN",
      "STAFF",
      "RESIDENT",
    ]);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const pqrId = parseInt(params.id);
    const body = await request.json();
    const validatedData = PQRCommentSchema.parse(body);

    const tenantPrisma = getPrisma(payload.schemaName);
    const newComment = await tenantPrisma.pQRComment.create({
      data: {
        pqrId: pqrId,
        comment: validatedData.comment,
        authorId: payload.id,
      },
    });

    ServerLogger.info(`Comentario añadido a PQR ${pqrId} por ${payload.email}`);
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error(`Error al añadir comentario a PQR ${params.id}:`, error);
    return NextResponse.json(
      { message: "Error al añadir comentario" },
      { status: 500 },
    );
  }
}
