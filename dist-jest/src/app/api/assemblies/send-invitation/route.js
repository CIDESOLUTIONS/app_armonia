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
import nodemailer from 'nodemailer';
// Variable JWT_SECRET eliminada por lint
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});
export function POST(_req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const _token = (_a = req.headers.get('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token)
            return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
        try {
            // Variable decoded eliminada por lint complexId: number; schemaName: string };
            const { assemblyId, title, date, agenda } = yield req.json();
            const _schemaName = decoded.schemaName.toLowerCase();
            prisma.setTenantSchema(schemaName);
            const residents = yield prisma.$queryRawUnsafe(`SELECT email FROM "${schemaName}"."Resident" WHERE "complexId" = $1`, decoded.complexId);
            const mailOptions = {
                from: process.env.EMAIL_USER,
                subject: `Invitación a Asamblea: ${title}`,
                text: `Estimado residente,\n\nEstá invitado a la asamblea "${title}" el ${new Date(date).toLocaleString()}.\n\nAgenda:\n${agenda.map((item) => `${item.numeral}. ${item.topic} (${item.time})`).join('\n')}\n\nPor favor, confirme su asistencia en el portal.\n\nSaludos,\nAdministración`,
            };
            yield Promise.all(residents.map(r => transporter.sendMail(Object.assign(Object.assign({}, mailOptions), { to: r.email }))));
            return NextResponse.json({ message: 'Invitaciones enviadas' }, { status: 200 });
        }
        catch (error) {
            console.error('[API Send Invitations] Error:', error);
            return NextResponse.json({ message: 'Error al enviar invitaciones', error: String(error) }, { status: 500 });
        }
    });
}
