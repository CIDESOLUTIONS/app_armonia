import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateResidentialComplexDto,
  UpdateResidentialComplexDto,
  ResidentialComplexDto,
} from '../common/dto/residential-complex.dto';

@Injectable()
export class ResidentialComplexService {
  constructor(
    private prismaClientManager: PrismaClientManager,
    private prismaService: PrismaService, // Cambiado a prismaService
  ) {}

  async createComplexAndSchema(
    data: CreateResidentialComplexDto,
    prismaClient?: any,
  ): Promise<ResidentialComplexDto> {
    const prisma = prismaClient || this.prismaClientManager.getClient('default');
    const newComplex = await prisma.residentialComplex.create({ data });
    const schemaName = `complex_${newComplex.id}`;
    return prisma.residentialComplex.update({
      where: { id: newComplex.id },
      data: { schemaName },
    });
  }

  async getResidentialComplexes(): Promise<ResidentialComplexDto[]> {
    const prisma = this.prismaClientManager.getClient('default');
    return prisma.residentialComplex.findMany();
  }

  async getResidentialComplexById(id: number): Promise<ResidentialComplexDto> {
    const prisma = this.prismaClientManager.getClient('default');
    const complex = await prisma.residentialComplex.findUnique({
      where: { id },
    });
    if (!complex) {
      throw new NotFoundException(
        `Residential Complex with ID ${id} not found`,
      );
    }
    return complex;
  }

  async updateResidentialComplex(
    id: number,
    data: UpdateResidentialComplexDto,
  ): Promise<ResidentialComplexDto> {
    const prisma = this.prismaClientManager.getClient('default');
    const complex = await prisma.residentialComplex.findUnique({
      where: { id },
    });
    if (!complex) {
      throw new NotFoundException(
        `Residential Complex with ID ${id} not found`,
      );
    }
    return prisma.residentialComplex.update({ where: { id }, data });
  }

  async deleteResidentialComplex(id: number): Promise<void> {
    const prisma = this.prismaClientManager.getClient('default');
    const complex = await prisma.residentialComplex.findUnique({
      where: { id },
    });
    if (!complex) {
      throw new NotFoundException(
        `Residential Complex with ID ${id} not found`,
      );
    }
    await prisma.residentialComplex.delete({ where: { id } });
  }
}