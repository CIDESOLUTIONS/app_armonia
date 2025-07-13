import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { getTenantPrismaClient } from "@/lib/prisma";
import { ServerLogger } from "@/lib/logging/server-logger";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
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

    const documentId = parseInt(params.id);
    if (isNaN(documentId)) {
      return NextResponse.json(
        { message: "ID de documento inválido." },
        { status: 400 },
      );
    }

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);

    const document = await tenantPrisma.document.findUnique({
      where: { id: documentId, complexId: payload.complexId },
    });

    if (!document) {
      return NextResponse.json(
        { message: "Documento no encontrado." },
        { status: 404 },
      );
    }

    // Eliminar de S3
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    if (!bucketName) {
      ServerLogger.error("AWS_S3_BUCKET_NAME no está configurado.");
      return NextResponse.json(
        { message: "Error de configuración del servidor: Bucket S3 no especificado." },
        { status: 500 },
      );
    }

    const fileKey = document.url.split("/").pop(); // Extraer el nombre del archivo de la URL
    if (fileKey) {
      try {
        const command = new DeleteObjectCommand({
          Bucket: bucketName,
          Key: fileKey,
        });
        await s3Client.send(command);
        ServerLogger.info(`Archivo ${fileKey} eliminado de S3.`);
      } catch (s3Error: any) {
        ServerLogger.error(`Error al eliminar el archivo de S3: ${s3Error.message}`);
        // Continuar con la eliminación de la base de datos aunque falle S3
      }
    }

    // Eliminar de la base de datos
    await tenantPrisma.document.delete({
      where: { id: documentId },
    });

    ServerLogger.info(
      `Documento ${document.title} eliminado para el complejo ${payload.complexId}`,
    );
    return NextResponse.json({ message: "Documento eliminado correctamente." }, { status: 200 });
  } catch (error: any) {
    ServerLogger.error("Error al eliminar documento:", error);
    return NextResponse.json(
      { message: "Error interno del servidor", details: error.message },
      { status: 500 },
    );
  }
}