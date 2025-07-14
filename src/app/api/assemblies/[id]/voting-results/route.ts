import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { getTenantPrismaClient } from "@/lib/prisma";
import { ServerLogger } from "@/lib/logging/server-logger";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
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

    const assemblyId = parseInt(params.id);
    if (isNaN(assemblyId)) {
      return NextResponse.json(
        { message: "ID de asamblea inválido." },
        { status: 400 },
      );
    }

    const { searchParams } = new URL(request.url);
    const votingId = parseInt(searchParams.get("votingId") || "");

    if (isNaN(votingId)) {
      return NextResponse.json(
        { message: "ID de votación inválido." },
        { status: 400 },
      );
    }

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);

    const voting = await tenantPrisma.voting.findUnique({
      where: { id: votingId, assemblyId: assemblyId },
      include: {
        votes: {
          select: {
            value: true,
            coefficient: true,
          },
        },
      },
    });

    if (!voting) {
      return NextResponse.json(
        { message: "Votación no encontrada." },
        { status: 404 },
      );
    }

    // Calcular resultados
    const results: { [key: string]: { count: number; coefficient: number } } =
      {};
    const options = voting.options as string[]; // Asumiendo que options es un array de strings

    options.forEach((option) => {
      results[option] = { count: 0, coefficient: 0 };
    });

    voting.votes.forEach((vote) => {
      if (results[vote.value]) {
        results[vote.value].count++;
        results[vote.value].coefficient += vote.coefficient;
      } else {
        // Manejar votos para opciones no definidas (posiblemente un error o cambio en opciones)
        ServerLogger.warn(`Voto para opción no reconocida: ${vote.value}`);
      }
    });

    return NextResponse.json({ voting, results }, { status: 200 });
  } catch (error: any) {
    ServerLogger.error("Error al obtener resultados de votación:", error);
    return NextResponse.json(
      { message: "Error interno del servidor", details: error.message },
      { status: 500 },
    );
  }
}
