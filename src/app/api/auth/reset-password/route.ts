import { NextRequest, NextResponse } from "next/server";
import { getPublicPrismaClient, getTenantPrismaClient } from "@/lib/prisma";
import { verifyPasswordResetToken } from "@/lib/auth";
import { ServerLogger } from "@/lib/logging/server-logger";
import { z } from "zod";
import bcrypt from "bcryptjs";

const ResetPasswordSchema = z.object({
  token: z.string().min(1, "El token es requerido."),
  newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres."),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword } = ResetPasswordSchema.parse(body);

    const decodedToken = await verifyPasswordResetToken(token);

    if (!decodedToken || !decodedToken.id || !decodedToken.email) {
      return NextResponse.json({ message: "Token inválido o expirado" }, { status: 400 });
    }

    const publicPrisma = getPublicPrismaClient();
    let prismaClient = publicPrisma; // Default to public prisma

    // If schemaName is present in the token, use the tenant-specific prisma client
    if (decodedToken.schemaName) {
      prismaClient = getTenantPrismaClient(decodedToken.schemaName);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prismaClient.user.update({
      where: { id: decodedToken.id, email: decodedToken.email },
      data: { password: hashedPassword },
    });

    ServerLogger.info(
      `Contraseña restablecida para el usuario ${updatedUser.email}`,
    );
    return NextResponse.json({ message: "Contraseña restablecida exitosamente" }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error("Error al restablecer contraseña:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}