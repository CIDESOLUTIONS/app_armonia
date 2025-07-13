import { NextRequest, NextResponse } from "next/server";
import { getTenantPrismaClient } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { ServerLogger } from "@/lib/logging/server-logger";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    const documentId = parseInt(params.id);
    if (isNaN(documentId)) {
      return NextResponse.json({ message: "ID de documento inválido" }, { status: 400 });
    }

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    const document = await tenantPrisma.document.findUnique({
      where: { id: documentId, complexId: payload.complexId },
    });

    if (!document) {
      return NextResponse.json({ message: "Documento no encontrado" }, { status: 404 });
    }

    // TODO: Implement actual file serving from storage (e.g., S3, GCS)
    // For now, redirect to the stored URL or return a placeholder
    ServerLogger.info(
      `Documento ${document.title} (${document.id}) solicitado para descarga por ${payload.email} en complejo ${payload.complexId}`,
    );

    // Option 1: Redirect to the actual file URL (if stored externally)
    // return NextResponse.redirect(document.url);

    // Option 2: Return a placeholder response (if file serving is not implemented yet)
    return new NextResponse(`Simulando descarga de: ${document.title} desde ${document.url}`, {
      status: 200,
      headers: {
        'Content-Type': document.fileType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${document.fileName}"`, 
      },
    });

  } catch (error) {
    ServerLogger.error(`Error al obtener documento ${params.id}:`, error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}
