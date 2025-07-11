var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/app/api/assemblies/create/route.ts
import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { csrfProtection } from '@/lib/security/csrf-protection';
import { xssProtection } from '@/lib/security/xss-protection';
import { auditMiddleware, AuditActionType } from '@/lib/security/audit-trail';
import { verifyToken } from '@/lib/auth';
import { withValidation } from '@/lib/validation';
import { CreateAssemblySchema } from '@/validators/assemblies/assembly.validator';
function createAssemblyHandler(validatedData, req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.headers.get('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token)
            return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
        try {
            const decoded = yield verifyToken(token);
            console.log('[API Assemblies/Create] Token:', decoded);
            const schemaName = decoded.schemaName || `schema_${decoded.complexId}`;
            const prisma = getPrisma(schemaName);
            console.log('[API Assemblies/Create] Usando schema:', schemaName);
            // Verificar si la tabla Assembly existe
            const assemblyExists = yield prisma.$queryRawUnsafe(`SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = $1 AND table_name = 'Assembly')`, schemaName);
            console.log('[API Assemblies/Create] ¿Existe Assembly?:', assemblyExists[0].exists);
            if (!assemblyExists[0].exists) {
                console.log('[API Assemblies/Create] Creando tabla Assembly en', schemaName);
                yield prisma.$executeRawUnsafe(`CREATE TABLE "${schemaName}"."Assembly" (
          id SERIAL PRIMARY KEY,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          title TEXT NOT NULL,
          date TIMESTAMP NOT NULL,
          status TEXT NOT NULL DEFAULT 'PENDING',
          quorum DOUBLE PRECISION NOT NULL DEFAULT 0,
          votes JSONB,
          "organizerId" INTEGER NOT NULL,
          "complexId" INTEGER NOT NULL,
          type TEXT NOT NULL,
          description TEXT,
          agenda JSONB
        )`);
            }
            // Crear la asamblea usando el método manual con datos validados
            const assembly = yield prisma.manualAssembly.create({
                data: {
                    title: validatedData.title,
                    type: validatedData.type,
                    date: new Date(validatedData.date),
                    description: validatedData.description || null,
                    agenda: validatedData.agenda,
                    organizerId: decoded.id,
                    complexId: decoded.complexId,
                },
            });
            console.log('[API Assemblies/Create] Asamblea creada:', assembly);
            return NextResponse.json({ message: 'Asamblea creada con éxito', assembly }, { status: 201 });
        }
        catch (error) {
            console.error('[API Assemblies/Create] Error:', error);
            return NextResponse.json({ message: 'Error al crear la asamblea', error: String(error) }, { status: 500 });
        }
    });
}
// Exportar POST con validación
export const POST = withValidation(CreateAssemblySchema, createAssemblyHandler);
// Aplicar middlewares de seguridad
export const POST_handler = csrfProtection(xssProtection(auditMiddleware(AuditActionType.DATA_CREATE, (req) => `Creación de asamblea: ${req.headers.get('x-request-id') || 'ID no disponible'}`)(POST)));
