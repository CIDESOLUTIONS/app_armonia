
import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { getTenantPrismaClient } from "@/lib/prisma";
import { ServerLogger } from "@/lib/logging/server-logger";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { auth, payload } = await verifyAuth(request);
    if (!auth || !payload) {
      return NextResponse.json({ message: "Token requerido" }, { status: 401 });
    }

    if (!payload.complexId || !payload.schemaName || !payload.userId) {
      return NextResponse.json(
        { message: "Usuario sin complejo, esquema o ID de usuario asociado" },
        { status: 400 },
      );
    }

    const assemblyId = parseInt(params.id);
    if (isNaN(assemblyId)) {
      return NextResponse.json(
        { message: "ID de asamblea inválido." },
        { status: 400 },
      );
    }

    const { votingId, optionValue } = await request.json();

    if (!votingId || !optionValue) {
      return NextResponse.json(
        { message: "ID de votación y valor de opción son requeridos." },
        { status: 400 },
      );
    }

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);

    // 1. Verificar que la asamblea y la votación existen y están activas
    const assembly = await tenantPrisma.assembly.findUnique({
      where: { id: assemblyId },
      include: {
        votings: {
          where: { id: votingId, status: "ACTIVE" },
        },
      },
    });

    if (!assembly || assembly.votings.length === 0) {
      return NextResponse.json(
        { message: "Votación no encontrada o no activa." },
        { status: 404 },
      );
    }

    const voting = assembly.votings[0];

    // 2. Verificar si el usuario ya votó en esta votación
    const existingVote = await tenantPrisma.vote.findFirst({
      where: {
        votingId: voting.id,
        userId: payload.userId,
      },
    });

    if (existingVote) {
      return NextResponse.json(
        { message: "Ya has votado en esta votación." },
        { status: 409 },
      );
    }

    // 3. Obtener el attendeeId y el coeficiente del usuario para esta asamblea
    const attendee = await tenantPrisma.assemblyAttendee.findFirst({
      where: {
        assemblyId: assembly.id,
        userId: payload.userId,
      },
      select: { id: true, coefficient: true, propertyUnitId: true },
    });

    if (!attendee) {
      return NextResponse.json(
        { message: "No estás registrado como asistente a esta asamblea." },
        { status: 403 },
      );
    }

    // 4. Registrar el voto
    const newVote = await tenantPrisma.vote.create({
      data: {
        votingId: voting.id,
        attendeeId: attendee.id,
        userId: payload.userId,
        propertyUnitId: attendee.propertyUnitId,
        coefficient: attendee.coefficient,
        value: optionValue,
        ipAddress: request.ip || "", // Obtener IP real
        userAgent: request.headers.get("user-agent") || "",
      },
    });

    // 5. Actualizar los contadores de la votación (totalVotes, totalCoefficientVoted)
    // Esto se puede hacer de forma más robusta con transacciones o triggers en la DB
    // Por simplicidad, lo haremos aquí directamente.
    await tenantPrisma.voting.update({
      where: { id: voting.id },
      data: {
        totalVotes: { increment: 1 },
        totalCoefficientVoted: { increment: attendee.coefficient },
      },
    });

    ServerLogger.info(
      `Voto registrado para el usuario ${payload.userId} en la votación ${voting.id}`,
    );
    return NextResponse.json(newVote, { status: 201 });
  } catch (error: any) {
    ServerLogger.error("Error al registrar voto:", error);
    return NextResponse.json(
      { message: "Error interno del servidor", details: error.message },
      { status: 500 },
    );
  }
}
