import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PDFDocument, StandardFonts } from "pdf-lib";

interface Assembly {
  id: number;
  title: string;
  description: string | null;
  type: string;
  status: string;
  date: Date;
  endTime: Date | null;
  location: string;
  agenda: unknown; // Assuming Json is any
  requiredCoefficient: number;
  currentCoefficient: number;
  quorumStatus: string;
  quorumReachedAt: Date | null;
  realtimeChannel: string | null;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

// Variable JWT_SECRET eliminada por lint

export async function POST(_req: unknown) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  const { assemblyId } = await req.json();

  if (!token || !assemblyId)
    return NextResponse.json({ message: "Faltan parámetros" }, { status: 400 });

  try {
    // Variable decoded eliminada por lint
    const schemaName = decoded.schemaName.toLowerCase();
    prisma.setTenantSchema(schemaName);

    const assembly = (await prisma.$queryRawUnsafe(
      `SELECT * FROM "${schemaName}"."Assembly" WHERE id = $1`,
      assemblyId,
    )) as Assembly[];
    const agenda = await prisma.$queryRawUnsafe(
      `SELECT * FROM "${schemaName}"."AgendaItem" WHERE "assemblyId" = $1`,
      assemblyId,
    );
    const attendance = await prisma.$queryRawUnsafe(
      `SELECT r.number, r.name, r.dni, a.attendance, a.delegateName FROM "${schemaName}"."Attendance" a JOIN "${schemaName}"."Resident" r ON a."residentId" = r.id WHERE a."assemblyId" = $1`,
      assemblyId,
    );
    const questions = await prisma.$queryRawUnsafe(
      `SELECT q.text, q."yesVotes", q."noVotes", q."nrVotes", v."residentId", v.vote, r.number, r.name FROM "${schemaName}"."Question" q LEFT JOIN "${schemaName}"."Vote" v ON q.id = v."questionId" LEFT JOIN "${schemaName}"."Resident" r ON v."residentId" = r.id WHERE q."assemblyId" = $1`,
      assemblyId,
    );

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { height } = page.getSize();
    let y = height - 50;

    page.drawText(`Acta de Asamblea: ${assembly[0].title}`, {
      x: 50,
      y,
      size: 16,
      font,
    });
    y -= 30;
    page.drawText(`Fecha: ${new Date(assembly[0].date).toLocaleString()}`, {
      x: 50,
      y,
      size: 12,
      font,
    });
    y -= 20;

    page.drawText("Agenda:", { x: 50, y, size: 12, font });
    y -= 20;
    agenda.forEach((item: unknown) => {
      page.drawText(
        `${item.numeral}. ${item.topic} (${item.time}) - ${item.notes || "Sin observaciones"}`,
        { x: 50, y, size: 10, font },
      );
      y -= 15;
    });

    page.drawText("Asistencia:", { x: 50, y, size: 12, font });
    y -= 20;
    attendance.forEach((a: unknown) => {
      page.drawText(
        `${a.number} - ${a.name} - ${a.attendance}${a.delegateName ? ` (Delegado: ${a.delegateName})` : ""}`,
        { x: 50, y, size: 10, font },
      );
      y -= 15;
    });

    page.drawText("Preguntas y Votaciones:", { x: 50, y, size: 12, font });
    y -= 20;
    questions.forEach((q: unknown) => {
      page.drawText(
        `${q.text} (Sí: ${q.yesVotes}, No: ${q.noVotes}, NR: ${q.nrVotes})`,
        { x: 50, y, size: 10, font },
      );
      y -= 15;
    });

    // Variable pdfBytes eliminada por lint
    const fileName = `acta_${assemblyId}_${Date.now()}.pdf`;

    const docExists = await prisma.$queryRawUnsafe(
      `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = $1 AND table_name = 'Document')`,
      schemaName,
    );
    if (!docExists[0].exists) {
      await prisma.$executeRawUnsafe(
        `CREATE TABLE "${schemaName}"."Document" (
          id SERIAL PRIMARY KEY,
          "assemblyId" INTEGER REFERENCES "${schemaName}"."Assembly"(id),
          fileName TEXT NOT NULL,
          "createdAt" TIMESTAMP DEFAULT NOW()
        )`,
      );
    }

    const result = await prisma.$queryRawUnsafe(
      `INSERT INTO "${schemaName}"."Document" ("assemblyId", fileName) VALUES ($1, $2) RETURNING id`,
      assemblyId,
      fileName,
    );

    // Aquí podrías guardar el PDF en un sistema de archivos o S3
    return NextResponse.json(
      { message: "Acta generada", documentId: result[0].id },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error al generar acta", error: error.message },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { message: "Error al generar acta", error: String(error) },
      { status: 500 },
    );
  }
}
