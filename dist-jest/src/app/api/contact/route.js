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
import { getPrisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
const prisma = getPrisma();
export function POST(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = yield request.json();
            const { name, email, phone, _complexName, units, message } = body;
            // Validar los datos
            if (!name || !email || !complexName || !units) {
                return NextResponse.json({ error: 'Datos incompletos. Por favor complete todos los campos obligatorios.' }, { status: 400 });
            }
            // Guardar el prospecto en la base de datos
            // Variable prospect eliminada por lint
            // Configurar el transportador de correo
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
            // Configurar el mensaje
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: 'Customers@cidesolutions.com',
                subject: `Nuevo prospecto de Armonía: ${complexName}`,
                html: `
        <h2>Nuevo prospecto de Armonía</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
        <p><strong>Nombre del Conjunto:</strong> ${complexName}</p>
        <p><strong>Unidades:</strong> ${units}</p>
        <p><strong>Mensaje:</strong> ${message || 'No proporcionado'}</p>
        <p>Este correo fue enviado automáticamente desde el formulario de contacto de Armonía.</p>
      `,
            };
            // Enviar el correo
            yield transporter.sendMail(mailOptions);
            return NextResponse.json({
                success: true,
                message: 'Formulario enviado correctamente. Nos pondremos en contacto pronto.'
            });
        }
        catch (error) {
            console.error('Error al procesar el formulario:', error);
            return NextResponse.json({ error: 'Error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.' }, { status: 500 });
        }
    });
}
