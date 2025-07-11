/**
 * @fileoverview Servicio de Reglas de Facturación para la aplicación Armonía.
 * Proporciona funcionalidades para la gestión de reglas de facturación.
 */

import { PrismaClient, InvoiceRule } from "@prisma/client";
import { ServerLogger } from "../logging/server-logger";
import { evaluate } from "mathjs";

const logger = ServerLogger;

interface RuleOptions {
  skip?: number;
  take?: number;
  active?: boolean;
  category?: string;
}

interface EvaluationResult {
  success: boolean;
  result?: number | null;
  error?: string;
  ruleId?: string;
  ruleName?: string;
}

/**
 * Clase que gestiona las reglas de facturación.
 */
export class InvoiceRuleService {
  private prisma: PrismaClient;
  private schemaName: string;

  /**
   * Constructor del servicio.
   * @param {string} schemaName - Nombre del esquema/comunidad.
   */
  constructor(schemaName: string) {
    if (!schemaName) {
      throw new Error(
        "Se requiere un nombre de esquema para el servicio de reglas de facturación",
      );
    }

    this.schemaName = schemaName;
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: `${process.env.DATABASE_URL}?schema=${schemaName}`,
        },
      },
    });

    logger.info(
      `Servicio de reglas de facturación inicializado para esquema: ${schemaName}`,
    );
  }

  /**
   * Obtiene todas las reglas de facturación.
   * @param {RuleOptions} options - Opciones de filtrado y paginación.
   * @returns {Promise<InvoiceRule[]>} - Lista de reglas.
   */
  async getAllRules(options: RuleOptions = {}): Promise<InvoiceRule[]> {
    try {
      const { skip = 0, take = 50, active, category } = options;
      const where: any = {};

      if (active !== undefined) {
        where.active = active;
      }

      if (category) {
        where.category = category;
      }

      const rules = await this.prisma.invoiceRule.findMany({
        where,
        skip,
        take,
        orderBy: {
          priority: "asc",
        },
      });

      logger.info(`Recuperadas ${rules.length} reglas de facturación`);
      return rules;
    } catch (error: any) {
      logger.error(`Error al obtener reglas de facturación: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtiene una regla de facturación por ID.
   * @param {string} id - ID de la regla.
   * @returns {Promise<InvoiceRule | null>} - Regla encontrada.
   */
  async getRuleById(id: string): Promise<InvoiceRule | null> {
    try {
      if (!id) {
        throw new Error("Se requiere un ID para obtener la regla");
      }

      const rule = await this.prisma.invoiceRule.findUnique({
        where: { id },
      });

      if (!rule) {
        logger.warn(`Regla de facturación no encontrada: ${id}`);
        return null;
      }

      logger.info(`Recuperada regla de facturación: ${id}`);
      return rule;
    } catch (error: any) {
      logger.error(
        `Error al obtener regla de facturación ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Crea una nueva regla de facturación.
   * @param {Partial<InvoiceRule>} ruleData - Datos de la regla.
   * @returns {Promise<InvoiceRule>} - Regla creada.
   */
  async createRule(ruleData: Partial<InvoiceRule>): Promise<InvoiceRule> {
    try {
      if (!ruleData || !ruleData.name || !ruleData.formula) {
        throw new Error("Datos de regla incompletos");
      }

      const rule = await this.prisma.invoiceRule.create({
        data: {
          name: ruleData.name,
          description: ruleData.description || "",
          category: ruleData.category || "GENERAL",
          formula: ruleData.formula,
          parameters: ruleData.parameters || {},
          priority: ruleData.priority || 100,
          active: ruleData.active !== undefined ? ruleData.active : true,
          startDate: ruleData.startDate || new Date(),
          endDate: ruleData.endDate || null,
          createdBy: ruleData.createdBy || "system",
        },
      });

      logger.info(`Creada nueva regla de facturación: ${rule.id}`);
      return rule;
    } catch (error: any) {
      logger.error(`Error al crear regla de facturación: ${error.message}`);
      throw error;
    }
  }

  /**
   * Actualiza una regla de facturación existente.
   * @param {string} id - ID de la regla.
   * @param {Partial<InvoiceRule>} ruleData - Datos a actualizar.
   * @returns {Promise<InvoiceRule | null>} - Regla actualizada.
   */
  async updateRule(
    id: string,
    ruleData: Partial<InvoiceRule>,
  ): Promise<InvoiceRule | null> {
    try {
      if (!id) {
        throw new Error("Se requiere un ID para actualizar la regla");
      }

      const existingRule = await this.prisma.invoiceRule.findUnique({
        where: { id },
      });

      if (!existingRule) {
        logger.warn(
          `Regla de facturación no encontrada para actualizar: ${id}`,
        );
        return null;
      }

      const updatedRule = await this.prisma.invoiceRule.update({
        where: { id },
        data: {
          ...ruleData,
          updatedAt: new Date(),
        },
      });

      logger.info(`Actualizada regla de facturación: ${id}`);
      return updatedRule;
    } catch (error: any) {
      logger.error(
        `Error al actualizar regla de facturación ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Elimina una regla de facturación.
   * @param {string} id - ID de la regla.
   * @returns {Promise<boolean>} - Resultado de la operación.
   */
  async deleteRule(id: string): Promise<boolean> {
    try {
      if (!id) {
        throw new Error("Se requiere un ID para eliminar la regla");
      }

      await this.prisma.invoiceRule.delete({
        where: { id },
      });

      logger.info(`Eliminada regla de facturación: ${id}`);
      return true;
    } catch (error: any) {
      logger.error(
        `Error al eliminar regla de facturación ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Evalúa una regla con datos específicos.
   * @param {string} ruleId - ID de la regla.
   * @param {Record<string, any>} data - Datos para evaluación.
   * @returns {Promise<EvaluationResult>} - Resultado de la evaluación.
   */
  async evaluateRule(
    ruleId: string,
    data: Record<string, any>,
  ): Promise<EvaluationResult> {
    try {
      if (!ruleId) {
        throw new Error("Se requiere un ID de regla para evaluar");
      }

      if (!data) {
        throw new Error("Se requieren datos para evaluar la regla");
      }

      const rule = await this.getRuleById(ruleId);

      if (!rule) {
        throw new Error(`Regla no encontrada: ${ruleId}`);
      }

      if (!rule.active) {
        logger.warn(`Intentando evaluar regla inactiva: ${ruleId}`);
        return {
          success: false,
          error: "La regla está inactiva",
          result: null,
        };
      }

      try {
        const context = { ...(rule.parameters as object), ...data };
        const result = evaluate(rule.formula, context);

        logger.info(`Regla ${ruleId} evaluada correctamente`);
        return {
          success: true,
          result,
          ruleId,
          ruleName: rule.name,
        };
      } catch (evalError: any) {
        logger.error(
          `Error al evaluar fórmula de regla ${ruleId}: ${evalError.message}`,
        );
        return {
          success: false,
          error: evalError.message,
          result: null,
        };
      }
    } catch (error: any) {
      logger.error(`Error al evaluar regla ${ruleId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Cierra la conexión a la base de datos.
   */
  async disconnect() {
    try {
      await this.prisma.$disconnect();
      logger.info("Conexión a base de datos cerrada");
    } catch (error: any) {
      logger.error(
        `Error al cerrar conexión a base de datos: ${error.message}`,
      );
    }
  }
}
