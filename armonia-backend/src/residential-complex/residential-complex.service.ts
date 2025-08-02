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
      isActive: complex.isActive,
      createdAt: complex.createdAt,
      updatedAt: complex.updated0At,
      status: complex.status,
      adminId: complex.adminId,
      contactEmail: complex.contactEmail,
      contactPhone: complex.contactPhone,
      logoUrl: complex.logoUrl,
      primaryColor: complex.primaryColor,
      secondaryColor: complex.secondaryColor,
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
        status: data.status,
        admin: data.adminId ? { connect: { id: data.adminId } } : undefined,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        logoUrl: data.logoUrl,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        isActive: data.isActive,
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
        status: data.status,
        admin: data.adminId ? { connect: { id: data.adminId } } : undefined,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        logoUrl: data.logoUrl,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        isActive: data.isActive,
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