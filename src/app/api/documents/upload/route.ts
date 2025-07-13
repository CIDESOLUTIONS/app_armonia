
import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { getTenantPrismaClient } from "@/lib/prisma";
import { ServerLogger } from "@/lib/logging/server-logger";
import { uploadFileToS3 } from "@/lib/storage/s3-upload";

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

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const file = formData.get("file") as File;

    if (!name || !file) {
      return NextResponse.json(
        { message: "Nombre y archivo son requeridos." },
        { status: 400 },
      );
    }

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!bucketName) {
      ServerLogger.error("AWS_S3_BUCKET_NAME no está configurado.");
      return NextResponse.json(
        { message: "Error de configuración del servidor: Bucket S3 no especificado." },
        { status: 500 },
      );
    }

    const fileName = `${payload.complexId}-${Date.now()}-${file.name}`;
    let fileUrl: string;

    try {
      fileUrl = await uploadFileToS3(file, fileName, bucketName);
    } catch (uploadError: any) {
      ServerLogger.error(`Error al cargar el archivo a S3: ${uploadError.message}`);
      return NextResponse.json(
        { message: "Error al cargar el archivo.", details: uploadError.message },
        { status: 500 },
      );
    }

    const newDocument = await tenantPrisma.document.create({
      data: {
        title: name,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        url: fileUrl,
        complexId: payload.complexId,
        uploadedById: payload.userId,
      },
    });

    ServerLogger.info(
      `Documento ${newDocument.title} subido para el complejo ${payload.complexId}`,
    );
    return NextResponse.json(newDocument, { status: 201 });
  } catch (error: any) {
    ServerLogger.error("Error al subir documento:", error);
    return NextResponse.json(
      { message: "Error interno del servidor", details: error.message },
      { status: 500 },
    );
  }
}
