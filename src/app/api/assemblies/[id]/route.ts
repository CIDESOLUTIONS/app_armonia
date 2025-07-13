import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { z } from "zod";
import { ServerLogger } from "@/lib/logging/server-logger";
import { UpdateAssemblySchema } from "@/validators/assemblies/assemblies.validator";

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

    const id = parseInt(params.id);
    const body = await request.json();
    const validatedData = UpdateAssemblySchema.parse(body);

    const prisma = getPrisma();
    const updatedAssembly = await prisma.assembly.update({
      where: { id: id, complexId: payload.complexId },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        scheduledDate: validatedData.scheduledDate
          ? new Date(validatedData.scheduledDate)
          : undefined,
        location: validatedData.location,
        type: validatedData.type,
        agenda: validatedData.agenda,
        status: validatedData.status,
      },
    });

    ServerLogger.info(
      `[ASSEMBLIES] Asamblea actualizada: ${updatedAssembly.id} por ${payload.email}`,
    );
    return NextResponse.json(updatedAssembly, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error("[ASSEMBLIES PUT] Error:", error);
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
    ]);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const id = parseInt(params.id);

    const prisma = getPrisma();
    await prisma.assembly.delete({
      where: { id: id, complexId: payload.complexId },
    });

    ServerLogger.info(
      `[ASSEMBLIES] Asamblea eliminada: ${id} por ${payload.email}`,
    );
    return NextResponse.json(
      { message: "Asamblea eliminada exitosamente" },
      { status: 200 },
    );
  } catch (error) {
    ServerLogger.error("[ASSEMBLIES DELETE] Error:", error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}
