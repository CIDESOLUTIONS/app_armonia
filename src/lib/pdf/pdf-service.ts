import PDFDocument from "pdfkit";
import { Buffer } from "buffer";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";

interface ReceiptData {
  transactionId: string;
  date: Date;
  customerName: string;
  customerEmail: string;
  planType: string;
  amount: number;
  currency: string;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: string;
  language?: "es" | "en";
}

// Definición de textos para internacionalización
const spanishTexts = {
  receiptTitle: "RECIBO DE PAGO",
  transactionId: "ID de Transacción",
  date: "Fecha",
  customerInfo: "Información del Cliente",
  name: "Nombre",
  email: "Correo Electrónico",
  paymentDetails: "Detalles del Pago",
  description: "Descripción",
  amount: "Importe",
  planType: "Plan",
  tax: "IVA",
  total: "Total",
  paymentMethod: "Método de Pago",
  legalNote:
    "Este es un recibo generado automáticamente. Para cualquier consulta, contacte con soporte@armonia.com",
};

const englishTexts = {
  receiptTitle: "PAYMENT RECEIPT",
  transactionId: "Transaction ID",
  date: "Date",
  customerInfo: "Customer Information",
  name: "Name",
  email: "Email",
  paymentDetails: "Payment Details",
  description: "Description",
  amount: "Amount",
  planType: "Plan",
  tax: "VAT",
  total: "Total",
  paymentMethod: "Payment Method",
  legalNote:
    "This is an automatically generated receipt. For any inquiries, please contact support@armonia.com",
};

/**
 * Servicio para la generación de documentos PDF utilizando PDFKit.
 */
export class PdfKitService {
  /**
   * Genera un recibo de pago en formato PDF.
   * @param data Datos para el recibo.
   * @returns Buffer con el PDF generado.
   */
  public async generateReceipt(data: ReceiptData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      const locale = data.language === "en" ? enUS : es;
      const texts = data.language === "en" ? englishTexts : spanishTexts;

      // Encabezado
      doc
        .fontSize(20)
        .fillColor("#2563eb")
        .text(texts.receiptTitle, { align: "center" });
      doc
        .fontSize(16)
        .fillColor("#000000")
        .text("ARMONÍA", { align: "center" });
      doc.moveDown(2);

      // Información de la transacción
      doc.fontSize(10);
      doc.text(`${texts.transactionId}: ${data.transactionId}`);
      doc.text(`${texts.date}: ${format(data.date, "PPP", { locale })}`);
      doc.moveDown();

      // Información del cliente
      doc.fontSize(12).text(texts.customerInfo);
      doc.fontSize(10).text(`${texts.name}: ${data.customerName}`);
      doc.text(`${texts.email}: ${data.customerEmail}`);
      doc.moveDown(2);

      // Detalles del pago (Tabla)
      doc.fontSize(12).text(texts.paymentDetails);
      doc.moveDown();

      const tableTop = doc.y;
      const itemX = 50;
      const amountX = 400;

      doc.fontSize(10).font("Helvetica-Bold");
      doc.text(texts.description, itemX, tableTop);
      doc.text(texts.amount, amountX, tableTop, { width: 100, align: "right" });
      doc.font("Helvetica");

      const drawRow = (item: string, amount: string, y: number) => {
        doc.text(item, itemX, y);
        doc.text(amount, amountX, y, { width: 100, align: "right" });
      };

      let y = tableTop + 20;
      drawRow(
        `${texts.planType}: ${data.planType}`,
        `${data.currency} ${data.amount.toLocaleString()}`,
        y,
      );
      y += 20;
      drawRow(
        `${texts.tax} (19%)`,
        `${data.currency} ${data.taxAmount.toLocaleString()}`,
        y,
      );
      y += 20;
      doc.moveTo(itemX, y).lineTo(500, y).stroke(); // Separador
      y += 10;
      doc.font("Helvetica-Bold");
      drawRow(
        texts.total,
        `${data.currency} ${data.totalAmount.toLocaleString()}`,
        y,
      );
      doc.font("Helvetica");

      // Método de pago
      doc.y = y + 30;
      doc.text(`${texts.paymentMethod}: ${data.paymentMethod}`);

      // Nota legal
      doc
        .fontSize(8)
        .fillColor("#6b7280")
        .text(texts.legalNote, 50, 700, { align: "center" });

      doc.end();
    });
  }
}

export const pdfKitService = new PdfKitService();
