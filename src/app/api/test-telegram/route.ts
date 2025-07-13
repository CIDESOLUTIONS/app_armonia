
import { NextResponse } from 'next/server';
import { sendTelegramMessage } from '@/lib/communications/telegram-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: 'El mensaje es requerido.' }, { status: 400 });
    }

    const result = await sendTelegramMessage(message);

    if (result.success) {
      return NextResponse.json({ message: 'Mensaje de Telegram enviado con éxito.', data: result });
    } else {
      return NextResponse.json({ error: 'Error al enviar el mensaje de Telegram.', details: result.error }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: 'Error en el servidor.', details: error.message }, { status: 500 });
  }
}
