import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateServiceProviderDto,
  UpdateServiceProviderDto,
  ServiceProviderDto,
  ServiceProviderFilterParamsDto,
  CreateReviewDto,
  ReviewDto,
} from '../common/dto/service-providers.dto';

@Injectable()
export class ServiceProvidersService {
  constructor(private prisma: PrismaService) {}

  private mapToServiceProviderDto(provider: any): ServiceProviderDto {
    return {
      id: provider.id,
      name: provider.name,
      service: provider.service,
      phone: provider.phone,
      email: provider.email,
      residentialComplexId: provider.residentialComplexId,
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt,
    };
  }

  private mapToReviewDto(review: any): ReviewDto {
    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      serviceProviderId: review.serviceProviderId,
      userId: review.userId,
      createdAt: review.createdAt,
      userName: review.user?.name, // Assuming user relation is included and has a name field
    };
  }

  async createServiceProvider(
    schemaName: string,
    data: CreateServiceProviderDto,
  ): Promise<ServiceProviderDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const serviceProvider = await prisma.serviceProvider.create({
      data: {
        name: data.name,
        service: data.service,
        phone: data.phone,
        email: data.email,
        residentialComplex: { connect: { id: data.residentialComplexId } },
      },
    });
    return this.mapToServiceProviderDto(serviceProvider);
  }

  async getServiceProviders(
    schemaName: string,
    filters: ServiceProviderFilterParamsDto,
  ): Promise<ServiceProviderDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { service: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters.category) {
      where.category = filters.category;
    }

    const serviceProviders = await prisma.serviceProvider.findMany({
      where,
      skip: ((filters.page ?? 1) - 1) * (filters.limit ?? 10),
      take: filters.limit ?? 10,
      orderBy: { name: 'asc' },
    });
    return serviceProviders.map(this.mapToServiceProviderDto);
  }

  async getServiceProviderById(
    schemaName: string,
    id: string,
  ): Promise<ServiceProviderDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const provider = await prisma.serviceProvider.findUnique({ where: { id } });
    if (!provider) {
      throw new NotFoundException(
        `Proveedor de servicios con ID ${id} no encontrado.`,
      );
    }
    return this.mapToServiceProviderDto(provider);
  }

  async updateServiceProvider(
    schemaName: string,
    id: string,
    data: UpdateServiceProviderDto,
  ): Promise<ServiceProviderDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const provider = await prisma.serviceProvider.findUnique({ where: { id } });

    if (!provider) {
      throw new NotFoundException(
        `Proveedor de servicios con ID ${id} no encontrado.`,
      );
    }

    const updatedProvider = await prisma.serviceProvider.update({
      where: { id },
      data: {
        name: data.name,
        service: data.service,
        phone: data.phone,
        email: data.email,
        ...(data.residentialComplexId && { residentialComplex: { connect: { id: data.residentialComplexId } } }),
      },
    });
    return this.mapToServiceProviderDto(updatedProvider);
  }

  async deleteServiceProvider(schemaName: string, id: string): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);
    await prisma.serviceProvider.delete({ where: { id } });
  }

  async addReview(
    schemaName: string,
    serviceProviderId: string,
    userId: string,
    data: CreateReviewDto,
  ): Promise<ReviewDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const review = await prisma.review.create({
      data: {
        serviceProvider: { connect: { id: serviceProviderId } },
        user: { connect: { id: userId } },
        rating: data.rating,
        comment: data.comment,
      },
      include: { user: true }, // Include user to map userName
    });

    return this.mapToReviewDto(review);
  }

  async getReviewsByServiceProvider(
    schemaName: string,
    serviceProviderId: string,
  ): Promise<ReviewDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const reviews = await prisma.review.findMany({
      where: { serviceProviderId },
      include: { user: true }, // Include user to map userName
      orderBy: { createdAt: 'desc' },
    });
    return reviews.map(this.mapToReviewDto);
  }
}
