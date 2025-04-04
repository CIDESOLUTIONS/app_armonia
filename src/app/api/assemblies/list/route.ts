// src/app/api/assemblies/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json({ message: 'No token provided' }, { status: 401 });
  }

  try {
    const decoded = verify(token, JWT_SECRET) as { id: number; complexId: number; schemaName: string; role: string };
    console.log('[API Assemblies List] Token decodificado:', decoded);

    const schemaName = decoded.schemaName.toLowerCase();
    await prisma.$disconnect();
    await prisma.$connect();
    prisma.setTenantSchema(schemaName);

    const assemblies = await prisma.$queryRawUnsafe(
      `SELECT * FROM "${schemaName}"."Assembly" WHERE "complexId" = $1 ORDER BY "createdAt" DESC`,
      decoded.complexId
    ) as any[];

    console.log('[API Assemblies List] Asambleas encontradas:', assemblies);
    return NextResponse.json({ assemblies }, { status: 200 });
  } catch (error) {
    console.error('[API Assemblies List] Error detallado:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
    }
    return NextResponse.json(
      { message: 'Error al obtener las asambleas', error: String(error) },
      { status: 500 }
    );
  }
}