import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  CreateResidentialComplexDto,
  UpdateResidentialComplexDto,
  ResidentialComplexDto,
} from '../common/dto/residential-complex.dto.js';

@Injectable()
export class ResidentialComplexService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async createComplexAndSchema(
    data: CreateResidentialComplexDto,
    prismaClient?: any,
  ): Promise<ResidentialComplexDto> {
    const prisma = prismaClient || this.prisma;
    const newComplex = await prisma.residentialComplex.create({ data });
    const schemaName = `complex_${newComplex.id}`;
    return prisma.residentialComplex.update({
      where: { id: newComplex.id },
      data: { schemaName },
    });
  }

  async getResidentialComplexes(): Promise<ResidentialComplexDto[]> {
    const prisma = this.prisma;
    return prisma.residentialComplex.findMany();
  }

  async getResidentialComplexById(id: number): Promise<ResidentialComplexDto> {
    const prisma = this.prisma;
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
    const prisma = this.prisma;
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
    const prisma = this.prisma;
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