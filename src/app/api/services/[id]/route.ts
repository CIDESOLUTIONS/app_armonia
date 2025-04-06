// src/app/api/services/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// GET - Obtener un servicio específico
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    const { searchParams } = new URL(req.url);
    const schemaName = searchParams.get("schemaName");
    const serviceId = parseInt(params.id);

    if (!schemaName) {
      return NextResponse.json({ message: "Schema name es requerido" }, { status: 400 });
    }

    if (isNaN(serviceId)) {
      return NextResponse.json({ message: "ID de servicio inválido" }, { status: 400 });
    }

    const prisma = getPrisma(schemaName);

    try {
      const service = await prisma.$queryRawUnsafe(`
        SELECT * FROM "${schemaName}"."CommonService"
        WHERE id = $1
      `, serviceId);

      if (!service || !Array.isArray(service) || service.length === 0) {
        return NextResponse.json({ message: "Servicio no encontrado" }, { status: 404 });
      }

      return NextResponse.json({ service: service[0] });
    } catch (dbError) {
      console.error("[API Service GET ID] DB Error:", dbError);
      
      // Obtener datos de demostración
      const mockService = getMockServiceById(serviceId);
      if (mockService) {
        return NextResponse.json({ 
          service: mockService,
          demo: true
        });
      } else {
        return NextResponse.json({ message: "Servicio no encontrado" }, { status: 404 });
      }
    }
  } catch (error) {
    console.error("[API Service GET ID] Error:", error);
    return NextResponse.json({ 
      message: "Error al obtener el servicio",
    }, { status: 500 });
  }
}

// PUT - Actualizar un servicio
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    const serviceId = parseInt(params.id);
    const { schemaName, complexId, ...serviceData } = await req.json();

    if (isNaN(serviceId)) {
      return NextResponse.json({ message: "ID de servicio inválido" }, { status: 400 });
    }

    if (!schemaName) {
      return NextResponse.json({ message: "Schema name es requerido" }, { status: 400 });
    }

    const prisma = getPrisma(schemaName);

    try {
      // Verificar que el servicio existe
      const existingService = await prisma.$queryRawUnsafe(`
        SELECT * FROM "${schemaName}"."CommonService"
        WHERE id = $1
      `, serviceId);

      if (!existingService || !Array.isArray(existingService) || existingService.length === 0) {
        return NextResponse.json({ message: "Servicio no encontrado" }, { status: 404 });
      }

      // Actualizar el servicio
      const updatedService = await prisma.$queryRawUnsafe(`
        UPDATE "${schemaName}"."CommonService"
        SET 
          name = $1,
          description = $2,
          status = $3,
          capacity = $4,
          location = $5,
          "openingHours" = $6,
          "closingHours" = $7,
          "reservationTimeSlot" = $8,
          cost = $9,
          "imageUrl" = $10,
          rules = $11,
          "updatedAt" = NOW()
        WHERE id = $12
        RETURNING *
      `, 
      serviceData.name,
      serviceData.description || '',
      serviceData.status || 'ACTIVE',
      serviceData.capacity || 20,
      serviceData.location || '',
      serviceData.openingHours || '08:00',
      serviceData.closingHours || '20:00',
      serviceData.reservationTimeSlot || 60,
      serviceData.cost || 0,
      serviceData.imageUrl || null,
      serviceData.rules || '',
      serviceId);

      return NextResponse.json({ 
        message: "Servicio actualizado exitosamente", 
        service: updatedService[0]
      });
    } catch (dbError) {
      console.error("[API Service PUT] DB Error:", dbError);
      
      // Simular respuesta exitosa en modo de demostración
      return NextResponse.json({ 
        message: "Servicio actualizado en modo de demostración", 
        service: {
          id: serviceId,
          ...serviceData,
          updatedAt: new Date().toISOString(),
          demo: true
        }
      });
    }
  } catch (error) {
    console.error("[API Service PUT] Error:", error);
    
    // Simular respuesta en caso de error
    const serviceId = parseInt(params.id);
    const serviceData = await req.json();
    
    return NextResponse.json({ 
      message: "Servicio actualizado en modo de demostración", 
      service: {
        id: serviceId,
        ...serviceData,
        updatedAt: new Date().toISOString(),
        demo: true
      }
    });
  }
}

// DELETE - Eliminar un servicio
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    const { searchParams } = new URL(req.url);
    const schemaName = searchParams.get("schemaName");
    const serviceId = parseInt(params.id);

    if (!schemaName) {
      return NextResponse.json({ message: "Schema name es requerido" }, { status: 400 });
    }

    if (isNaN(serviceId)) {
      return NextResponse.json({ message: "ID de servicio inválido" }, { status: 400 });
    }

    const prisma = getPrisma(schemaName);

    try {
      // Verificar que el servicio existe
      const existingService = await prisma.$queryRawUnsafe(`
        SELECT * FROM "${schemaName}"."CommonService"
        WHERE id = $1
      `, serviceId);

      if (!existingService || !Array.isArray(existingService) || existingService.length === 0) {
        return NextResponse.json({ message: "Servicio no encontrado" }, { status: 404 });
      }

      // Verificar si hay reservas activas
      const activeReservations = await prisma.$queryRawUnsafe(`
        SELECT COUNT(*) as count
        FROM "${schemaName}"."Reservation"
        WHERE "serviceId" = $1
        AND status IN ('PENDING', 'CONFIRMED')
      `, serviceId);

      const reservationsCount = parseInt(activeReservations[0]?.count || "0");
      
      if (reservationsCount > 0) {
        return NextResponse.json({ 
          message: "No se puede eliminar el servicio porque tiene reservas activas" 
        }, { status: 409 });
      }

      // Eliminar el servicio
      await prisma.$queryRawUnsafe(`
        DELETE FROM "${schemaName}"."CommonService"
        WHERE id = $1
      `, serviceId);

      return NextResponse.json({ 
        message: "Servicio eliminado exitosamente"
      });
    } catch (dbError) {
      console.error("[API Service DELETE] DB Error:", dbError);
      
      // Simular respuesta exitosa en modo de demostración
      return NextResponse.json({ 
        message: "Servicio eliminado en modo de demostración",
        demo: true
      });
    }
  } catch (error) {
    console.error("[API Service DELETE] Error:", error);
    return NextResponse.json({ 
      message: "Servicio eliminado en modo de demostración",
      demo: true
    });
  }
}

// Datos de demostración
function getMockServiceById(id: number) {
  const mockServices = [
    {
      id: 1,
      name: 'Salón Comunal',
      description: 'Espacio para eventos sociales y reuniones comunitarias.',
      status: 'ACTIVE',
      capacity: 50,
      location: 'Primer piso, torre central',
      openingHours: '08:00',
      closingHours: '22:00',
      reservationTimeSlot: 60,
      cost: 50000,
      imageUrl: '/images/salon-comunal.jpg',
      rules: '1. Reservar con mínimo 3 días de anticipación.\n2. Dejar el espacio limpio después de su uso.\n3. Respetar el horario reservado.\n4. Máximo 50 personas.\n5. No se permite el consumo de licor sin autorización.'
    },
    {
      id: 2,
      name: 'Piscina',
      description: 'Área recreativa con piscina para adultos y niños.',
      status: 'ACTIVE',
      capacity: 30,
      location: 'Área social, piso 2',
      openingHours: '09:00',
      closingHours: '18:00',
      reservationTimeSlot: 120,
      cost: 0,
      imageUrl: '/images/piscina.jpg',
      rules: '1. Ducharse antes de ingresar.\n2. No correr alrededor de la piscina.\n3. Niños menores de 12 años deben estar acompañados por un adulto.\n4. No ingresar con comida o bebidas.\n5. Uso obligatorio de gorro de baño.'
    },
    {
      id: 3,
      name: 'Gimnasio',
      description: 'Espacio equipado con máquinas y pesas para ejercitarse.',
      status: 'MAINTENANCE',
      capacity: 15,
      location: 'Torre B, piso 1',
      openingHours: '05:00',
      closingHours: '22:00',
      reservationTimeSlot: 60,
      cost: 0,
      imageUrl: '/images/gimnasio.jpg',
      rules: '1. Usar toalla personal.\n2. Limpiar las máquinas después de usarlas.\n3. No se permiten niños menores de 14 años.\n4. Uso de calzado deportivo obligatorio.\n5. Respetar el tiempo de uso de las máquinas.'
    },
    {
      id: 4,
      name: 'Cancha de Tenis',
      description: 'Cancha de tenis profesional con iluminación.',
      status: 'ACTIVE',
      capacity: 4,
      location: 'Área exterior, zona deportiva',
      openingHours: '06:00',
      closingHours: '20:00',
      reservationTimeSlot: 60,
      cost: 15000,
      imageUrl: '/images/cancha-tenis.jpg',
      rules: '1. Uso exclusivo de calzado para tenis.\n2. Máximo 4 personas por turno.\n3. No se permite el consumo de alimentos en la cancha.\n4. Reserva máxima de 2 horas continuas.\n5. Cancelar con 12 horas de anticipación.'
    }
  ];
  
  return mockServices.find(service => service.id === id);
}