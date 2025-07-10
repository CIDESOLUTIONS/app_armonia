import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth'; // Asumiendo que verifyToken es adecuado para rutas de API

const prisma = getPrisma();

/**
 * API para gestionar la asistencia a eventos del calendario comunitario
 * 
 * POST: Registra o actualiza la asistencia de un usuario a un evento
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar autenticación
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'No autorizado: Token no proporcionado' }, { status: 401 });
    }

    const decoded = await verifyToken(token); // Decodificar y verificar el token
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'No autorizado: Token inválido o usuario no encontrado' }, { status: 401 });
    }

    const userId = decoded.userId;
    const { id } = params; // Obtener el ID del evento de los parámetros de la URL
    const { status } = await req.json(); // Obtener el estado del cuerpo de la solicitud
    
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID de evento no válido' }, { status: 400 });
    }
    
    if (!status || !['attending', 'not_attending', 'maybe'].includes(status)) {
      return NextResponse.json({ error: 'Estado de asistencia no válido' }, { status: 400 });
    }
    
    // Verificar si el evento existe
    const event = await prisma.communityEvent.findUnique({
      where: { id },
      include: {
        attendees: {
          where: {
            status: 'attending'
          }
        }
      }
    });
    
    if (!event) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }
    
    // Verificar si el evento está lleno (solo para estado 'attending')
    if (status === 'attending' && event.maxAttendees !== null) {
      const currentAttendees = event.attendees.length;
      
      // Verificar si el usuario ya está registrado como asistente
      const isAlreadyAttending = event.attendees.some(a => a.userId === userId);
      
      if (currentAttendees >= event.maxAttendees && !isAlreadyAttending) {
        return NextResponse.json({ error: 'El evento está completo' }, { status: 400 });
      }
    }
    
    // Obtener nombre del usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true }
    });
    
    // Registrar o actualizar asistencia
    const attendance = await prisma.eventAttendee.upsert({
      where: {
        eventId_userId: {
          eventId: id,
          userId
        }
      },
      update: {
        status,
        updatedAt: new Date()
      },
      create: {
        eventId: id,
        userId,
        name: user?.name || 'Usuario',
        status
      }
    });
    
    return NextResponse.json({
      id: attendance.id,
      eventId: attendance.eventId,
      userId: attendance.userId,
      name: attendance.name,
      status: attendance.status,
      updatedAt: attendance.updatedAt
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error al registrar asistencia:', error);
    return NextResponse.json({ error: 'Error al registrar asistencia' }, { status: 500 });
  }
}
