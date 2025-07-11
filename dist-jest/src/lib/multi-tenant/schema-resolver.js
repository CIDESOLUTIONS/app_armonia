/**
 * Módulo para resolver el esquema de base de datos en un entorno multi-tenant
 * Compatible con Next.js 15 y React 19
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
import { getPrisma } from '@/lib/prisma';
// Cliente Prisma con soporte para múltiples esquemas
const prismaClientSingleton = () => {
    return getPrisma();
};
// Aseguramos una única instancia del cliente Prisma
const globalForPrisma = globalThis;
export const prisma = (_a = globalForPrisma.prisma) !== null && _a !== void 0 ? _a : prismaClientSingleton();
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = prisma;
/**
 * Resuelve el esquema de base de datos basado en el nombre del esquema
 * @param schemaName Nombre del esquema a utilizar
 * @returns Cliente Prisma configurado para el esquema específico
 */
export function resolveSchema(schemaName) {
    if (!schemaName) {
        throw new Error('Nombre de esquema no proporcionado');
    }
    // Validación básica del nombre del esquema para evitar inyección SQL
    if (!/^[a-zA-Z0-9_]+$/.test(schemaName)) {
        throw new Error('Nombre de esquema inválido');
    }
    return prisma.$extends({
        query: {
            $allModels: {
                $allOperations(_a) {
                    return __awaiter(this, arguments, void 0, function* ({ args, query }) {
                        // Configurar el esquema para todas las operaciones
                        const result = yield query(Object.assign(Object.assign({}, args), { 
                            // @ts-ignore - Prisma no expone correctamente el tipo para esta configuración
                            schema: schemaName }));
                        return result;
                    });
                },
            },
        },
    });
}
/**
 * Obtiene el nombre del esquema desde la solicitud o contexto
 * @param req Objeto de solicitud o contexto que contiene información del esquema
 * @returns Nombre del esquema
 */
export function getSchemaFromRequest(req) {
    var _a, _b, _c;
    // Intentar obtener el esquema de diferentes fuentes
    const schemaName = ((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.schemaName) ||
        ((_b = req === null || req === void 0 ? void 0 : req.headers) === null || _b === void 0 ? void 0 : _b['x-schema-name']) ||
        ((_c = req === null || req === void 0 ? void 0 : req.cookies) === null || _c === void 0 ? void 0 : _c['schema-name']) ||
        process.env.DEFAULT_SCHEMA ||
        'public';
    return schemaName;
}
export default resolveSchema;
