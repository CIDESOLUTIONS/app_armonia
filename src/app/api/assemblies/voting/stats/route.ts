// src/app/api/assemblies/voting/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

const prisma = getPrisma();

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticación
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const decoded = await verifyToken(token); // Asumiendo que verifyToken devuelve el payload decodificado o null
    if (!decoded) {
      return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const assemblyId = searchParams.get('assemblyId');
    const agendaNumeral = searchParams.get('agendaNumeral');
    
    if (!assemblyId || typeof assemblyId !== 'string' || !agendaNumeral || typeof agendaNumeral !== 'string') {
      return NextResponse.json({ message: 'ID de asamblea y numeral de agenda requeridos' }, { status: 400 });
    }

    // Obtener votos para este punto de la agenda
    const votes = await prisma.vote.findMany({
      where: {
        assemblyId: parseInt(assemblyId),
        agendaNumeral: parseInt(agendaNumeral),
      },
    });

    // Obtener estado de la votación
    const votingStatus = await prisma.votingStatus.findFirst({
      where: {
        assemblyId: parseInt(assemblyId),
        agendaNumeral: parseInt(agendaNumeral),
      },
    });

    // Calcular estadísticas
    const totalVotes = votes.length;
    const yesVotes = votes.filter(v => v.vote === 'YES').length;
    const noVotes = votes.filter(v => v.vote === 'NO').length;
    
    const yesPercentage = totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 0;
    const noPercentage = totalVotes > 0 ? Math.round((noVotes / totalVotes) * 100) : 0;

    return NextResponse.json({
      totalVotes,
      yesVotes,
      noVotes,
      yesPercentage,
      noPercentage,
      isOpen: votingStatus?.isOpen ?? true,
      endTime: votingStatus?.endTime ?? null,
    }, { status: 200 });
  } catch (error) {
    console.error('Error en API de estadísticas de votación:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
