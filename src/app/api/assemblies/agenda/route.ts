import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  const { searchParams } = new URL(req.url);
  const assemblyId = parseInt(searchParams.get('assemblyId') || '');

  if (!token || !assemblyId) return NextResponse.json({ message: 'Faltan parámetros' }, { status: 400 });

  try {
    const decoded = verify(token, JWT_SECRET) as { schemaName: string };
    const schemaName = decoded.schemaName.toLowerCase();
    prisma.setTenantSchema(schemaName);

    const agenda = await prisma.$queryRawUnsafe(
      `SELECT * FROM "${schemaName}"."AgendaItem" WHERE "assemblyId" = $1`,
      assemblyId
    );
    return NextResponse.json({ agenda }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error al obtener agenda', error: String(error) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get('id') || '');
  const { notes, completed } = await req.json();

  if (!token || !id) return NextResponse.json({ message: 'Faltan parámetros' }, { status: 400 });

  try {
    const decoded = verify(token, JWT_SECRET) as { schemaName: string };
    const schemaName = decoded.schemaName.toLowerCase();
    prisma.setTenantSchema(schemaName);

    await prisma.$queryRawUnsafe(
      `UPDATE "${schemaName}"."AgendaItem" SET notes = $1, completed = $2 WHERE id = $3`,
      notes, completed, id
    );
    return NextResponse.json({ message: 'Agenda actualizada' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error al actualizar agenda', error: String(error) }, { status: 500 });
  }
}