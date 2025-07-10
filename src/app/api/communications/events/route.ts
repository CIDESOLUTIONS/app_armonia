import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth'; // Asumiendo que verifyToken es adecuado para rutas de API

const prisma = getPrisma();

/**
 * API para gestionar eventos del calendario comunitario
 */

/**
 * Obtiene eventos del calendario filtrados por fecha
 */
export async function GET(req: NextRequest) {
  try {
    // Verificar autenticación
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'No autorizado: Token no proporcionado' }, { status: 401 });
    }

    const decoded = await verifyToken(token); // Decodificar y verificar el token
    if (!decoded || !decoded.userId || !decoded.role) {
      return NextResponse.json({ error: 'No autorizado: Token inválido o usuario no encontrado' }, { status: 401 });
    }

    const userId = decoded.userId;
    const userRole = decoded.role;

    // Parámetros de filtrado
    const { searchParams } = req.nextUrl;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const type = searchParams.get('type');
    
    // Construir consulta base
    const queryOptions: any = {
      where: {},
      orderBy: {
        startDate: 'asc'
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true
          }
        },
        attendees: {
          select: {
            userId: true,
            name: true,
            status: true
          }
        }
      }
    };
    
    // Aplicar filtros de fecha
    if (startDate && endDate) {
      queryOptions.where.OR = [
        // Eventos que comienzan en el rango
        {
          startDate: {
            gte: new Date(startDate as string),
            lte: new Date(endDate as string)
          }
        },
        // Eventos que terminan en el rango
        {
          endDate: {
            gte: new Date(startDate as string),
            lte: new Date(endDate as string)
          }
        },
        // Eventos que abarcan todo el rango
        {
          AND: [
            {
              startDate: {
                lte: new Date(startDate as string)
              }
            },
            {
              endDate: {
                gte: new Date(endDate as string)
              }
            }
          ]
        }
      ];
    }
    
    // Filtrar por tipo si se especifica
    if (type) {
      queryOptions.where.type = type;
    }
    
    // Obtener eventos según el rol del usuario
    let events;
    
    if (userRole === 'admin' || userRole === 'super_admin') {
      // Los administradores ven todos los eventos
      events = await prisma.communityEvent.findMany(queryOptions);
    } else {
      // Los demás usuarios ven eventos públicos o dirigidos a su rol
      queryOptions.where.OR = [
        ...(queryOptions.where.OR || []),
        { visibility: 'public' },
        { targetRoles: { has: userRole } }
      ];
      
      events = await prisma.communityEvent.findMany(queryOptions);
    }
    
    // Formatear respuesta
    const formattedEvents = events.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      type: event.type,
      createdBy: event.createdBy,
      attendees: event.attendees,
      maxAttendees: event.maxAttendees
    }));
    
    return NextResponse.json(formattedEvents, { status: 200 });
    
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    return NextResponse.json({ error: 'Error al obtener eventos' }, { status: 500 });
  }
}

/**
 * Crea un nuevo evento (solo administradores)
 */
export async function POST(req: NextRequest) {
  try {
    // Verificar autenticación
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'No autorizado: Token no proporcionado' }, { status: 401 });
    }

    const decoded = await verifyToken(token); // Decodificar y verificar el token
    if (!decoded || !decoded.userId || !decoded.role) {
      return NextResponse.json({ error: 'No autorizado: Token inválido o usuario no encontrado' }, { status: 401 });
    }

    const userId = decoded.userId;
    const userRole = decoded.role;

    // Verificar permisos
    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json({ error: 'No tiene permisos para crear eventos' }, { status: 403 });
    }
    
    const body = await req.json();
    const {
      title,
      description,
      startDate,
      endDate,
      location,
      type = 'other',
      visibility = 'public',
      targetRoles = [],
      maxAttendees
    } = body;
    
    // Validar datos requeridos
    if (!title || !description || !startDate || !endDate || !location) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }
    
    // Validar fechas
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json({ error: 'Formato de fecha inválido' }, { status: 400 });
    }
    
    if (start > end) {
      return NextResponse.json({ error: 'La fecha de inicio debe ser anterior a la fecha de fin' }, { status: 400 });
    }
    
    // Crear evento en la base de datos
    const event = await prisma.communityEvent.create({
      data: {
        title,
        description,
        startDate: start,
        endDate: end,
        location,
        type,
        visibility,
        targetRoles,
        maxAttendees: maxAttendees ? Number(maxAttendees) : null,
        createdById: userId
      }
    });
    
    // Emitir evento de nuevo evento a través de WebSockets
    // (Esto se maneja en un middleware separado)
    
    return NextResponse.json({
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      type: event.type,
      maxAttendees: event.maxAttendees
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error al crear evento:', error);
    return NextResponse.json({ error: 'Error al crear evento' }, { status: 500 });
  }
}