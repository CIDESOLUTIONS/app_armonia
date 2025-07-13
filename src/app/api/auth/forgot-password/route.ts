import { NextRequest, NextResponse } from "next/server";
import { getPublicPrismaClient } from "@/lib/prisma";
import { generatePasswordResetToken } from "@/lib/auth";
import { ServerLogger } from "@/lib/logging/server-logger";
import { z } from "zod";

const RequestPasswordResetSchema = z.object({
  email: z.string().email("Formato de email inválido"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = RequestPasswordResetSchema.parse(body);

    const publicPrisma = getPublicPrismaClient();
    const user = await publicPrisma.user.findUnique({ where: { email } });

    if (!user) {
      // No revelar si el usuario existe o no por razones de seguridad
      ServerLogger.warn(`Intento de restablecimiento de contraseña para email no registrado: ${email}`);
      return NextResponse.json(
        { message: "Si su correo electrónico está registrado, recibirá un enlace para restablecer su contraseña." },
        { status: 200 },
      );
    }

    const token = await generatePasswordResetToken(user.id, user.email, user.schemaName || undefined);

    // TODO: Implement email sending logic here
    // This would involve using a transactional email service (e.g., SendGrid, Nodemailer)
    ServerLogger.info(`Enlace de restablecimiento de contraseña generado para ${email}: ${token}`);

    return NextResponse.json(
      { message: "Si su correo electrónico está registrado, recibirá un enlace para restablecer su contraseña." },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error("Error al solicitar restablecimiento de contraseña:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}