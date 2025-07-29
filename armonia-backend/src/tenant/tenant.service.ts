import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  async getTenantSchemaName(complexId: number): Promise<string | null> {
    const prisma = this.prisma;
    const complex = await prisma.residentialComplex.findUnique({
      where: { id: complexId },
      select: { schemaName: true },
    });
    return complex ? complex.schemaName : null;
  }
}
