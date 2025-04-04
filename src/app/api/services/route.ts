import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const schema = `tenant_cj${String(authResult.user.complexId).padStart(4, '0')}`;
    const prisma = getPrisma(schema);

    const query = `
      SELECT * FROM "Service"
      WHERE "complexId" = $1
      ORDER BY "name" ASC
    `;

    const services = await prisma.$queryRawUnsafe(
      query,
      authResult.user.complexId
    );

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    return NextResponse.json(
      { error: 'Error al obtener los servicios' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();
    const schema = `tenant_cj${String(authResult.user.complexId).padStart(4, '0')}`;
    const prisma = getPrisma(schema);

    // Asegurar que complexId esté establecido correctamente
    data.complexId = authResult.user.complexId;

    const query = `
      INSERT INTO "Service" (
        "name", "description", "capacity", "startTime", "endTime",
        "rules", "status", "complexId", "cost", "createdAt"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const newService = await prisma.$queryRawUnsafe(
      query,
      data.name,
      data.description || '',
      data.capacity,
      data.startTime,
      data.endTime,
      data.rules || '',
      data.status,
      data.complexId,
      data.cost || 0,
      new Date()
    );

    return NextResponse.json(newService[0], { status: 201 });
  } catch (error) {
    console.error('Error al crear servicio:', error);
    return NextResponse.json(
      { error: 'Error al crear el servicio' },
      { status: 500 }
    );
  }
}
