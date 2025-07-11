var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/app/api/assemblies/quorum/route.ts
import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
const prisma = getPrisma();
export function GET(req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
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
            if (!assemblyId || typeof assemblyId !== 'string') {
                return NextResponse.json({ message: 'ID de asamblea requerido' }, { status: 400 });
            }
            // Obtener datos de la asamblea
            const assembly = yield prisma.assembly.findUnique({
                where: { id: parseInt(assemblyId) },
                include: {
                    attendees: true,
                },
            });
            if (!assembly) {
                return NextResponse.json({ message: 'Asamblea no encontrada' }, { status: 404 });
            }
            // Obtener total de unidades elegibles para votar
            const totalEligible = yield prisma.resident.count({
                where: {
                    isActive: true,
                    residentType: 'OWNER', // Solo propietarios pueden votar
                },
            });
            // Calcular estadísticas de quórum
            const confirmedAttendees = assembly.attendees.length;
            const quorumPercentage = assembly.quorumPercentage || 50; // Valor por defecto si no está definido
            const currentPercentage = (confirmedAttendees / totalEligible) * 100;
            const quorumReached = currentPercentage >= quorumPercentage;
            return NextResponse.json({
                confirmedAttendees,
                totalEligible,
                quorumReached,
                quorumPercentage,
                currentPercentage,
            }, { status: 200 });
        }
        catch (error) {
            console.error('Error en API de quórum:', error);
            return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
        }
    });
}
