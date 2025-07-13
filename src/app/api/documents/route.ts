import { NextRequest, NextResponse } from "next/server";
import { getTenantPrismaClient } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { ServerLogger } from "@/lib/logging/server-logger";
import { z } from "zod";

const DocumentSchema = z.object({
  title: z.string().min(1, "El título es requerido."),
  fileName: z.string().min(1, "El nombre del archivo es requerido."),
  fileType: z.string().min(1, "El tipo de archivo es requerido."),
  fileSize: z.number().min(0, "El tamaño del archivo debe ser positivo."),
  url: z.string().url("URL de archivo inválida."),
});

export async function GET(request: NextRequest) {
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

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    const documents = await tenantPrisma.document.findMany({
      where: { complexId: payload.complexId },
      orderBy: { uploadDate: "desc" },
    });

    ServerLogger.info(
      `Documentos listados para el complejo ${payload.complexId}`,
    );
    return NextResponse.json(documents, { status: 200 });
  } catch (error) {
    ServerLogger.error("Error al obtener documentos:", error);
    return NextResponse.json(
      { message: "Error al obtener documentos" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { auth, payload } = await verifyAuth(request);
    if (!auth || !payload) {
      return NextResponse.json({ message: "Token requerido" }, { status: 401 });
    }

    if (!["ADMIN", "COMPLEX_ADMIN"].includes(payload.role)) {
      return NextResponse.json(
        { message: "Permisos insuficientes" },
        { status: 403 },
      );
    }

    if (!payload.complexId || !payload.schemaName) {
      return NextResponse.json(
        { message: "Usuario sin complejo o esquema asociado" },
        { status: 400 },
      );
    }

    const body = await request.json(); // Assuming JSON body for now, file upload will be FormData
    const validatedData = DocumentSchema.parse(body);

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    const newDocument = await tenantPrisma.document.create({
      data: {
        ...validatedData,
        complexId: payload.complexId,
        uploadedBy: payload.id,
        uploadDate: new Date(),
      },
    });

    ServerLogger.info(
      `Documento creado: ${newDocument.title} en complejo ${payload.complexId}`,
    );
    return NextResponse.json(newDocument, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error("Error al crear documento:", error);
    return NextResponse.json(
      { message: "Error al crear documento" },
      { status: 500 },
    );
  }
}
