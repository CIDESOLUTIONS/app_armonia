// src/app/api/assemblies/[assemblyId]/agenda/[agendaNumeral]/status/route.ts
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
import { updateVotingStatus } from '@/services/votingService';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
/**
 * PUT /api/assemblies/[assemblyId]/agenda/[agendaNumeral]/status
 * Actualiza el estado de votación de un punto específico de la agenda
 */
export function PUT(request_1, _a) {
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
            const { status } = yield request.json();
            if (!['pending', 'open', 'closed'].includes(status)) {
                return NextResponse.json({ error: 'Estado de votación inválido' }, { status: 400 });
            }
            const userId = session.user.id;
            const updatedAgendaItem = yield updateVotingStatus(assemblyId, agendaNumeral, status, userId);
            return NextResponse.json({ success: true, agendaItem: updatedAgendaItem });
        }
        catch (error) {
            console.error('Error al actualizar estado de votación:', error);
            return NextResponse.json({ error: error.message || 'Error al actualizar estado de votación' }, { status: 500 });
        }
    });
}
