var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/app/api/assemblies/voting/stats/route.ts
import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
const prisma = getPrisma();
export function GET(req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            // Verificar autenticación
            const token = (_a = req.headers.get('authorization')) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (!token) {
                return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
            }
            const decoded = yield verifyToken(token); // Asumiendo que verifyToken devuelve el payload decodificado o null
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
            const votes = yield prisma.vote.findMany({
                where: {
                    assemblyId: parseInt(assemblyId),
                    agendaNumeral: parseInt(agendaNumeral),
                },
            });
            // Obtener estado de la votación
            const votingStatus = yield prisma.votingStatus.findFirst({
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
                isOpen: (_b = votingStatus === null || votingStatus === void 0 ? void 0 : votingStatus.isOpen) !== null && _b !== void 0 ? _b : true,
                endTime: (_c = votingStatus === null || votingStatus === void 0 ? void 0 : votingStatus.endTime) !== null && _c !== void 0 ? _c : null,
            }, { status: 200 });
        }
        catch (error) {
            console.error('Error en API de estadísticas de votación:', error);
            return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
        }
    });
}
