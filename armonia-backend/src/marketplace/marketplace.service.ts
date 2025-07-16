import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateListingDto,
  UpdateListingDto,
  ListingDto,
  ListingFilterParamsDto,
  ListingStatus,
} from '../common/dto/marketplace.dto';

@Injectable()
export class MarketplaceService {
  constructor(
    private prismaClientManager: PrismaClientManager,
    private prisma: PrismaService,
  ) {}

  private getTenantPrismaClient(schemaName: string) {
    return this.prismaClientManager.getClient(schemaName);
  }

  async createListing(
    schemaName: string,
    userId: number,
    data: CreateListingDto,
  ): Promise<ListingDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    return prisma.listing.create({
      data: { ...data, authorId: userId, status: ListingStatus.ACTIVE },
    });
  }

  async getListings(
    schemaName: string,
    filters: ListingFilterParamsDto,
  ): Promise<ListingDto[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const where: any = { status: ListingStatus.ACTIVE };

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters.category) {
      where.category = filters.category;
    }
    if (filters.minPrice) {
      where.price = { ...where.price, gte: filters.minPrice };
    }
    if (filters.maxPrice) {
      where.price = { ...where.price, lte: filters.maxPrice };
    }

    return prisma.listing.findMany({
      where,
      skip: ((filters.page ?? 1) - 1) * (filters.limit ?? 10),
      take: filters.limit ?? 10,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true } } },
    });
  }

  async getListingById(schemaName: string, id: number): Promise<ListingDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: { author: { select: { name: true } } },
    });
    if (!listing) {
      throw new NotFoundException(`Anuncio con ID ${id} no encontrado.`);
    }
    return listing;
  }

  async updateListing(
    schemaName: string,
    id: number,
    userId: number,
    data: UpdateListingDto,
  ): Promise<ListingDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const listing = await prisma.listing.findUnique({ where: { id } });

    if (!listing || listing.authorId !== userId) {
      throw new NotFoundException(
        `Anuncio con ID ${id} no encontrado o no autorizado.`,
      );
    }

    return prisma.listing.update({
      where: { id },
      data,
    });
  }

  async deleteListing(
    schemaName: string,
    id: number,
    userId: number,
  ): Promise<void> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const listing = await prisma.listing.findUnique({ where: { id } });

    if (!listing || listing.authorId !== userId) {
      throw new NotFoundException(
        `Anuncio con ID ${id} no encontrado o no autorizado.`,
      );
    }

    await prisma.listing.delete({ where: { id } });
  }

  async reportListing(
    schemaName: string,
    listingId: number,
    reporterId: number,
    reason: string,
  ): Promise<any> {
    const prisma = this.getTenantPrismaClient(schemaName);
    return prisma.reportedListing.create({
      data: {
        listingId,
        reporterId,
        reason,
        status: 'PENDING',
      },
    });
  }

  async getReportedListings(schemaName: string): Promise<any[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    return prisma.reportedListing.findMany({
      where: { status: 'PENDING' },
      include: {
        listing: { include: { author: { select: { name: true } } } },
        reporter: { select: { name: true } },
      },
    });
  }

  async resolveReport(
    schemaName: string,
    reportId: number,
    action: 'APPROVE' | 'REJECT',
  ): Promise<any> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const report = await prisma.reportedListing.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new NotFoundException(`Reporte con ID ${reportId} no encontrado.`);
    }

    await prisma.reportedListing.update({
      where: { id: reportId },
      data: { status: action === 'APPROVE' ? 'RESOLVED' : 'REJECTED' },
    });

    if (action === 'REJECT') {
      // Si se rechaza el reporte, se puede cambiar el estado del anuncio a DELETED o similar
      await prisma.listing.update({
        where: { id: report.listingId },
        data: { status: ListingStatus.DELETED },
      });
    }

    return {
      message: `Reporte ${action === 'APPROVE' ? 'aprobado' : 'rechazado'} correctamente.`,
    };
  }

  async createMessage(
    schemaName: string,
    data: {
      listingId: number;
      senderId: number;
      receiverId: number;
      content: string;
    },
  ): Promise<any> {
    const prisma = this.getTenantPrismaClient(schemaName);
    return prisma.message.create({
      data: {
        listingId: data.listingId,
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: data.content,
      },
    });
  }

  async getMessages(
    schemaName: string,
    listingId: number,
    userId: number,
  ): Promise<any[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    return prisma.message.findMany({
      where: {
        listingId: listingId,
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
