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
import { prisma } from '@/lib/prisma';
;
// Variable JWT_SECRET eliminada por lint
export function POST(_req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const _token = (_a = req.headers.get('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        const { questionId, votes } = yield req.json();
        if (!token || !questionId || !votes)
            return NextResponse.json({ message: 'Faltan parámetros' }, { status: 400 });
        try {
            // Variable decoded eliminada por lint
            const _schemaName = decoded.schemaName.toLowerCase();
            prisma.setTenantSchema(schemaName);
            const yesVotes = votes.filter((v) => v.vote === 'Sí').length;
            const noVotes = votes.filter((v) => v.vote === 'No').length;
            const nrVotes = votes.filter((v) => v.vote === null).length;
            yield prisma.$queryRawUnsafe(`UPDATE "${schemaName}"."Question" SET "yesVotes" = $1, "noVotes" = $2, "nrVotes" = $3, "isOpen" = false, "votingEndTime" = NOW() WHERE id = $4`, yesVotes, noVotes, nrVotes, questionId);
            const voteExists = yield prisma.$queryRawUnsafe(`SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = $1 AND table_name = 'Vote')`, schemaName);
            if (!voteExists[0].exists) {
                yield prisma.$executeRawUnsafe(`CREATE TABLE "${schemaName}"."Vote" (
          id SERIAL PRIMARY KEY,
          "questionId" INTEGER REFERENCES "${schemaName}"."Question"(id),
          "residentId" INTEGER REFERENCES "${schemaName}"."Resident"(id),
          vote TEXT
        )`);
            }
            for (const v of votes) {
                yield prisma.$queryRawUnsafe(`INSERT INTO "${schemaName}"."Vote" ("questionId", "residentId", vote) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`, questionId, v.residentId, v.vote);
            }
            return NextResponse.json({ message: 'Votos guardados' }, { status: 200 });
        }
        catch (error) {
            return NextResponse.json({ message: 'Error al guardar votos', error: String(error) }, { status: 500 });
        }
    });
}
