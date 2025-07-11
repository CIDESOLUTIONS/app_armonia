/**
 * @fileoverview Servicio de Plantillas de Facturas para la aplicación Armonía.
 * Proporciona funcionalidades para la gestión de plantillas de facturas.
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
import { PrismaClient } from '@prisma/client';
import { ServerLogger } from '../logging/server-logger';
import * as handlebars from 'handlebars';
const logger = ServerLogger;
/**
 * Clase que gestiona las plantillas de facturas.
 */
export class InvoiceTemplateService {
    /**
     * Constructor del servicio.
     * @param {string} schemaName - Nombre del esquema/comunidad.
     */
    constructor(schemaName) {
        if (!schemaName) {
            throw new Error('Se requiere un nombre de esquema para el servicio de plantillas de facturas');
        }
        this.schemaName = schemaName;
        this.prisma = new PrismaClient({
            datasources: {
                db: {
                    url: `${process.env.DATABASE_URL}?schema=${schemaName}`,
                },
            },
        });
        logger.info(`Servicio de plantillas de facturas inicializado para esquema: ${schemaName}`);
    }
    /**
     * Obtiene todas las plantillas de facturas.
     * @returns {Promise<InvoiceTemplate[]>} - Lista de plantillas.
     */
    getAllTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const templates = yield this.prisma.invoiceTemplate.findMany({
                    orderBy: {
                        updatedAt: 'desc',
                    },
                });
                logger.info(`Recuperadas ${templates.length} plantillas de facturas`);
                return templates;
            }
            catch (error) {
                logger.error(`Error al obtener plantillas de facturas: ${error.message}`);
                throw error;
            }
        });
    }
    /**
     * Obtiene una plantilla de factura por ID.
     * @param {string} id - ID de la plantilla.
     * @returns {Promise<InvoiceTemplate | null>} - Plantilla encontrada.
     */
    getTemplateById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id) {
                    throw new Error('Se requiere un ID para obtener la plantilla');
                }
                const template = yield this.prisma.invoiceTemplate.findUnique({
                    where: { id },
                });
                if (!template) {
                    logger.warn(`Plantilla de factura no encontrada: ${id}`);
                    return null;
                }
                logger.info(`Recuperada plantilla de factura: ${id}`);
                return template;
            }
            catch (error) {
                logger.error(`Error al obtener plantilla de factura ${id}: ${error.message}`);
                throw error;
            }
        });
    }
    /**
     * Crea una nueva plantilla de factura.
     * @param {Partial<InvoiceTemplate>} templateData - Datos de la plantilla.
     * @returns {Promise<InvoiceTemplate>} - Plantilla creada.
     */
    createTemplate(templateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!templateData || !templateData.name || !templateData.content) {
                    throw new Error('Datos de plantilla incompletos');
                }
                if (templateData.isDefault) {
                    yield this.prisma.invoiceTemplate.updateMany({
                        where: { isDefault: true },
                        data: { isDefault: false },
                    });
                }
                const template = yield this.prisma.invoiceTemplate.create({
                    data: {
                        name: templateData.name,
                        description: templateData.description || '',
                        content: templateData.content,
                        isDefault: templateData.isDefault || false,
                        createdBy: templateData.createdBy || 'system',
                    },
                });
                logger.info(`Creada nueva plantilla de factura: ${template.id}`);
                return template;
            }
            catch (error) {
                logger.error(`Error al crear plantilla de factura: ${error.message}`);
                throw error;
            }
        });
    }
    /**
     * Actualiza una plantilla de factura existente.
     * @param {string} id - ID de la plantilla.
     * @param {Partial<InvoiceTemplate>} templateData - Datos a actualizar.
     * @returns {Promise<InvoiceTemplate | null>} - Plantilla actualizada.
     */
    updateTemplate(id, templateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id) {
                    throw new Error('Se requiere un ID para actualizar la plantilla');
                }
                const existingTemplate = yield this.prisma.invoiceTemplate.findUnique({
                    where: { id },
                });
                if (!existingTemplate) {
                    logger.warn(`Plantilla de factura no encontrada para actualizar: ${id}`);
                    return null;
                }
                if (templateData.isDefault) {
                    yield this.prisma.invoiceTemplate.updateMany({
                        where: {
                            isDefault: true,
                            id: { not: id },
                        },
                        data: { isDefault: false },
                    });
                }
                const updatedTemplate = yield this.prisma.invoiceTemplate.update({
                    where: { id },
                    data: Object.assign(Object.assign({}, templateData), { updatedAt: new Date() }),
                });
                logger.info(`Actualizada plantilla de factura: ${id}`);
                return updatedTemplate;
            }
            catch (error) {
                logger.error(`Error al actualizar plantilla de factura ${id}: ${error.message}`);
                throw error;
            }
        });
    }
    /**
     * Elimina una plantilla de factura.
     * @param {string} id - ID de la plantilla.
     * @returns {Promise<boolean>} - Resultado de la operación.
     */
    deleteTemplate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id) {
                    throw new Error('Se requiere un ID para eliminar la plantilla');
                }
                const existingTemplate = yield this.getTemplateById(id);
                if (!existingTemplate) {
                    logger.warn(`Plantilla de factura no encontrada para eliminar: ${id}`);
                    return false;
                }
                if (existingTemplate.isDefault) {
                    logger.warn(`No se puede eliminar la plantilla por defecto: ${id}`);
                    throw new Error('No se puede eliminar la plantilla por defecto');
                }
                yield this.prisma.invoiceTemplate.delete({
                    where: { id },
                });
                logger.info(`Eliminada plantilla de factura: ${id}`);
                return true;
            }
            catch (error) {
                logger.error(`Error al eliminar plantilla de factura ${id}: ${error.message}`);
                throw error;
            }
        });
    }
    /**
     * Renderiza una factura con una plantilla específica.
     * @param {string | null} templateId - ID de la plantilla (opcional, usa la predeterminada si no se proporciona).
     * @param {Record<string, any>} invoiceData - Datos de la factura.
     * @returns {Promise<string>} - HTML renderizado.
     */
    renderInvoice(templateId, invoiceData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!invoiceData) {
                    throw new Error('Se requieren datos de factura para renderizar');
                }
                let template = null;
                if (templateId) {
                    template = yield this.getTemplateById(templateId);
                }
                else {
                    template = yield this.prisma.invoiceTemplate.findFirst({ where: { isDefault: true } });
                }
                if (!template) {
                    throw new Error('No se encontró plantilla para renderizar la factura');
                }
                const compiledTemplate = handlebars.compile(template.content);
                const renderedContent = compiledTemplate(invoiceData);
                logger.info(`Factura renderizada con plantilla: ${template.id}`);
                return renderedContent;
            }
            catch (error) {
                logger.error(`Error al renderizar factura: ${error.message}`);
                throw error;
            }
        });
    }
    /**
     * Cierra la conexión a la base de datos.
     */
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.prisma.$disconnect();
                logger.info('Conexión a base de datos cerrada');
            }
            catch (error) {
                logger.error(`Error al cerrar conexión a base de datos: ${error.message}`);
            }
        });
    }
}
