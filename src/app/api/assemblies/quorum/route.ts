// src/app/api/assemblies/quorum/route.ts
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

    // Obtener datos de la asamblea
    const assembly = await prisma.assembly.findUnique({
      where: { id: parseInt(assemblyId) },
      include: {
        attendees: true,
      },
    });

    if (!assembly) {
      return NextResponse.json(
        { message: "Asamblea no encontrada" },
        { status: 404 },
      );
    }

    // Obtener total de unidades elegibles para votar
    const totalEligible = await prisma.resident.count({
      where: {
        isActive: true,
        residentType: "OWNER", // Solo propietarios pueden votar
      },
    });

    // Calcular estadísticas de quórum
    const confirmedAttendees = assembly.attendees.length;
    const quorumPercentage = assembly.quorumPercentage || 50; // Valor por defecto si no está definido
    const currentPercentage = (confirmedAttendees / totalEligible) * 100;
    const quorumReached = currentPercentage >= quorumPercentage;

    return NextResponse.json(
      {
        confirmedAttendees,
        totalEligible,
        quorumReached,
        quorumPercentage,
        currentPercentage,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error en API de quórum:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
