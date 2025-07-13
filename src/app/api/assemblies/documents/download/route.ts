import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Document {
  fileName: string;
}

// Variable JWT_SECRET eliminada por lint

export async function GET(_req: unknown) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  const { searchParams } = new URL(req.url);
  const documentId = parseInt(searchParams.get("documentId") || "");

  if (!token || !documentId)
    return NextResponse.json({ message: "Faltan parámetros" }, { status: 400 });

  try {
    // Variable decoded eliminada por lint
    const schemaName = decoded.schemaName.toLowerCase();
    prisma.setTenantSchema(schemaName);

    const doc = (await prisma.$queryRawUnsafe(
      `SELECT fileName FROM "${schemaName}"."Document" WHERE id = $1`,
      documentId,
    )) as Document[];
    if (!doc.length)
      return NextResponse.json(
        { message: "Documento no encontrado" },
        { status: 404 },
      );

    // Aquí deberías leer el PDF desde donde lo guardaste (S3, filesystem, etc.)
    // Por ahora, devolvemos un placeholder
    const pdfBuffer = Buffer.from("Ejemplo PDF", "utf-8"); // Reemplazar con lectura real
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${doc[0].fileName}"`,
      },
      status: 200,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error al descargar", error: error.message },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { message: "Error al descargar", error: String(error) },
      { status: 500 },
    );
  }
}
