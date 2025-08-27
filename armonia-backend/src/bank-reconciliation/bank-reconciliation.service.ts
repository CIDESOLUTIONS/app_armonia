import { Injectable, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Decimal } from 'decimal.js';
import {
  BankTransactionDto,
  ReconciliationResultDto,
  ManualReconciliationDto,
  ReconciliationConfigDto,
  ReconciliationFilterDto,
  ReconciliationStatus,
  BankTransactionType,
  BankStatementUploadDto,
} from '@armonia-backend/common/dto/bank-reconciliation.dto';
import {
  ProcessReconciliationDto,
  ReconciliationStatsDto,
  BulkReconciliationDto,
} from './dto/reconciliation-process.dto';
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';

@Injectable()
export class BankReconciliationService {
  private readonly logger = new Logger(BankReconciliationService.name);

  constructor(private prisma: PrismaService) {}

  async uploadBankStatement(
    file: Express.Multer.File,
    uploadDto: BankStatementUploadDto,
    residentialComplexId: string,
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

      transactions = transactions.map((transaction) => ({
        ...transaction,
        account: uploadDto.accountNumber || transaction.account,
        reference: transaction.reference || this.generateReference(transaction),
      }));

      this.logger.log(`Se procesaron ${transactions.length} transacciones`);
      return transactions;
    } catch (error) {
      this.logger.error(`Error procesando extracto bancario: ${error.message}`);
      throw new BadRequestException(`Error procesando archivo: ${error.message}`);
    }
  }

  async reconcileTransactions(dto: ProcessReconciliationDto, schemaName: string): Promise<ReconciliationResultDto[]> {
    try {
      this.logger.log(`Iniciando conciliación de ${dto.transactions.length} transacciones`);

      const results: ReconciliationResultDto[] = [];
      const config = dto.config || this.getDefaultConfig();

      const systemPayments = await this.getSystemPayments(
        dto.residentialComplexId,
        schemaName,
        dto.periodStart,
        dto.periodEnd,
      );

      this.logger.log(`Encontrados ${systemPayments.length} pagos en el sistema`);

      for (const transaction of dto.transactions) {
        const result = await this.matchTransaction(transaction, systemPayments, config);
        results.push(result);
        await this.saveReconciliationResult(result, dto.residentialComplexId, schemaName);
      }

      this.logger.log(`Conciliación completada. ${results.length} resultados generados`);
      return results;
    } catch (error) {
      this.logger.error(`Error en conciliación: ${error.message}`);
      throw new BadRequestException(`Error en conciliación: ${error.message}`);
    }
  }

  private async matchTransaction(
    bankTransaction: BankTransactionDto,
    systemPayments: any[],
    config: ReconciliationConfigDto,
  ): Promise<ReconciliationResultDto> {
    const result: ReconciliationResultDto = {
      id: this.generateReconciliationId(),
      bankTransaction,
      status: ReconciliationStatus.UNMATCHED,
      processedAt: new Date().toISOString(),
      confidence: new Prisma.Decimal(0),
      suggestions: [],
    };

    const exactMatches = this.findExactMatches(bankTransaction, systemPayments, config);
    if (exactMatches.length === 1) {
      result.systemPayment = exactMatches[0];
      result.status = ReconciliationStatus.MATCHED;
      result.confidence = new Prisma.Decimal(1.0);
      result.reason = 'Coincidencia exacta por monto y fecha';
      return result;
    }

    const amountMatches = this.findAmountMatches(bankTransaction, systemPayments, config);
    if (amountMatches.length === 1) {
      result.systemPayment = amountMatches[0];
      result.status = ReconciliationStatus.MATCHED;
      result.confidence = new Prisma.Decimal(0.9);
      result.reason = 'Coincidencia por monto con tolerancia';
      return result;
    }

    const referenceMatches = this.findReferenceMatches(bankTransaction, systemPayments);
    if (referenceMatches.length === 1) {
      result.systemPayment = referenceMatches[0];
      result.status = ReconciliationStatus.MATCHED;
      result.confidence = new Prisma.Decimal(0.8);
      result.reason = 'Coincidencia por referencia';
      return result;
    }

    if (exactMatches.length > 1 || amountMatches.length > 1) {
      result.status = ReconciliationStatus.MANUAL_REVIEW;
      result.suggestions = [...exactMatches, ...amountMatches].slice(0, 5);
      result.reason = 'Múltiples coincidencias encontradas';
      result.confidence = new Prisma.Decimal(0.5);
      return result;
    }

    const partialMatches = this.findPartialMatches(bankTransaction, systemPayments, config);
    if (partialMatches.length > 0) {
      result.status = ReconciliationStatus.PARTIALLY_MATCHED;
      result.suggestions = partialMatches.slice(0, 3);
      result.reason = 'Coincidencias parciales encontradas';
      result.confidence = new Prisma.Decimal(0.3);
      return result;
    }

    result.reason = 'No se encontraron coincidencias';
    return result;
  }

  private findExactMatches(
    bankTransaction: BankTransactionDto,
    systemPayments: any[],
    config: ReconciliationConfigDto,
  ): any[] {
    const transactionDate = new Date(bankTransaction.date);
    const dateTolerance = config.dateTolerance || 1;

    return systemPayments.filter((payment) => {
      const paymentDate = new Date(payment.date);
      const daysDiff = Math.abs((transactionDate.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24));
      const amountDiff = new Decimal(payment.amount).minus(bankTransaction.amount).abs();
      return amountDiff.lessThan(0.01) && daysDiff <= dateTolerance;
    });
  }

  private findAmountMatches(
    bankTransaction: BankTransactionDto,
    systemPayments: any[],
    config: ReconciliationConfigDto,
  ): any[] {
    const amountTolerance = new Decimal(config.amountTolerance || 0.01);

    return systemPayments.filter((payment) => {
      const amountDiff = new Decimal(payment.amount).minus(bankTransaction.amount).abs();
      return amountDiff.lessThanOrEqualTo(amountTolerance);
    });
  }

  private findReferenceMatches(bankTransaction: BankTransactionDto, systemPayments: any[]): any[] {
    const searchTerms = [
      bankTransaction.reference,
      bankTransaction.transactionId,
      ...this.extractNumbersFromDescription(bankTransaction.description),
    ].filter(Boolean);

    return systemPayments.filter((payment) => {
      const paymentText = `${payment.transactionId} ${payment.description}`.toLowerCase();
      return searchTerms.some((term) => paymentText.includes(term.toLowerCase()));
    });
  }

  private findPartialMatches(
    bankTransaction: BankTransactionDto,
    systemPayments: any[],
    config: ReconciliationConfigDto,
  ): any[] {
    const amountTolerance = new Decimal(config.amountTolerance || 0.01).times(10);

    return systemPayments
      .filter((payment) => {
        const amountDiff = new Decimal(payment.amount).minus(bankTransaction.amount).abs();
        return amountDiff.lessThanOrEqualTo(amountTolerance);
      })
      .map((payment) => ({
        ...payment,
        similarity: this.calculateSimilarity(bankTransaction, payment),
      }))
      .filter((payment) => payment.similarity > 0.3)
      .sort((a, b) => b.similarity - a.similarity);
  }

  private async parseCSVStatement(buffer: Buffer): Promise<BankTransactionDto[]> {
    return new Promise((resolve, reject) => {
      const csvString = buffer.toString('utf-8');
      Papa.parse(csvString, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const transactions = results.data
              .map((row: any, index: number) => this.mapRowToTransaction(row, index))
              .filter(Boolean) as BankTransactionDto[];
            resolve(transactions);
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => reject(error),
      });
    });
  }

  private async parseExcelStatement(buffer: Buffer): Promise<BankTransactionDto[]> {
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const [headers, ...rows] = jsonData as any[][];

      return rows
        .map((row, index) => {
          const rowData: any = {};
          headers.forEach((header, i) => {
            rowData[header] = row[i];
          });
          return this.mapRowToTransaction(rowData, index);
        })
        .filter(Boolean) as BankTransactionDto[];
    } catch (error) {
      throw new BadRequestException(`Error procesando archivo Excel: ${error.message}`);
    }
  }

  private async parsePDFStatement(buffer: Buffer): Promise<BankTransactionDto[]> {
    throw new BadRequestException('Procesamiento de PDF no implementado aún');
  }

  private mapRowToTransaction(row: any, index: number): BankTransactionDto | null {
    try {
      const date = row['Fecha'] || row['Date'] || row['fecha'] || row['FECHA'];
      const description = row['Descripción'] || row['Description'] || row['Concepto'] || row['DESCRIPCION'];
      const amount = row['Monto'] || row['Amount'] || row['Valor'] || row['MONTO'];
      const type = row['Tipo'] || row['Type'] || row['Movimiento'] || row['TIPO'];

      if (!date || !description || !amount) {
        this.logger.warn(`Fila ${index + 1} omitida por datos faltantes`);
        return null;
      }

      return {
        transactionId: row['ID'] || row['Referencia'] || `ROW_${index + 1}`,
        date: this.parseDate(date),
        description: description.toString(),
        amount: new Prisma.Decimal(amount.toString().replace(/[^\d.-]/g, '')),
        type: this.parseTransactionType(type),
        reference: row['Referencia'] || row['Reference'] || undefined,
        account: row['Cuenta'] || row['Account'] || undefined,
      };
    } catch (error) {
      this.logger.warn(`Error procesando fila ${index + 1}: ${error.message}`);
      return null;
    }
  }

  private async getSystemPayments(
    residentialComplexId: string,
    schemaName: string,
    periodStart?: string,
    periodEnd?: string,
  ): Promise<any[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const whereClause: Prisma.PaymentWhereInput = {
      user: {
        residentialComplexId,
      },
    };

    if (periodStart && periodEnd) {
      whereClause.date = {
        gte: new Date(periodStart),
        lte: new Date(periodEnd),
      };
    }

    return await prisma.payment.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, name: true, email: true } },
        fees: { select: { id: true, title: true, amount: true } },
      },
      orderBy: { date: 'desc' },
    });
  }

  private async saveReconciliationResult(
    result: ReconciliationResultDto,
    residentialComplexId: string,
    schemaName: string,
  ): Promise<void> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);
      const reconciliationData: Prisma.BankReconciliationCreateInput = {
        id: result.id,
        transactionId: result.bankTransaction.transactionId,
        date: new Date(result.bankTransaction.date),
        description: result.bankTransaction.description,
        amount: result.bankTransaction.amount,
        type: result.bankTransaction.type,
        reference: result.bankTransaction.reference,
        account: result.bankTransaction.account,
        status: result.status,
        payment: result.systemPayment ? { connect: { id: result.systemPayment.id } } : undefined,
        confidence: result.confidence,
        reason: result.reason,
        suggestions: result.suggestions || [],
        residentialComplex: { connect: { id: residentialComplexId } },
        processedAt: new Date(result.processedAt),
      };

      const existingReconciliation = await prisma.bankReconciliation.findUnique({
        where: { transactionId: result.bankTransaction.transactionId },
      });

      if (existingReconciliation) {
        await prisma.bankReconciliation.update({
          where: { id: existingReconciliation.id },
          data: {
            status: reconciliationData.status,
            paymentId: reconciliationData.payment?.connect?.id,
            confidence: reconciliationData.confidence,
            reason: reconciliationData.reason,
            suggestions: reconciliationData.suggestions,
            processedAt: reconciliationData.processedAt,
          },
        });
        this.logger.log(`Actualizando conciliación existente: ${result.id}`);
      } else {
        await prisma.bankReconciliation.create({ data: reconciliationData });
        this.logger.log(`Guardando nueva conciliación: ${result.id}`);
      }
    } catch (error) {
      this.logger.error(`Error guardando resultado: ${error.message}`);
    }
  }

  async manualReconciliation(
    dto: ManualReconciliationDto,
    userId: string,
    schemaName: string,
  ): Promise<ReconciliationResultDto> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);
      const payment = await prisma.payment.findUnique({ where: { id: dto.paymentId } });

      if (!payment) {
        throw new NotFoundException('Pago no encontrado');
      }

      const bankTransaction = await this.getBankTransaction(dto.bankTransactionId, schemaName);

      const result: ReconciliationResultDto = {
        id: this.generateReconciliationId(),
        bankTransaction,
        systemPayment: payment,
        status: dto.confirmed ? ReconciliationStatus.MATCHED : ReconciliationStatus.MANUAL_REVIEW,
        confidence: new Prisma.Decimal(1.0),
        reason: 'Conciliación manual',
        processedAt: new Date().toISOString(),
      };

      this.logger.log(`Conciliación manual completada para transacción ${dto.bankTransactionId}`);
      return result;
    } catch (error) {
      this.logger.error(`Error en conciliación manual: ${error.message}`);
      throw new BadRequestException(`Error en conciliación manual: ${error.message}`);
    }
  }

  async getReconciliationStats(
    residentialComplexId: string,
    schemaName: string,
    periodStart?: string,
    periodEnd?: string,
  ): Promise<ReconciliationStatsDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const whereClause: Prisma.BankReconciliationWhereInput = { residentialComplexId };

    if (periodStart && periodEnd) {
      whereClause.createdAt = { gte: new Date(periodStart), lte: new Date(periodEnd) };
    }

    const totalTransactions = await prisma.bankReconciliation.count({ where: whereClause });
    const matchedTransactions = await prisma.bankReconciliation.count({ where: { ...whereClause, status: ReconciliationStatus.MATCHED } });
    const unmatchedTransactions = await prisma.bankReconciliation.count({ where: { ...whereClause, status: ReconciliationStatus.UNMATCHED } });
    const partiallyMatchedTransactions = await prisma.bankReconciliation.count({ where: { ...whereClause, status: ReconciliationStatus.PARTIALLY_MATCHED } });
    const manualReviewTransactions = await prisma.bankReconciliation.count({ where: { ...whereClause, status: ReconciliationStatus.MANUAL_REVIEW } });

    const totalAmountResult = await prisma.bankReconciliation.aggregate({ where: whereClause, _sum: { amount: true } });
    const matchedAmountResult = await prisma.bankReconciliation.aggregate({ where: { ...whereClause, status: ReconciliationStatus.MATCHED }, _sum: { amount: true } });
    const unmatchedAmountResult = await prisma.bankReconciliation.aggregate({ where: { ...whereClause, status: ReconciliationStatus.UNMATCHED }, _sum: { amount: true } });

    const totalAmount = totalAmountResult._sum.amount || new Prisma.Decimal(0);
    const matchedAmount = matchedAmountResult._sum.amount || new Prisma.Decimal(0);
    const unmatchedAmount = unmatchedAmountResult._sum.amount || new Prisma.Decimal(0);

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
      matchingAccuracy,
    };
  }

  async getReconciliationResults(
    filter: ReconciliationFilterDto,
    schemaName: string,
  ): Promise<ReconciliationResultDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const whereClause: Prisma.BankReconciliationWhereInput = {};

    if (filter.startDate && filter.endDate) {
      whereClause.date = { gte: new Date(filter.startDate), lte: new Date(filter.endDate) };
    }
    if (filter.status) {
      whereClause.status = filter.status;
    }

    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const skip = (page - 1) * limit;

    const reconciliations = await prisma.bankReconciliation.findMany({
      where: whereClause,
      skip,
      take: limit,
      include: {
        payment: { include: { user: { select: { id: true, name: true, email: true } } } },
        processedBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reconciliations.map((rec) => ({
      id: rec.id,
      bankTransaction: {
        transactionId: rec.transactionId,
        date: rec.date.toISOString(),
        description: rec.description,
        amount: rec.amount,
        type: rec.type as BankTransactionType,
        reference: rec.reference,
        account: rec.account,
      },
      systemPayment: rec.payment,
      status: rec.status as ReconciliationStatus,
      confidence: rec.confidence,
      reason: rec.reason,
      suggestions: rec.suggestions as any[],
      processedAt: rec.processedAt?.toISOString() || rec.createdAt.toISOString(),
    }));
  }

  async bulkReconciliation(
    dto: BulkReconciliationDto,
    userId: string,
    schemaName: string,
  ): Promise<{ success: number; failed: number }> {
    const prisma = this.prisma.getTenantDB(schemaName);
    let success = 0;
    let failed = 0;

    for (const reconciliationId of dto.reconciliationIds) {
      try {
        const reconciliation = await prisma.bankReconciliation.findUnique({ where: { id: reconciliationId } });

        if (!reconciliation) {
          failed++;
          this.logger.warn(`Conciliación no encontrada: ${reconciliationId}`);
          continue;
        }

        let updateData: any = { processedById: userId, processedAt: new Date() };

        switch (dto.action) {
          case 'approve':
            if (reconciliation.status === ReconciliationStatus.MANUAL_REVIEW || reconciliation.status === ReconciliationStatus.PARTIALLY_MATCHED) {
              updateData.status = ReconciliationStatus.MATCHED;
              updateData.confidence = new Prisma.Decimal(1.0);
              updateData.reason = 'Aprobado manualmente en lote';
            }
            break;
          case 'reject':
            updateData.status = ReconciliationStatus.UNMATCHED;
            updateData.reason = 'Rechazado manualmente en lote';
            updateData.confidence = new Prisma.Decimal(0.0);
            break;
          case 'review':
            updateData.status = ReconciliationStatus.MANUAL_REVIEW;
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

        await prisma.bankReconciliation.update({ where: { id: reconciliationId }, data: updateData });
        success++;
        this.logger.log(`Conciliación procesada: ${reconciliationId} - ${dto.action}`);
      } catch (error) {
        failed++;
        this.logger.error(`Error procesando ${reconciliationId}: ${error.message}`);
      }
    }

    this.logger.log(`Procesamiento en lote completado: ${success} éxitos, ${failed} fallos`);
    return { success, failed };
  }

  private getDefaultConfig(): ReconciliationConfigDto {
    return {
      amountTolerance: new Prisma.Decimal(0.01),
      dateTolerance: 3,
      autoMatch: true,
      matchingRules: ['exact_amount_date', 'amount_tolerance', 'reference_match'],
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
        const formats = [/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, /^(\d{4})-(\d{1,2})-(\d{1,2})$/, /^(\d{1,2})-(\d{1,2})-(\d{4})$/];
        for (const format of formats) {
          const match = dateString.match(format);
          if (match) {
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
    return numbers.filter((num) => num.length >= 4);
  }

  private calculateSimilarity(bankTransaction: BankTransactionDto, payment: any): number {
    let similarity = 0;
    let factors = 0;

    const bankAmount = new Decimal(bankTransaction.amount);
    const paymentAmount = new Decimal(payment.amount);
    const amountDiff = bankAmount.minus(paymentAmount).abs();
    const maxAmount = Decimal.max(bankAmount, paymentAmount);
    const amountSimilarity = maxAmount.isZero() ? 1 : new Decimal(1).minus(amountDiff.dividedBy(maxAmount)).toNumber();
    similarity += Math.max(0, amountSimilarity) * 0.4;
    factors += 0.4;

    const daysDiff = Math.abs((new Date(bankTransaction.date).getTime() - new Date(payment.date).getTime()) / (1000 * 60 * 60 * 24));
    const dateSimilarity = Math.max(0, 1 - daysDiff / 30);
    similarity += dateSimilarity * 0.3;
    factors += 0.3;

    const descSimilarity = this.calculateTextSimilarity(bankTransaction.description, payment.description || '');
    similarity += descSimilarity * 0.3;
    factors += 0.3;

    return factors > 0 ? similarity / factors : 0;
  }

  private calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    const commonWords = words1.filter((word) => words2.includes(word));
    const totalWords = Math.max(words1.length, words2.length);
    return totalWords > 0 ? commonWords.length / totalWords : 0;
  }

  private async getBankTransaction(transactionId: string, schemaName: string): Promise<BankTransactionDto> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);
      const bankTransaction = await prisma.bankReconciliation.findUnique({ where: { transactionId } });

      if (bankTransaction) {
        return {
          transactionId: bankTransaction.transactionId,
          date: bankTransaction.date.toISOString(),
          description: bankTransaction.description,
          amount: bankTransaction.amount,
          type: bankTransaction.type as BankTransactionType,
          reference: bankTransaction.reference,
          account: bankTransaction.account,
        };
      }

      this.logger.warn(`Transacción bancaria no encontrada: ${transactionId}`);
      return {
        transactionId,
        date: new Date().toISOString(),
        description: 'Transacción bancaria no encontrada',
        amount: new Prisma.Decimal(0),
        type: BankTransactionType.CREDIT,
      };
    } catch (error) {
      this.logger.error(`Error obteniendo transacción bancaria: ${error.message}`);
      return {
        transactionId,
        date: new Date().toISOString(),
        description: 'Error obteniendo transacción bancaria',
        amount: new Prisma.Decimal(0),
        type: BankTransactionType.CREDIT,
      };
    }
  }
}