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

  async createServiceProvider(
    schemaName: string,
    data: CreateServiceProviderDto,
  ): Promise<ServiceProviderDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    return prisma.serviceProvider.create({
      data: { ...data, rating: 0, reviewCount: 0 },
    });
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
    if (filters.minRating) {
      where.rating = { gte: filters.minRating };
    }

    return prisma.serviceProvider.findMany({
      where,
      skip: ((filters.page ?? 1) - 1) * (filters.limit ?? 10),
      take: filters.limit ?? 10,
      orderBy: { name: 'asc' },
    });
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
    return provider;
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

    return prisma.serviceProvider.update({
      where: { id },
      data,
    });
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
        serviceProviderId,
        userId,
        rating: data.rating,
        comment: data.comment,
      },
    });

    // Recalculate average rating and update review count
    const aggregate = await prisma.review.aggregate({
      _avg: { rating: true },
      _count: { rating: true },
      where: { serviceProviderId },
    });

    await prisma.serviceProvider.update({
      where: { id: serviceProviderId },
      data: {
        rating: aggregate._avg.rating || 0,
        reviewCount: aggregate._count.rating || 0,
      },
    });

    return review;
  }

  async getReviewsByServiceProvider(
    schemaName: string,
    serviceProviderId: string,
  ): Promise<ReviewDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    return prisma.review.findMany({
      where: { serviceProviderId },
      orderBy: { createdAt: 'desc' },
    });
  }
}