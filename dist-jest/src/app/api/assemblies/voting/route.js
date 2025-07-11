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
import { verifyToken } from '@/lib/auth';
import { validateRequest } from '@/lib/validation';
import { GetVotingQuestionsSchema, CreateVotingQuestionSchema } from '@/validators/assemblies/voting.validator';
export function GET(req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.headers.get('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        const { searchParams } = new URL(req.url);
        const queryParams = {
            assemblyId: searchParams.get('assemblyId')
        };
        // Validar parámetros
        const validation = validateRequest(GetVotingQuestionsSchema, queryParams);
        if (!validation.success) {
            return validation.response;
        }
        const validatedParams = validation.data;
        const assemblyId = parseInt(validatedParams.assemblyId);
        if (!token)
            return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
        try {
            const decoded = yield verifyToken(token);
            const schemaName = decoded.schemaName.toLowerCase();
            prisma.setTenantSchema(schemaName);
            const questions = yield prisma.$queryRawUnsafe(`SELECT * FROM "${schemaName}"."Question" WHERE "assemblyId" = $1`, assemblyId);
            return NextResponse.json({ questions }, { status: 200 });
        }
        catch (error) {
            return NextResponse.json({ message: 'Error al obtener preguntas', error: String(error) }, { status: 500 });
        }
    });
}
export function POST(req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.headers.get('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token)
            return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
        try {
            const body = yield req.json();
            // Validar datos
            const validation = validateRequest(CreateVotingQuestionSchema, body);
            if (!validation.success) {
                return validation.response;
            }
            const validatedData = validation.data;
            const decoded = yield verifyToken(token);
            const schemaName = decoded.schemaName.toLowerCase();
            prisma.setTenantSchema(schemaName);
            const questionExists = yield prisma.$queryRawUnsafe(`SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = $1 AND table_name = 'Question')`, schemaName);
            if (!questionExists[0].exists) {
                yield prisma.$executeRawUnsafe(`CREATE TABLE "${schemaName}"."Question" (
          id SERIAL PRIMARY KEY,
          "assemblyId" INTEGER REFERENCES "${schemaName}"."Assembly"(id),
          text TEXT NOT NULL,
          "yesVotes" INTEGER DEFAULT 0,
          "noVotes" INTEGER DEFAULT 0,
          "nrVotes" INTEGER DEFAULT 0,
          "isOpen" BOOLEAN DEFAULT false,
          "votingEndTime" TIMESTAMP,
          "options" JSONB
        )`);
            }
            // Preparar datos adicionales si existen
            const options = validatedData.options ? JSON.stringify(validatedData.options) : null;
            const votingEndTime = validatedData.votingTime ?
                new Date(Date.now() + validatedData.votingTime * 60000).toISOString() :
                null;
            const result = yield prisma.$queryRawUnsafe(`INSERT INTO "${schemaName}"."Question" ("assemblyId", text, options, "votingEndTime") 
       VALUES ($1, $2, $3, $4) RETURNING id`, validatedData.assemblyId, validatedData.text, options, votingEndTime);
            return NextResponse.json({ questionId: result[0].id }, { status: 201 });
        }
        catch (error) {
            return NextResponse.json({ message: 'Error al agregar pregunta', error: String(error) }, { status: 500 });
        }
    });
}
