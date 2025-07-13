import { NextRequest, NextResponse } from "next/server";
import { getTenantPrismaClient } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { ServerLogger } from "@/lib/logging/server-logger";
import { z } from "zod";
import { uploadFileToS3 } from "@/lib/storage/s3-upload";

const BrandingSettingsSchema = z.object({
  primaryColor: z.string().min(1, "El color principal es requerido."),
  secondaryColor: z.string().min(1, "El color secundario es requerido."),
  // logoUrl will be handled separately as it's a file upload
});

export async function GET(request: NextRequest) {
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

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);

    // Asumiendo que la configuración de branding se guarda en una tabla como BrandingSettings
    const brandingSettings = await tenantPrisma.brandingSettings.findUnique({
      where: { complexId: payload.complexId }, // Asumiendo que hay un complexId en la tabla
    });

    if (!brandingSettings) {
      return NextResponse.json(
        { message: "Configuración de marca no encontrada" },
        { status: 404 },
      );
    }

    ServerLogger.info(
      `Configuración de marca obtenida para el complejo ${payload.complexId}`,
    );
    return NextResponse.json(brandingSettings, { status: 200 });
  } catch (error) {
    ServerLogger.error("Error al obtener configuración de marca:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
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
    const primaryColor = formData.get("primaryColor") as string;
    const secondaryColor = formData.get("secondaryColor") as string;
    const logoFile = formData.get("logoFile") as File | null;

    const validatedData = BrandingSettingsSchema.parse({ primaryColor, secondaryColor });

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    let logoUrl: string | undefined;

    if (logoFile) {
      const fileName = `${payload.complexId}-${Date.now()}-${logoFile.name}`;
      const bucketName = process.env.AWS_S3_BUCKET_NAME;

      if (!bucketName) {
        ServerLogger.error("AWS_S3_BUCKET_NAME no está configurado.");
        return NextResponse.json(
          { message: "Error de configuración del servidor: Bucket S3 no especificado." },
          { status: 500 },
        );
      }

      try {
        logoUrl = await uploadFileToS3(logoFile, fileName, bucketName);
      } catch (uploadError: any) {
        ServerLogger.error(`Error al cargar el logo a S3: ${uploadError.message}`);
        return NextResponse.json(
          { message: "Error al cargar el logo.", details: uploadError.message },
          { status: 500 },
        );
      }
    }

    const updatedSettings = await tenantPrisma.brandingSettings.upsert({
      where: { complexId: payload.complexId },
      update: { ...validatedData, logoUrl },
      create: { ...validatedData, logoUrl, complexId: payload.complexId },
    });

    ServerLogger.info(
      `Configuración de marca actualizada para el complejo ${payload.complexId}`,
    );
    return NextResponse.json(updatedSettings, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error("Error al actualizar configuración de marca:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

