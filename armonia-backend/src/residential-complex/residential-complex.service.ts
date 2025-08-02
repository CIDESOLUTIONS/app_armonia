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

  private mapToResidentialComplexDto(complex: any): ResidentialComplexDto {
    return {
      id: complex.id,
      name: complex.name,
      address: complex.address,
      city: complex.city,
      country: complex.country,
      planId: complex.planId,
      schemaName: complex.id, // Assuming schemaName is the complex ID
      adminId: complex.adminId, // Assuming adminId exists in the model
      contactEmail: complex.contactEmail, // Assuming contactEmail exists in the model
      contactPhone: complex.contactPhone, // Assuming contactPhone exists in the model
      status: complex.status, // Assuming status exists in the model
      createdAt: complex.createdAt,
      updatedAt: complex.updatedAt,
    };
  }

  async createComplexAndSchema(
    data: CreateResidentialComplexDto,
    prismaClient?: any,
  ): Promise<ResidentialComplexDto> {
    const prisma = this.prisma.getTenantDB('public');
    const newComplex = await prisma.residentialComplex.create({
      data: {
        name: data.name,
        address: data.address,
        city: data.city,
        country: data.country,
        plan: { connect: { id: data.planId } },
        // Assuming adminId, contactEmail, contactPhone, status are handled elsewhere or are optional
      },
    });
    return this.mapToResidentialComplexDto(newComplex);
  }

  async getResidentialComplexes(): Promise<ResidentialComplexDto[]> {
    const prisma = this.prisma.getTenantDB('public');
    const complexes = await prisma.residentialComplex.findMany();
    return complexes.map(this.mapToResidentialComplexDto);
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
    return this.mapToResidentialComplexDto(complex);
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
    const updatedComplex = await prisma.residentialComplex.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        city: data.city,
        country: data.country,
        ...(data.planId && { plan: { connect: { id: data.planId } } }),
        // Assuming adminId, contactEmail, contactPhone, status are handled elsewhere or are optional
      },
    });
    return this.mapToResidentialComplexDto(updatedComplex);
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
