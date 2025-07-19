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
    private prisma: PrismaService,
  ) {}

  async createResidentialComplex(
    data: CreateResidentialComplexDto,
  ): Promise<ResidentialComplexDto> {
    return this.prisma.residentialComplex.create({ data });
  }

  async getResidentialComplexes(): Promise<ResidentialComplexDto[]> {
    return this.prisma.residentialComplex.findMany();
  }

  async getResidentialComplexById(
    id: number,
  ): Promise<ResidentialComplexDto> {
    const complex = await this.prisma.residentialComplex.findUnique({
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
    const complex = await this.prisma.residentialComplex.findUnique({
      where: { id },
    });
    if (!complex) {
      throw new NotFoundException(
        `Residential Complex with ID ${id} not found`,
      );
    }
    return this.prisma.residentialComplex.update({ where: { id }, data });
  }

  async deleteResidentialComplex(id: number): Promise<void> {
    const complex = await this.prisma.residentialComplex.findUnique({
      where: { id },
    });
    if (!complex) {
      throw new NotFoundException(
        `Residential Complex with ID ${id} not found`,
      );
    }
    await this.prisma.residentialComplex.delete({ where: { id } });
  }
}
