import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import PDFDocument from 'pdfkit';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { PaymentStatus } from '../common/enums/payment-status.enum.js';
import { ExpenseStatus } from '../common/enums/expense-status.enum.js';
import { FeeStatus } from '../common/enums/fee-status.enum.js';

@Injectable()
export class ReportsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async generateVisitorsReportPdf(
    schemaName: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Buffer> {
    const prisma = this.prisma;
    const visitors = await prisma.visitor.findMany({
      where: {
        entryTime: { gte: startDate, lte: endDate },
      },
      orderBy: { entryTime: 'asc' },
    });

    const doc = new PDFDocument();
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    doc.fontSize(18).text('Reporte de Visitantes', { align: 'center' });
    doc
      .fontSize(10)
      .text(
        `Período: ${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`,
        { align: 'center' },
      );
    doc.moveDown();

    // Table Header
    doc.font('Helvetica-Bold').fontSize(10);
    doc.text('Nombre', 50, doc.y, { width: 100, align: 'left' });
    doc.text('Identificación', 150, doc.y, { width: 100, align: 'left' });
    doc.text('Visitado', 250, doc.y, { width: 100, align: 'left' });
    doc.text('Entrada', 350, doc.y, { width: 100, align: 'left' });
    doc.text('Salida', 450, doc.y, { width: 100, align: 'left' });
    doc.moveDown();

    // Table Rows
    doc.font('Helvetica').fontSize(9);
    visitors.forEach((visitor) => {
      doc.text(visitor.name, 50, doc.y, { width: 100, align: 'left' });
      doc.text(visitor.identification, 150, doc.y, {
        width: 100,
        align: 'left',
      });
      doc.text(visitor.visitedUnit, 250, doc.y, { width: 100, align: 'left' });
      doc.text(format(visitor.entryTime, 'dd/MM/yyyy HH:mm'), 350, doc.y, {
        width: 100,
        align: 'left',
      });
      doc.text(
        visitor.exitTime ? format(visitor.exitTime, 'dd/MM/yyyy HH:mm') : 'N/A',
        450,
        doc.y,
        { width: 100, align: 'left' },
      );
      doc.moveDown();
    });

    doc.end();

    return new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
    });
  }

  async generateVisitorsReportExcel(
    schemaName: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Buffer> {
    const prisma = this.prisma;
    const visitors = await prisma.visitor.findMany({
      where: {
        entryTime: { gte: startDate, lte: endDate },
      },
      orderBy: { entryTime: 'asc' },
    });

    const data = [
      ['Nombre', 'Identificación', 'Visitado', 'Entrada', 'Salida'],
      ...visitors.map((visitor) => [
        visitor.name,
        visitor.identification,
        visitor.visitedUnit,
        format(visitor.entryTime, 'dd/MM/yyyy HH:mm'),
        visitor.exitTime ? format(visitor.exitTime, 'dd/MM/yyyy HH:mm') : 'N/A',
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Visitantes');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    return buf;
  }

  async generatePackagesReportPdf(
    schemaName: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Buffer> {
    const prisma = this.prisma;
    const packages = await prisma.package.findMany({
      where: {
        registrationDate: { gte: startDate, lte: endDate },
      },
      orderBy: { registrationDate: 'asc' },
    });

    const doc = new PDFDocument();
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    doc.fontSize(18).text('Reporte de Paquetes', { align: 'center' });
    doc
      .fontSize(10)
      .text(
        `Período: ${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`,
        { align: 'center' },
      );
    doc.moveDown();

    // Table Header
    doc.font('Helvetica-Bold').fontSize(10);
    doc.text('Tipo', 50, doc.y, { width: 80, align: 'left' });
    doc.text('Seguimiento', 130, doc.y, { width: 80, align: 'left' });
    doc.text('Destino', 210, doc.y, { width: 80, align: 'left' });
    doc.text('Remitente', 290, doc.y, { width: 80, align: 'left' });
    doc.text('Registro', 370, doc.y, { width: 80, align: 'left' });
    doc.text('Entrega', 450, doc.y, { width: 80, align: 'left' });
    doc.text('Estado', 530, doc.y, { width: 80, align: 'left' });
    doc.moveDown();

    // Table Rows
    doc.font('Helvetica').fontSize(9);
    packages.forEach((pkg) => {
      doc.text(pkg.type, 50, doc.y, { width: 80, align: 'left' });
      doc.text(pkg.trackingNumber || 'N/A', 130, doc.y, {
        width: 80,
        align: 'left',
      });
      doc.text(pkg.recipientUnit, 210, doc.y, { width: 80, align: 'left' });
      doc.text(pkg.sender || 'N/A', 290, doc.y, { width: 80, align: 'left' });
      doc.text(format(pkg.registrationDate, 'dd/MM/yyyy HH:mm'), 370, doc.y, {
        width: 80,
        align: 'left',
      });
      doc.text(
        pkg.deliveryDate ? format(pkg.deliveryDate, 'dd/MM/yyyy HH:mm') : 'N/A',
        450,
        doc.y,
        { width: 80, align: 'left' },
      );
      doc.text(pkg.status, 530, doc.y, { width: 80, align: 'left' });
      doc.moveDown();
    });

    doc.end();

    return new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
    });
  }

  async generatePackagesReportExcel(
    schemaName: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Buffer> {
    const prisma = this.prisma;
    const packages = await prisma.package.findMany({
      where: {
        registrationDate: { gte: startDate, lte: endDate },
      },
      orderBy: { registrationDate: 'asc' },
    });

    const data = [
      [
        'Tipo',
        'Seguimiento',
        'Destino',
        'Remitente',
        'Registro',
        'Entrega',
        'Estado',
      ],
      ...packages.map((pkg) => [
        pkg.type,
        pkg.trackingNumber || 'N/A',
        pkg.recipientUnit,
        pkg.sender || 'N/A',
        format(pkg.registrationDate, 'dd/MM/yyyy HH:mm'),
        pkg.deliveryDate ? format(pkg.deliveryDate, 'dd/MM/yyyy HH:mm') : 'N/A',
        pkg.status,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Paquetes');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    return buf;
  }

  async generateIncidentsReportPdf(
    schemaName: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Buffer> {
    const prisma = this.prisma;
    const incidents = await prisma.pQR.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      orderBy: { createdAt: 'asc' },
    });

    const doc = new PDFDocument();
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    doc.fontSize(18).text('Reporte de Incidentes', { align: 'center' });
    doc
      .fontSize(10)
      .text(
        `Período: ${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`,
        { align: 'center' },
      );
    doc.moveDown();

    // Table Header
    doc.font('Helvetica-Bold').fontSize(10);
    doc.text('Título', 50, doc.y, { width: 100, align: 'left' });
    doc.text('Categoría', 150, doc.y, { width: 80, align: 'left' });
    doc.text('Prioridad', 230, doc.y, { width: 80, align: 'left' });
    doc.text('Ubicación', 310, doc.y, { width: 100, align: 'left' });
    doc.text('Reportado Por', 410, doc.y, { width: 100, align: 'left' });
    doc.text('Estado', 510, doc.y, { width: 80, align: 'left' });
    doc.moveDown();

    // Table Rows
    doc.font('Helvetica').fontSize(9);
    incidents.forEach((incident) => {
      doc.text(incident.subject, 50, doc.y, { width: 100, align: 'left' });
      doc.text(incident.category, 150, doc.y, { width: 80, align: 'left' });
      doc.text(incident.priority, 230, doc.y, { width: 80, align: 'left' });
      doc.text(incident.location, 310, doc.y, { width: 100, align: 'left' });
      doc.text(incident.reportedBy, 410, doc.y, { width: 100, align: 'left' });
      doc.text(incident.status, 510, doc.y, { width: 80, align: 'left' });
      doc.moveDown();
    });

    doc.end();

    return new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
    });
  }

  async generateIncidentsReportExcel(
    schemaName: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Buffer> {
    const prisma = this.prisma;
    const incidents = await prisma.pQR.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      orderBy: { createdAt: 'asc' },
    });

    const data = [
      [
        'Título',
        'Categoría',
        'Prioridad',
        'Ubicación',
        'Reportado Por',
        'Estado',
      ],
      ...incidents.map((incident) => [
        incident.subject,
        incident.category,
        incident.priority,
        incident.location,
        incident.reportedBy,
        incident.status,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Incidentes');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    return buf;
  }

  async generateConsolidatedFinancialReportPdf(
    schemaNames: string[],
    startDate: Date,
    endDate: Date,
  ): Promise<Buffer> {
    return Buffer.from('PDF generation temporarily disabled');
  }

  async generatePeaceAndSafePdf(
    schemaName: string,
    residentId: number,
  ): Promise<Buffer> {
    const prisma = this.prisma;

    const resident = await prisma.resident.findUnique({
      where: { id: residentId },
      include: { property: true },
    });

    if (!resident) {
      throw new NotFoundException(`Residente con ID ${residentId} no encontrado.`);
    }

    const outstandingFees = await prisma.fee.count({
      where: {
        residentId: resident.id,
        status: { in: [FeeStatus.PENDING, FeeStatus.OVERDUE] },
      },
    });

    if (outstandingFees > 0) {
      throw new BadRequestException(
        `El residente ${resident.name} tiene ${outstandingFees} cuotas pendientes. No se puede generar Paz y Salvo.`,
      );
    }

    const doc = new PDFDocument();
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    doc.fontSize(24).text('Certificado de Paz y Salvo', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(
      `Por medio del presente, se certifica que el residente ${resident.name},
      identificado con ID ${resident.id}, de la unidad ${resident.property.unitNumber},
      se encuentra a PAZ Y SALVO por todo concepto con la administración del conjunto residencial.
      `,
      { align: 'justify' },
    );
    doc.moveDown();
    doc.moveDown();

    doc.fontSize(10).text(`Fecha de Emisión: ${format(new Date(), 'dd/MM/yyyy')}`, { align: 'right' });
    doc.moveDown();
    doc.moveDown();

    doc.fontSize(12).text('____________________________', { align: 'center' });
    doc.fontSize(12).text('Firma de la Administración', { align: 'center' });

    doc.end();

    return new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
    });
  }
}