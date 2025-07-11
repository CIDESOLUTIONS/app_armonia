// src/app/api/assemblies/[assemblyId]/agenda/[agendaNumeral]/votes/route.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { NextResponse } from 'next/server';
import { getVotingStats, submitVote } from '@/services/votingService';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
/**
 * GET /api/assemblies/[assemblyId]/agenda/[agendaNumeral]/votes
 * Obtiene estadísticas de votación para un punto específico de la agenda
 */
export function GET(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        try {
            const assemblyId = parseInt(params.assemblyId);
            const agendaNumeral = parseInt(params.agendaNumeral);
            if (isNaN(assemblyId) || isNaN(agendaNumeral)) {
                return NextResponse.json({ error: 'ID de asamblea o numeral de agenda inválido' }, { status: 400 });
            }
            const stats = yield getVotingStats(assemblyId, agendaNumeral);
            return NextResponse.json(stats);
        }
        catch (error) {
            console.error('Error al obtener estadísticas de votación:', error);
            return NextResponse.json({ error: error.message || 'Error al obtener estadísticas de votación' }, { status: 500 });
        }
    });
}
/**
 * POST /api/assemblies/[assemblyId]/agenda/[agendaNumeral]/votes
 * Registra un voto de usuario para un punto específico de la agenda
 */
export function POST(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        try {
            const session = yield getServerSession(authOptions);
            if (!session || !session.user) {
                return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
            }
            const assemblyId = parseInt(params.assemblyId);
            const agendaNumeral = parseInt(params.agendaNumeral);
            if (isNaN(assemblyId) || isNaN(agendaNumeral)) {
                return NextResponse.json({ error: 'ID de asamblea o numeral de agenda inválido' }, { status: 400 });
            }
            const { value } = yield request.json();
            if (value !== 'YES' && value !== 'NO') {
                return NextResponse.json({ error: 'Valor de voto inválido' }, { status: 400 });
            }
            const userId = session.user.id;
            const vote = yield submitVote(assemblyId, agendaNumeral, userId, value);
            return NextResponse.json({ success: true, vote });
        }
        catch (error) {
            console.error('Error al enviar voto:', error);
            return NextResponse.json({ error: error.message || 'Error al enviar voto' }, { status: 500 });
        }
    });
}
