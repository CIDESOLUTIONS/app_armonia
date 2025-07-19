import nodemailer from "nodemailer";
import { pdfKitService } from "./pdf-service"; // Importar el nuevo servicio

// La interfaz y los textos se mueven a pdf-service.ts, pero se mantienen aquí para la firma de la función
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

/**
 * Genera un recibo de pago en formato PDF utilizando el servicio centralizado.
 * @param data Datos para el recibo
 * @returns Buffer con el PDF generado
 */
export async function generateReceipt(data: ReceiptData): Promise<Buffer> {
  return pdfKitService.generateReceipt(data);
}

/**
 * Envía un recibo por correo electrónico
 * @param data Datos del recibo
 * @param email Correo electrónico del destinatario
 * @returns Promesa que resuelve cuando el correo ha sido enviado
 */
export async function sendReceiptByEmail(
  data: ReceiptData,
  email: string,
): Promise<boolean> {
  try {
    const pdfBuffer = await generateReceipt(data);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: data.language === "en" ? "Payment Receipt" : "Recibo de Pago",
      html: `<p>${data.language === "en" ? "Attached is your payment receipt." : "Adjunto encontrarás tu recibo de pago."}</p>`,
      attachments: [
        {
          filename: `receipt_${data.transactionId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(`Recibo enviado a ${email}`);
    return true;
  } catch (error) {
    console.error("Error al enviar recibo:", error);
    return false;
  }
}
