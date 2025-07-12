// src/app/api/assemblies/voting/user-votes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

const prisma = getPrisma();

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticación
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const decoded = await verifyToken(token); // Asumiendo que verifyToken devuelve el payload decodificado o null
    if (!decoded) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const assemblyId = searchParams.get("assemblyId");

    if (!assemblyId || typeof assemblyId !== "string") {
      return NextResponse.json(
        { message: "ID de asamblea requerido" },
        { status: 400 },
      );
    }

    // Obtener votos del usuario actual para esta asamblea
    const votes = await prisma.vote.findMany({
      where: {
        assemblyId: parseInt(assemblyId),
        userId: decoded.userId,
      },
      select: {
        agendaNumeral: true,
        vote: true,
      },
    });

    return NextResponse.json(
      {
        votes,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error en API de votos de usuario:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
