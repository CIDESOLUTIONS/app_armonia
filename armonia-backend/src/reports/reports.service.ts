import { Injectable } from '@nestjs/common';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import * as PDFDocument from 'pdfkit';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { PaymentStatus, ExpenseStatus, FeeStatus } from '@prisma/client'; // Import necessary enums

@Injectable()
export class ReportsService {
  constructor(
    private prismaClientManager: PrismaClientManager,
    private prisma: PrismaService,
  ) {}

  private getTenantPrismaClient(schemaName: string) {
    return this.prismaClientManager.getClient(schemaName);
  }

  async generateVisitorsReportPdf(
    schemaName: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Buffer> {
    const prisma = this.getTenantPrismaClient(schemaName);
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
    const prisma = this.getTenantPrismaClient(schemaName);
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
    const prisma = this.getTenantPrismaClient(schemaName);
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
    const prisma = this.getTenantPrismaClient(schemaName);
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
    const prisma = this.getTenantPrismaClient(schemaName);
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
    const prisma = this.getTenantPrismaClient(schemaName);
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
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    doc.fontSize(18).text('Reporte Financiero Consolidado', { align: 'center' });
    doc
      .fontSize(10)
      .text(
        `Período: ${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`,
        { align: 'center' },
      );
    doc.moveDown();

    let totalIncome = 0;
    let totalExpenses = 0;
    let totalPendingFees = 0;

    for (const schemaName of schemaNames) {
      const prisma = this.getTenantPrismaClient(schemaName);

      // Fetch income (completed payments)
      const incomeResult = await prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: PaymentStatus.COMPLETED,
          paymentDate: { gte: startDate, lte: endDate },
        },
      });
      totalIncome += incomeResult._sum.amount || 0;

      // Fetch expenses (paid expenses)
      const expenseResult = await prisma.expense.aggregate({
        _sum: { amount: true },
        where: {
          status: ExpenseStatus.PAID,
          date: { gte: startDate, lte: endDate },
        },
      });
      totalExpenses += expenseResult._sum.amount || 0;

      // Fetch pending fees
      const pendingFeesResult = await prisma.fee.aggregate({
        _sum: { amount: true },
        where: {
          status: FeeStatus.PENDING,
          dueDate: { gte: startDate, lte: endDate },
        },
      });
      totalPendingFees += pendingFeesResult._sum.amount || 0;
    }

    doc.fontSize(12).text(`Ingresos Totales: $${totalIncome.toFixed(2)}`);
    doc.fontSize(12).text(`Gastos Totales: $${totalExpenses.toFixed(2)}`);
    doc.fontSize(12).text(`Saldo Neto: $${(totalIncome - totalExpenses).toFixed(2)}`);
    doc.fontSize(12).text(`Cuotas Pendientes: $${totalPendingFees.toFixed(2)}`);
    doc.moveDown();

    doc.end();

    return new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
    });
  }
}