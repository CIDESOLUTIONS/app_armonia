import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth'; // Asumiendo que verifyToken es adecuado para rutas de API

const prisma = getPrisma();

/**
 * API para marcar un anuncio como leído
 * 
 * POST: Marca un anuncio específico como leído por el usuario actual
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar autenticación usando el token del encabezado
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'No autorizado: Token no proporcionado' }, { status: 401 });
    }

    const decoded = await verifyToken(token); // Decodificar y verificar el token
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'No autorizado: Token inválido o usuario no encontrado' }, { status: 401 });
    }

    const userId = decoded.userId;
    const { id } = params; // Obtener el ID del anuncio de los parámetros de la URL
    
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID de anuncio no válido' }, { status: 400 });
    }
    
    // Verificar si el anuncio existe
    const announcement = await prisma.announcement.findUnique({
      where: { id }
    });
    
    if (!announcement) {
      return NextResponse.json({ error: 'Anuncio no encontrado' }, { status: 404 });
    }
    
    // Verificar si ya está marcado como leído
    const existingRead = await prisma.announcementRead.findFirst({
      where: {
        announcementId: id,
        userId
      }
    });
    
    if (existingRead) {
      return NextResponse.json({ message: 'Anuncio ya marcado como leído' }, { status: 200 });
    }
    
    // Marcar como leído
    const read = await prisma.announcementRead.create({
      data: {
        announcementId: id,
        userId,
        readAt: new Date()
      }
    });
    
    return NextResponse.json({
      id: read.id,
      announcementId: read.announcementId,
      userId: read.userId,
      readAt: read.readAt
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error al marcar anuncio como leído:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
