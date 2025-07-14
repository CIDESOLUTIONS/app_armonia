import { NextResponse } from "next/server";
import { sendWhatsAppMessage } from "@/lib/communications/whatsapp-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, message } = body;

    if (!to || !message) {
      return NextResponse.json(
        { error: "El número de teléfono y el mensaje son requeridos." },
        { status: 400 },
      );
    }

    const result = await sendWhatsAppMessage({ to, message });

    if (result.success) {
      return NextResponse.json({
        message: "Mensaje de WhatsApp enviado con éxito.",
        data: result,
      });
    } else {
      return NextResponse.json(
        {
          error: "Error al enviar el mensaje de WhatsApp.",
          details: result.error,
        },
        { status: 500 },
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error en el servidor.", details: error.message },
      { status: 500 },
    );
  }
}
