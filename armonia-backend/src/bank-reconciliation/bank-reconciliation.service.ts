import { Injectable, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  BankTransactionDto,
  ReconcileTransactionsDto,
  BankStatementUploadDto,
  ReconciliationResultDto,
  ReconciliationSummaryDto,
  ManualReconciliationDto,
  ReconciliationConfigDto,
  ReconciliationFilterDto,
  ReconciliationStatus,
  BankTransactionType
} from '../../common/dto/bank-reconciliation.dto';
import {
  ProcessReconciliationDto,
  ReconciliationStatsDto,
  BulkReconciliationDto
} from './dto/reconciliation-process.dto';
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Readable } from 'stream';

@Injectable()
export class BankReconciliationService {
  private readonly logger = new Logger(BankReconciliationService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Sube y procesa un extracto bancario desde archivo CSV, Excel o PDF
   * @param file Archivo de extracto bancario
   * @param uploadDto Datos del archivo
   * @param residentialComplexId ID del conjunto residencial
   * @returns Transacciones procesadas
   */
  async uploadBankStatement(
    file: Express.Multer.File,
    uploadDto: BankStatementUploadDto,
    residentialComplexId: string
  ): Promise<BankTransactionDto[]> {
    try {
      this.logger.log(`Procesando extracto bancario: ${uploadDto.fileName}`);

      let transactions: BankTransactionDto[] = [];

      switch (uploadDto.fileType.toUpperCase()) {
        case 'CSV':
          transactions = await this.parseCSVStatement(file.buffer);
          break;
        case 'XLSX':
          transactions = await this.parseExcelStatement(file.buffer);
          break;
        case 'PDF':
          transactions = await this.parsePDFStatement(file.buffer);
          break;
        default:
          throw new BadRequestException(`Tipo de archivo no soportado: ${uploadDto.fileType}`);
      }

      // Enriquecer transacciones con datos adicionales
      transactions = transactions.map(transaction => ({
        ...transaction,
        account: uploadDto.accountNumber || transaction.account,
        reference: transaction.reference || this.generateReference(transaction)
      }));

      this.logger.log(`Se procesaron ${transactions.length} transacciones`);
      return transactions;
    } catch (error) {
      this.logger.error(`Error procesando extracto bancario: ${error.message}`);
      throw new BadRequestException(`Error procesando archivo: ${error.message}`);
    }
  }

  /**
   * Ejecuta el proceso de conciliación automática
   * @param dto Datos de conciliación
   * @param schemaName Esquema de la base de datos
   * @returns Resultados de la conciliación
   */
  async reconcileTransactions(dto: ProcessReconciliationDto): Promise<ReconciliationResultDto[]> {
    try {
      this.logger.log(`Iniciando conciliación de ${dto.transactions.length} transacciones`);

      const results: ReconciliationResultDto[] = [];
      const config = dto.config || this.getDefaultConfig();

      // Obtener pagos del sistema para el período
      const systemPayments = await this.getSystemPayments(
        dto.residentialComplexId,
        schemaName,
        dto.periodStart,
        dto.periodEnd
      );

      this.logger.log(`Encontrados ${systemPayments.length} pagos en el sistema`);

      for (const transaction of dto.transactions) {
        const result = await this.matchTransaction(transaction, systemPayments, config);
        results.push(result);

        // Guardar resultado en base de datos
        await this.saveReconciliationResult(result, dto.residentialComplexId,schemaName
      }

      this.logger.log(`Conciliación completada. ${results.length} resultados generados`);
      return results;
    } catch (error) {
      this.logger.error(`Error en conciliación: ${error.message}`);
      throw new BadRequestException(`Error en conciliación: ${error.message}`);
    }
  }

  /**
   * Algoritmo de matching inteligente para emparejar transacciones
   * @param bankTransaction Transacción bancaria
   * @param systemPayments Pagos del sistema
   * @param config Configuración de matching
   * @returns Resultado de la conciliación
   */
  private async matchTransaction(
    bankTransaction: BankTransactionDto,
    systemPayments: any[],
    config: ReconciliationConfigDto
  ): Promise<ReconciliationResultDto> {
    const result: ReconciliationResultDto = {
      id: this.generateReconciliationId(),
      bankTransaction,
      status: ReconciliationStatus.UNMATCHED,
      processedAt: new Date().toISOString(),
      confidence: 0,
      suggestions: []
    };

    // 1. Búsqueda exacta por monto y fecha
    const exactMatches = this.findExactMatches(bankTransaction, systemPayments, config);
    if (exactMatches.length === 1) {
      result.systemPayment = exactMatches[0];
      result.status = ReconciliationStatus.MATCHED;
      result.confidence = 1.0;
      result.reason = 'Coincidencia exacta por monto y fecha';
      return result;
    }

    // 2. Búsqueda por tolerancia de monto
    const amountMatches = this.findAmountMatches(bankTransaction, systemPayments, config);
    if (amountMatches.length === 1) {
      result.systemPayment = amountMatches[0];
      result.status = ReconciliationStatus.MATCHED;
      result.confidence = 0.9;
      result.reason = 'Coincidencia por monto con tolerancia';
      return result;
    }

    // 3. Búsqueda por referencia o descripción
    const referenceMatches = this.findReferenceMatches(bankTransaction, systemPayments);
    if (referenceMatches.length === 1) {
      result.systemPayment = referenceMatches[0];
      result.status = ReconciliationStatus.MATCHED;
      result.confidence = 0.8;
      result.reason = 'Coincidencia por referencia';
      return result;
    }

    // 4. Múltiples coincidencias - requiere revisión manual
    if (exactMatches.length > 1 || amountMatches.length > 1) {
      result.status = ReconciliationStatus.MANUAL_REVIEW;
      result.suggestions = [...exactMatches, ...amountMatches].slice(0, 5);
      result.reason = 'Múltiples coincidencias encontradas';
      result.confidence = 0.5;
      return result;
    }

    // 5. Búsqueda parcial - coincidencias aproximadas
    const partialMatches = this.findPartialMatches(bankTransaction, systemPayments, config);
    if (partialMatches.length > 0) {
      result.status = ReconciliationStatus.PARTIALLY_MATCHED;
      result.suggestions = partialMatches.slice(0, 3);
      result.reason = 'Coincidencias parciales encontradas';
      result.confidence = 0.3;
      return result;
    }

    // 6. Sin coincidencias
    result.reason = 'No se encontraron coincidencias';
    return result;
  }

  /**
   * Busca coincidencias exactas por monto y fecha
   */
  private findExactMatches(
    bankTransaction: BankTransactionDto,
    systemPayments: any[],
    config: ReconciliationConfigDto
  ): any[] {
    const transactionDate = new Date(bankTransaction.date);
    const dateTolerance = config.dateTolerance || 1; // días

    return systemPayments.filter(payment => {
      const paymentDate = new Date(payment.date);
      const daysDiff = Math.abs((transactionDate.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24));
      
      return (
        Math.abs(parseFloat(payment.amount) - bankTransaction.amount) < 0.01 &&
        daysDiff <= dateTolerance
      );
    });
  }

  /**
   * Busca coincidencias por monto con tolerancia
   */
  private findAmountMatches(
    bankTransaction: BankTransactionDto,
    systemPayments: any[],
    config: ReconciliationConfigDto
  ): any[] {
    const amountTolerance = config.amountTolerance || 0.01;
    
    return systemPayments.filter(payment => {
      const amountDiff = Math.abs(parseFloat(payment.amount) - bankTransaction.amount);
      return amountDiff <= amountTolerance;
    });
  }

  /**
   * Busca coincidencias por referencia o descripción
   */
  private findReferenceMatches(
    bankTransaction: BankTransactionDto,
    systemPayments: any[]
  ): any[] {
    const searchTerms = [
      bankTransaction.reference,
      bankTransaction.transactionId,
      ...this.extractNumbersFromDescription(bankTransaction.description)
    ].filter(Boolean);

    return systemPayments.filter(payment => {
      const paymentText = `${payment.transactionId} ${payment.description}`.toLowerCase();
      return searchTerms.some(term => 
        paymentText.includes(term.toLowerCase())
      );
    });
  }

  /**
   * Busca coincidencias parciales usando algoritmos de similaridad
   */
  private findPartialMatches(
    bankTransaction: BankTransactionDto,
    systemPayments: any[],
    config: ReconciliationConfigDto
  ): any[] {
    const amountTolerance = (config.amountTolerance || 0.01) * 10; // Mayor tolerancia para parciales
    
    return systemPayments
      .filter(payment => {
        const amountDiff = Math.abs(parseFloat(payment.amount) - bankTransaction.amount);
        return amountDiff <= amountTolerance;
      })
      .map(payment => ({
        ...payment,
        similarity: this.calculateSimilarity(bankTransaction, payment)
      }))
      .filter(payment => payment.similarity > 0.3)
      .sort((a, b) => b.similarity - a.similarity);
  }

  /**
   * Procesa archivos CSV de extractos bancarios
   */
  private async parseCSVStatement(buffer: Buffer): Promise<BankTransactionDto[]> {
    return new Promise((resolve, reject) => {
      const csvString = buffer.toString('utf-8');
      
      Papa.parse(csvString, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const transactions = results.data.map((row: any, index: number) => 
              this.mapCSVRowToTransaction(row, index)
            ).filter(Boolean);
            resolve(transactions);
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => reject(error)
      });
    });
  }

  /**
   * Procesa archivos Excel de extractos bancarios
   */
  private async parseExcelStatement(buffer: Buffer): Promise<BankTransactionDto[]> {
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const [headers, ...rows] = jsonData as any[][];
      
      return rows
        .map((row, index) => this.mapExcelRowToTransaction(headers, row, index))
        .filter(Boolean);
    } catch (error) {
      throw new BadRequestException(`Error procesando archivo Excel: ${error.message}`);
    }
  }

  /**
   * Procesa archivos PDF de extractos bancarios (implementación básica)
   */
  private async parsePDFStatement(buffer: Buffer): Promise<BankTransactionDto[]> {
    // Implementación básica - en producción usar librerías como pdf-parse
    throw new BadRequestException('Procesamiento de PDF no implementado aún');
  }

  /**
   * Mapea una fila CSV a una transacción bancaria
   */
  private mapCSVRowToTransaction(row: any, index: number): BankTransactionDto | null {
    try {
      // Mapeo flexible basado en nombres comunes de columnas
      const date = row['Fecha'] || row['Date'] || row['fecha'] || row['FECHA'];
      const description = row['Descripción'] || row['Description'] || row['Concepto'] || row['DESCRIPCION'];
      const amount = row['Monto'] || row['Amount'] || row['Valor'] || row['MONTO'];
      const type = row['Tipo'] || row['Type'] || row['Movimiento'] || row['TIPO'];
      
      if (!date || !description || !amount) {
        this.logger.warn(`Fila ${index + 1} omitida por datos faltantes`);
        return null;
      }

      return {
        transactionId: row['ID'] || row['Referencia'] || `CSV_${index + 1}`,
        date: this.parseDate(date),
        description: description.toString(),
        amount: parseFloat(amount.toString().replace(/[^\d.-]/g, '')),
        type: this.parseTransactionType(type),
        reference: row['Referencia'] || row['Reference'] || undefined,
        account: row['Cuenta'] || row['Account'] || undefined
      };
    } catch (error) {
      this.logger.warn(`Error procesando fila ${index + 1}: ${error.message}`);
      return null;
    }
  }

  /**
   * Mapea una fila Excel a una transacción bancaria
   */
  private mapExcelRowToTransaction(headers: string[], row: any[], index: number): BankTransactionDto | null {
    try {
      const rowData: any = {};
      headers.forEach((header, i) => {
        rowData[header] = row[i];
      });
      
      return this.mapCSVRowToTransaction(rowData, index);
    } catch (error) {
      this.logger.warn(`Error procesando fila Excel ${index + 1}: ${error.message}`);
      return null;
    }
  }

  /**
   * Obtiene los pagos del sistema para un período específico
   */
  private async getSystemPayments(
    residentialComplexId: string,
    schemaName: string,
    periodStart?: string,
    periodEnd?: string
  ): Promise<any[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const whereClause: any = {
      user: {
        properties: {
          some: {
            residentialComplexId
          }
        }
      }
    };

    if (periodStart && periodEnd) {
      whereClause.date = {
        gte: new Date(periodStart),
        lte: new Date(periodEnd)
      };
    }

    return await prisma.payment.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        fees: {
          select: {
            id: true,
            title: true,
            amount: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
  }

  /**
   * Guarda el resultado de conciliación en la base de datos
   */
  private async saveReconciliationResult(
    result: ReconciliationResultDto,
    residentialComplexId: string,
    schemaName: string
  ): Promise<void> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);
      const reconciliationData = {
        id: result.id,
        transactionId: result.bankTransaction.transactionId,
        date: new Date(result.bankTransaction.date),
        description: result.bankTransaction.description,
        amount: result.bankTransaction.amount,
        type: result.bankTransaction.type,
        reference: result.bankTransaction.reference,
        account: result.bankTransaction.account,
        status: result.status,
        paymentId: result.systemPayment?.id,
        confidence: result.confidence,
        reason: result.reason,
        suggestions: result.suggestions || [],
        residentialComplexId,
        processedAt: new Date(result.processedAt)
        
      };

      // Verificar si ya existe una conciliación con este transactionId
      const existingReconciliation = await prisma.bankReconciliation.findUnique({
        where: { transactionId: result.bankTransaction.transactionId }
      });

      if (existingReconciliation) {
        // Actualizar la conciliación existente
        await prisma.bankReconciliation.update({
          where: { id: existingReconciliation.id },
          data: {
            status: reconciliationData.status,
            paymentId: reconciliationData.paymentId,
            confidence: reconciliationData.confidence,
            reason: reconciliationData.reason,
            suggestions: reconciliationData.suggestions,
            processedAt: reconciliationData.processedAt
          }
        });
        
        this.logger.log(`Actualizando conciliación existente: ${result.id}`);
      } else {
        // Crear nueva conciliación
        await prisma.bankReconciliation.create({
          data: reconciliationData
        });
        
        this.logger.log(`Guardando nueva conciliación: ${result.id}`);
      }
    } catch (error) {
      this.logger.error(`Error guardando resultado: ${error.message}`);
      // No lanzamos excepción para no interrumpir el proceso de conciliación
    }
  }

  /**
   * Conciliación manual de transacciones
   */
  async manualReconciliation(dto: ManualReconciliationDto, userId: string, schemaName: string): Promise<ReconciliationResultDto> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);
      // Validar que la transacción bancaria y el pago existan
      const payment = await prisma.payment.findUnique({
        where: { id: dto.paymentId }
      });

      if (!payment) {
        throw new NotFoundException('Pago no encontrado');
      }

      // Crear resultado de conciliación manual
      const result: ReconciliationResultDto = {
        id: this.generateReconciliationId(),
        bankTransaction: await this.getBankTransaction(dto.bankTransactionId, schemaName),
        systemPayment: payment,
        status: dto.confirmed ? ReconciliationStatus.MATCHED : ReconciliationStatus.MANUAL_REVIEW,
        confidence: 1.0,
        reason: 'Conciliación manual',
        processedAt: new Date().toISOString()
      };

      this.logger.log(`Conciliación manual completada para transacción ${dto.bankTransactionId}`);
      return result;
    } catch (error) {
      this.logger.error(`Error en conciliación manual: ${error.message}`);
      throw new BadRequestException(`Error en conciliación manual: ${error.message}`);
    }
  }

  /**
   * Obtiene estadísticas de conciliación
   */
  async getReconciliationStats(
    residentialComplexId: string,
    schemaName: string,
    periodStart?: string,
    periodEnd?: string
  ): Promise<ReconciliationStatsDto> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);
      
      const whereClause: any = {
        residentialComplexId
      };

      if (periodStart && periodEnd) {
        whereClause.createdAt = {
          gte: new Date(periodStart),
          lte: new Date(periodEnd)
        };
      }

      // Contar transacciones por estado
      const totalTransactions = await prisma.bankReconciliation.count({ where: whereClause });
      
      const matchedTransactions = await prisma.bankReconciliation.count({
        where: { ...whereClause, status: 'MATCHED' }
      });
      
      const unmatchedTransactions = await prisma.bankReconciliation.count({
        where: { ...whereClause, status: 'UNMATCHED' }
      });
      
      const partiallyMatchedTransactions = await prisma.bankReconciliation.count({
        where: { ...whereClause, status: 'PARTIALLY_MATCHED' }
      });
      
      const manualReviewTransactions = await prisma.bankReconciliation.count({
        where: { ...whereClause, status: 'MANUAL_REVIEW' }
      });

      // Calcular montos
      const totalAmountResult = await prisma.bankReconciliation.aggregate({
        where: whereClause,
        _sum: { amount: true }
      });
      
      const matchedAmountResult = await prisma.bankReconciliation.aggregate({
        where: { ...whereClause, status: 'MATCHED' },
        _sum: { amount: true }
      });
      
      const unmatchedAmountResult = await prisma.bankReconciliation.aggregate({
        where: { ...whereClause, status: 'UNMATCHED' },
        _sum: { amount: true }
      });

      const totalAmount = totalAmountResult._sum.amount || 0;
      const matchedAmount = matchedAmountResult._sum.amount || 0;
      const unmatchedAmount = unmatchedAmountResult._sum.amount || 0;
      
      // Calcular precisión
      const matchingAccuracy = totalTransactions > 0 ? (matchedTransactions / totalTransactions) * 100 : 0;

    return {
      totalTransactions,
        processedTransactions: totalTransactions,
        matchedTransactions,
        unmatchedTransactions,
        partiallyMatchedTransactions,
        manualReviewTransactions,
        totalAmount,
        matchedAmount,
        unmatchedAmount,
        matchingAccuracy
      };
    } catch (error) {
      this.logger.error(`Error obteniendo estadísticas: ${error.message}`);
      throw new BadRequestException(`Error obteniendo estadísticas: ${error.message}`);
    }
  /**
   * Filtrar resultados de conciliación
   */
  async getReconciliationResults(
    filter: ReconciliationFilterDto,
    schemaName: string
  ): Promise<ReconciliationResultDto[]> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);
      
      const whereClause: any = {};
      
      if (filter.startDate && filter.endDate) {
        whereClause.date = {
          gte: new Date(filter.startDate),
          lte: new Date(filter.endDate)
        };
      }
      
      if (filter.status) {
        whereClause.status = filter.status;
      }
      
      if (filter.bankName) {
        whereClause.bankName = {
          contains: filter.bankName,
          mode: 'insensitive'
        };
      }

      const page = filter.page || 1;
      const limit = filter.limit || 10;
      const skip = (page - 1) * limit;

      const reconciliations = await prisma.bankReconciliation.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          payment: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          },
          processedBy: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return reconciliations.map(rec => ({
        id: rec.id,
        bankTransaction: {
          transactionId: rec.transactionId,
          date: rec.date.toISOString(),
          description: rec.description,
          amount: rec.amount,
          type: rec.type as any,
          reference: rec.reference,
          account: rec.account
        },
        systemPayment: rec.payment,
        status: rec.status as any,
        confidence: rec.confidence,
        reason: rec.reason,
        suggestions: rec.suggestions as any[],
        processedAt: rec.processedAt?.toISOString() || rec.createdAt.toISOString()
      }));
    } catch (error) {
      this.logger.error(`Error obteniendo resultados: ${error.message}`);
      throw new BadRequestException(`Error obteniendo resultados: ${error.message}`);
    }
  }
    /**
   * Filtrar resultados de conciliación
   */
   async bulkReconciliation(
    dto: BulkReconciliationDto, 
    userId: string,
    schemaName: string
  ): Promise<{ success: number; failed: number }> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);
      let success = 0;
      let failed = 0;

      for (const reconciliationId of dto.reconciliationIds) {
        try {
          // Buscar la conciliación existente
          const reconciliation = await prisma.bankReconciliation.findUnique({
            where: { id: reconciliationId }
          });

          if (!reconciliation) {
            failed++;
            this.logger.warn(`Conciliación no encontrada: ${reconciliationId}`);
            continue;
          }

          // Aplicar acción según el tipo
          let updateData: any = {
            processedById: userId,
            processedAt: new Date()
          };

          switch (dto.action) {
            case 'approve':
              if (reconciliation.status === 'MANUAL_REVIEW' || reconciliation.status === 'PARTIALLY_MATCHED') {
                updateData.status = 'MATCHED';
                updateData.confidence = 1.0;
                updateData.reason = 'Aprobado manualmente en lote';
              }
              break;
              
            case 'reject':
              updateData.status = 'UNMATCHED';
              updateData.reason = 'Rechazado manualmente en lote';
              updateData.confidence = 0.0;
              break;
              
            case 'review':
              updateData.status = 'MANUAL_REVIEW';
              updateData.reason = 'Marcado para revisión manual';
              break;
              
            default:
              failed++;
              this.logger.warn(`Acción inválida: ${dto.action}`);
              continue;
          }

          if (dto.notes) {
            updateData.notes = dto.notes;
          }

          // Actualizar la conciliación
          await prisma.bankReconciliation.update({
            where: { id: reconciliationId },
            data: updateData
          });

          success++;
          this.logger.log(`Conciliación procesada: ${reconciliationId} - ${dto.action}`);
        } catch (error) {
          failed++;
          this.logger.error(`Error procesando ${reconciliationId}: ${error.message}`);
        }
      }

      this.logger.log(`Procesamiento en lote completado: ${success} éxitos, ${failed} fallos`);
      return { success, failed };
    } catch (error) {
      this.logger.error(`Error en procesamiento en lote: ${error.message}`);
      throw new BadRequestException(`Error en procesamiento en lote: ${error.message}`);
    }
  }
  // Métodos auxiliares privados

  private getDefaultConfig(): ReconciliationConfigDto {
    return {
      amountTolerance: 0.01,
      dateTolerance: 3,
      autoMatch: true,
      matchingRules: ['exact_amount_date', 'amount_tolerance', 'reference_match']
    };
  }

  private generateReconciliationId(): string {
    return `REC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateReference(transaction: BankTransactionDto): string {
    return `${transaction.transactionId}_${new Date(transaction.date).getTime()}`;
  }

  private parseDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Intentar diferentes formatos
        const formats = [
          /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // DD/MM/YYYY
          /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // YYYY-MM-DD
          /^(\d{1,2})-(\d{1,2})-(\d{4})$/ // DD-MM-YYYY
        ];
        
        for (const format of formats) {
          const match = dateString.match(format);
          if (match) {
            // Ajustar según el formato
            const [, part1, part2, part3] = match;
            const parsedDate = new Date(`${part3}-${part2}-${part1}`);
            if (!isNaN(parsedDate.getTime())) {
              return parsedDate.toISOString();
            }
          }
        }
        throw new Error(`Formato de fecha no válido: ${dateString}`);
      }
      return date.toISOString();
    } catch (error) {
      throw new BadRequestException(`Error parseando fecha: ${dateString}`);
    }
  }

  private parseTransactionType(type: string): BankTransactionType {
    if (!type) return BankTransactionType.CREDIT;
    
    const typeString = type.toString().toLowerCase();
    if (typeString.includes('débito') || typeString.includes('debit') || typeString.includes('salida')) {
      return BankTransactionType.DEBIT;
    }
    return BankTransactionType.CREDIT;
  }

  private extractNumbersFromDescription(description: string): string[] {
    const numbers = description.match(/\d+/g) || [];
    return numbers.filter(num => num.length >= 4); // Solo números significativos
  }

  private calculateSimilarity(bankTransaction: BankTransactionDto, payment: any): number {
    let similarity = 0;
    let factors = 0;

    // Factor de monto (peso: 40%)
    const amountDiff = Math.abs(bankTransaction.amount - parseFloat(payment.amount));
    const amountSimilarity = Math.max(0, 1 - (amountDiff / Math.max(bankTransaction.amount, parseFloat(payment.amount))));
    similarity += amountSimilarity * 0.4;
    factors += 0.4;

    // Factor de fecha (peso: 30%)
    const daysDiff = Math.abs(
      (new Date(bankTransaction.date).getTime() - new Date(payment.date).getTime()) / (1000 * 60 * 60 * 24)
    );
    const dateSimilarity = Math.max(0, 1 - (daysDiff / 30)); // 30 días máximo
    similarity += dateSimilarity * 0.3;
    factors += 0.3;

    // Factor de descripción (peso: 30%)
    const descSimilarity = this.calculateTextSimilarity(
      bankTransaction.description,
      payment.description || ''
    );
    similarity += descSimilarity * 0.3;
    factors += 0.3;

    return factors > 0 ? similarity / factors : 0;
  }

  private calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = Math.max(words1.length, words2.length);
    
    return totalWords > 0 ? commonWords.length / totalWords : 0;
  }

  private async getBankTransaction(transactionId: string, schemaName: string): Promise<BankTransactionDto> {
      try {
        const prisma = this.prisma.getTenantDB(schemaName);
        
        // Buscar la transacción bancaria en la base de datos
        const bankTransaction = await prisma.bankReconciliation.findUnique({
          where: { transactionId }
        });
        
        if (bankTransaction) {
          return {
            transactionId: bankTransaction.transactionId,
            date: bankTransaction.date.toISOString(),
            description: bankTransaction.description,
            amount: bankTransaction.amount,
            type: bankTransaction.type as BankTransactionType,
            reference: bankTransaction.reference,
            account: bankTransaction.account
          };
        }
        
        // Si no se encuentra, retornar una transacción básica
        this.logger.warn(`Transacción bancaria no encontrada: ${transactionId}`);
        return {
          transactionId,
          date: new Date().toISOString(),
          description: 'Transacción bancaria no encontrada',
          amount: 0,
          type: BankTransactionType.CREDIT
        };
      } catch (error) {
        this.logger.error(`Error obteniendo transacción bancaria: ${error.message}`);
        
        // Retornar transacción por defecto en caso de error
        return {
          transactionId,
          date: new Date().toISOString(),
          description: 'Error obteniendo transacción bancaria',
          amount: 0,
          type: BankTransactionType.CREDIT
        };
      }
    } 