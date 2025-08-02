import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateResidentialComplexDto,
  UpdateResidentialComplexDto,
  ResidentialComplexDto,
} from '../common/dto/residential-complex.dto';

@Injectable()
export class ResidentialComplexService {
  constructor(private prisma: PrismaService) {}

  async createComplexAndSchema(
    data: CreateResidentialComplexDto,
    prismaClient?: any,
  ): Promise<ResidentialComplexDto> {
    const prisma = this.prisma.getTenantDB('public');
    const newComplex = await prisma.residentialComplex.create({ data });
    return newComplex;
  }

  async getResidentialComplexes(): Promise<ResidentialComplexDto[]> {
    const prisma = this.prisma.getTenantDB('public');
    return prisma.residentialComplex.findMany();
  }

  async getResidentialComplexById(id: string): Promise<ResidentialComplexDto> {
    const prisma = this.prisma.getTenantDB('public');
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
    id: string,
    data: UpdateResidentialComplexDto,
  ): Promise<ResidentialComplexDto> {
    const prisma = this.prisma.getTenantDB('public');
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

  async deleteResidentialComplex(id: string): Promise<void> {
    const prisma = this.prisma.getTenantDB('public');
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