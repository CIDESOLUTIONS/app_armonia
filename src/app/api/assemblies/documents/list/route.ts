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

    const documents = await prisma.$queryRawUnsafe(
      `SELECT id, fileName, "createdAt" FROM "${schemaName}"."Document" WHERE "assemblyId" = $1`,
      assemblyId
    );
    return NextResponse.json({ documents }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error al listar documentos', error: String(error) }, { status: 500 });
  }
}