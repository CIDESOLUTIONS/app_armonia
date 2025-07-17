import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Readable } from 'stream';

@Injectable()
export class PdfService {
  async generatePdf(content: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
      doc.on('error', reject);

      doc.text(content);
      doc.end();
    });
  }

  async generateFinancialReportPdf(reportData: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
      doc.on('error', reject);

      doc.fontSize(20).text('Reporte Financiero', { align: 'center' });
      doc.moveDown();

      doc.fontSize(12).text(`Fecha del Reporte: ${new Date().toLocaleDateString()}`);
      doc.moveDown();

      doc.fontSize(14).text('Resumen:');
      doc.text(`Ingresos Totales: ${reportData.totalIncome}`);
      doc.text(`Gastos Totales: ${reportData.totalExpenses}`);
      doc.text(`Balance Neto: ${reportData.netBalance}`);
      doc.moveDown();

      if (reportData.transactions && reportData.transactions.length > 0) {
        doc.fontSize(14).text('Transacciones:');
        reportData.transactions.forEach((tx: any) => {
          doc.text(`  - ${tx.description || tx.title}: ${tx.amount}`);
        });
        doc.moveDown();
      }

      if (reportData.debtors && reportData.debtors.length > 0) {
        doc.fontSize(14).text('Deudores:');
        reportData.debtors.forEach((debtor: any) => {
          doc.text(`  - Propiedad: ${debtor.property.address}, Monto Pendiente: ${debtor.outstandingAmount}`);
        });
        doc.moveDown();
      }

      if (reportData.peaceAndSafes && reportData.peaceAndSafes.length > 0) {
        doc.fontSize(14).text('Paz y Salvos Emitidos:');
        reportData.peaceAndSafes.forEach((ps: any) => {
          doc.text(`  - Propiedad: ${ps.property.address}, Fecha: ${ps.certificateDate.toLocaleDateString()}`);
        });
        doc.moveDown();
      }

      doc.end();
    });
  }
}
