import { NextRequest, NextResponse } from "next/server";
import { getTenantPrismaClient } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { ServerLogger } from "@/lib/logging/server-logger";
import { z } from "zod";

const SendMessageSchema = z.object({
  recipient: z.string().min(1, "El destinatario es requerido."),
  messageContent: z.string().min(1, "El contenido del mensaje es requerido."),
});

export async function POST(request: NextRequest) {
  try {
    const { auth, payload } = await verifyAuth(request);
    if (!auth || !payload) {
      return NextResponse.json({ message: "Token requerido" }, { status: 401 });
    }

    if (!["ADMIN", "COMPLEX_ADMIN", "STAFF"].includes(payload.role)) {
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

    const body = await request.json();
    const validatedData = SendMessageSchema.parse(body);

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);

    // TODO: Implement actual message sending logic here
    // This would involve integrating with Twilio, Telegram, etc.
    // For now, just log the message.

    ServerLogger.info(
      `Mensaje simulado enviado a ${validatedData.recipient} desde ${payload.email} en complejo ${payload.complexId}: ${validatedData.messageContent}`,
    );

    // Save message to database (e.g., a MessageLog table)
    // await tenantPrisma.messageLog.create({
    //   data: {
    //     senderId: payload.id,
    //     recipient: validatedData.recipient,
    //     content: validatedData.messageContent,
    //     complexId: payload.complexId,
    //     status: "SENT",
    //   },
    // });

    return NextResponse.json(
      { message: "Mensaje enviado correctamente (simulado)" },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error("Error al enviar mensaje:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
