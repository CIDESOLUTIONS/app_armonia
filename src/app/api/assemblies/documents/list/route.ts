import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// Variable JWT_SECRET eliminada por lint

export async function GET(_req: unknown) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");

  // Variable assemblyId eliminada por lint

  if (!token || !assemblyId)
    return NextResponse.json({ message: "Faltan parámetros" }, { status: 400 });

  try {
    // Variable decoded eliminada por lint
    const schemaName = decoded.schemaName.toLowerCase();
    prisma.setTenantSchema(schemaName);

    const documents = await prisma.$queryRawUnsafe(
      `SELECT id, fileName, "createdAt" FROM "${schemaName}"."Document" WHERE "assemblyId" = $1`,
      assemblyId,
    );
    return NextResponse.json({ documents }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error al listar documentos", error: String(error) },
      { status: 500 },
    );
  }
}
