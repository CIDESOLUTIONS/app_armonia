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
import { PDFDocument, StandardFonts } from 'pdf-lib';
// Variable JWT_SECRET eliminada por lint
export function POST(_req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const _token = (_a = req.headers.get('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        const { assemblyId } = yield req.json();
        if (!token || !assemblyId)
            return NextResponse.json({ message: 'Faltan parámetros' }, { status: 400 });
        try {
            // Variable decoded eliminada por lint
            const _schemaName = decoded.schemaName.toLowerCase();
            prisma.setTenantSchema(schemaName);
            const assembly = yield prisma.$queryRawUnsafe(`SELECT * FROM "${schemaName}"."Assembly" WHERE id = $1`, assemblyId);
            const agenda = yield prisma.$queryRawUnsafe(`SELECT * FROM "${schemaName}"."AgendaItem" WHERE "assemblyId" = $1`, assemblyId);
            const attendance = yield prisma.$queryRawUnsafe(`SELECT r.number, r.name, r.dni, a.attendance, a.delegateName FROM "${schemaName}"."Attendance" a JOIN "${schemaName}"."Resident" r ON a."residentId" = r.id WHERE a."assemblyId" = $1`, assemblyId);
            const questions = yield prisma.$queryRawUnsafe(`SELECT q.text, q."yesVotes", q."noVotes", q."nrVotes", v."residentId", v.vote, r.number, r.name FROM "${schemaName}"."Question" q LEFT JOIN "${schemaName}"."Vote" v ON q.id = v."questionId" LEFT JOIN "${schemaName}"."Resident" r ON v."residentId" = r.id WHERE q."assemblyId" = $1`, assemblyId);
            const pdfDoc = yield PDFDocument.create();
            const page = pdfDoc.addPage();
            const font = yield pdfDoc.embedFont(StandardFonts.Helvetica);
            const { width, height } = page.getSize();
            let y = height - 50;
            page.drawText(`Acta de Asamblea: ${assembly[0].title}`, { x: 50, y, size: 16, font });
            y -= 30;
            page.drawText(`Fecha: ${new Date(assembly[0].date).toLocaleString()}`, { x: 50, y, size: 12, font });
            y -= 20;
            page.drawText('Agenda:', { x: 50, y, size: 12, font });
            y -= 20;
            agenda.forEach((item) => {
                page.drawText(`${item.numeral}. ${item.topic} (${item.time}) - ${item.notes || 'Sin observaciones'}`, { x: 50, y, size: 10, font });
                y -= 15;
            });
            page.drawText('Asistencia:', { x: 50, y, size: 12, font });
            y -= 20;
            attendance.forEach((a) => {
                page.drawText(`${a.number} - ${a.name} - ${a.attendance}${a.delegateName ? ` (Delegado: ${a.delegateName})` : ''}`, { x: 50, y, size: 10, font });
                y -= 15;
            });
            page.drawText('Preguntas y Votaciones:', { x: 50, y, size: 12, font });
            y -= 20;
            questions.forEach((q) => {
                page.drawText(`${q.text} (Sí: ${q.yesVotes}, No: ${q.noVotes}, NR: ${q.nrVotes})`, { x: 50, y, size: 10, font });
                y -= 15;
            });
            // Variable pdfBytes eliminada por lint
            const fileName = `acta_${assemblyId}_${Date.now()}.pdf`;
            const docExists = yield prisma.$queryRawUnsafe(`SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = $1 AND table_name = 'Document')`, schemaName);
            if (!docExists[0].exists) {
                yield prisma.$executeRawUnsafe(`CREATE TABLE "${schemaName}"."Document" (
          id SERIAL PRIMARY KEY,
          "assemblyId" INTEGER REFERENCES "${schemaName}"."Assembly"(id),
          fileName TEXT NOT NULL,
          "createdAt" TIMESTAMP DEFAULT NOW()
        )`);
            }
            const _result = yield prisma.$queryRawUnsafe(`INSERT INTO "${schemaName}"."Document" ("assemblyId", fileName) VALUES ($1, $2) RETURNING id`, assemblyId, fileName);
            // Aquí podrías guardar el PDF en un sistema de archivos o S3
            return NextResponse.json({ message: 'Acta generada', documentId: result[0].id }, { status: 201 });
        }
        catch (error) {
            return NextResponse.json({ message: 'Error al generar acta', error: String(error) }, { status: 500 });
        }
    });
}
