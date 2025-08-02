import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  async getTenantSchemaName(residentialComplexId: string): Promise<string | null> {
    const prisma = this.prisma.getTenantDB('public');
    const complex = await prisma.residentialComplex.findUnique({
      where: { id: complexId },
    });
    return complex ? complex.id : null;
  }
}