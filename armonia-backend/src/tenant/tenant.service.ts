import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';

@Injectable()
export class TenantService {
  constructor(
    private prismaClientManager: PrismaClientManager,
  ) {}

  async getTenantSchemaName(complexId: number): Promise<string | null> {
    const prisma = this.prismaClientManager.getClient('default');
    const complex = await prisma.residentialComplex.findUnique({
      where: { id: complexId },
      select: { schemaName: true },
    });
    return complex ? complex.schemaName : null;
  }
}