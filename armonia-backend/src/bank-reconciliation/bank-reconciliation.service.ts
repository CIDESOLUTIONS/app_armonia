import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import * as XLSX from 'xlsx';

@Injectable()
export class BankReconciliationService {
  constructor(
    private prisma: PrismaService,
    private prismaClientManager: PrismaClientManager,
  ) {}

  private getTenantPrismaClient(schemaName: string) {
    return this.prismaClientManager.getClient(schemaName);
  }

  async processBankStatement(schemaName: string, fileBuffer: Buffer, mimetype: string, complexId: number) {
    const prisma = this.getTenantPrismaClient(schemaName);
    let workbook;

    if (mimetype === 'text/csv') {
      workbook = XLSX.read(fileBuffer.toString('utf8'), { type: 'string' });
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    } else {
      throw new Error('Unsupported file type');
    }

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const processedEntries = [];

    for (const row of jsonData) {
      // Asumiendo un formato simple: Fecha, Descripción, Monto, Tipo (Ingreso/Egreso)
      const date = new Date(row['Fecha']);
      const description = row['Descripción'];
      const amount = parseFloat(row['Monto']);
      const type = row['Tipo']; // 'Ingreso' o 'Egreso'

      // Aquí se podría añadir lógica para identificar transacciones y sugerir conciliaciones
      // Por ahora, solo almacenaremos la entrada del extracto
      const entry = await prisma.bankStatementEntry.create({
        data: {
          complexId,
          date,
          description,
          amount,
          type,
          raw_data: JSON.stringify(row),
        },
      });
      processedEntries.push(entry);
    }

    return {
      message: `Processed ${processedEntries.length} entries.`,
      processedEntries,
    };
  }
}