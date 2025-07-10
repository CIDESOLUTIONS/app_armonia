import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth'; // Asumiendo que verifyToken es adecuado para rutas de API
import { markNotificationAsRead } from '@/lib/communications/notification-service';

const prisma = getPrisma();

/**
 * API para marcar una notificación como leída
 * 
 * PUT: Marca una notificación específica como leída por el usuario actual
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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
    const { id } = params; // Obtener el ID de la notificación de los parámetros de la URL
    
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID de notificación no válido' }, { status: 400 });
    }
    
    // Marcar notificación como leída
    const notification = await markNotificationAsRead(id, userId);
    
    return NextResponse.json({
      id: notification.id,
      read: notification.read,
      readAt: notification.readAt
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    return NextResponse.json({ error: 'Error al marcar notificación como leída' }, { status: 500 });
  }
}
