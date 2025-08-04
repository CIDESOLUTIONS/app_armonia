import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Reverted to relative path

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  async getTenantSchemaName(residentialComplexId: string): Promise<string | null> {
    const prisma = this.prisma.getTenantDB('public');
    const complex = await prisma.residentialComplex.findUnique({
      where: { id: residentialComplexId },
    });
    return complex ? complex.id : null;
  }
}
