import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateDocumentDto,
  DocumentDto,
  DocumentFilterParamsDto,
} from '../common/dto/documents.dto';

@Injectable()
export class DocumentsService {
  constructor(
    private prismaClientManager: PrismaClientManager,
    private prisma: PrismaService,
  ) {}

  private getTenantPrismaClient(schemaName: string) {
    return this.prismaClientManager.getClient(schemaName);
  }

  async uploadDocument(
    schemaName: string,
    userId: number,
    file: Express.Multer.File,
    createDocumentDto: CreateDocumentDto,
  ): Promise<DocumentDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    // TODO: Implement actual file upload to S3 or other storage
    const fileUrl = `https://your-s3-bucket.s3.amazonaws.com/${schemaName}/${file.originalname}`;

    const document = await prisma.document.create({
      data: {
        name: createDocumentDto.name,
        description: createDocumentDto.description,
        url: fileUrl,
        type: createDocumentDto.type,
        uploadedBy: userId,
        // Assuming a relation to User model to get uploadedByName
        // uploadedByName: user.name,
      },
    });

    return document;
  }

  async getDocuments(
    schemaName: string,
    filters: DocumentFilterParamsDto,
  ): Promise<DocumentDto[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters.type) {
      where.type = filters.type;
    }
    if (filters.uploadedBy) {
      where.uploadedBy = filters.uploadedBy;
    }
    if (filters.startDate) {
      where.uploadedAt = { gte: new Date(filters.startDate) };
    }
    if (filters.endDate) {
      where.uploadedAt = {
        ...where.uploadedAt,
        lte: new Date(filters.endDate),
      };
    }

    return prisma.document.findMany({
      where,
      skip: (filters.page - 1) * filters.limit || 0,
      take: filters.limit || 10,
      orderBy: { uploadedAt: 'desc' },
      // include: { uploadedBy: { select: { name: true } } }, // Uncomment if User relation exists
    });
  }

  async getDocumentById(schemaName: string, id: number): Promise<DocumentDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const document = await prisma.document.findUnique({
      where: { id },
      // include: { uploadedBy: { select: { name: true } } }, // Uncomment if User relation exists
    });

    if (!document) {
      throw new NotFoundException(`Documento con ID ${id} no encontrado.`);
    }
    return document;
  }

  async deleteDocument(schemaName: string, id: number): Promise<void> {
    const prisma = this.getTenantPrismaClient(schemaName);
    // TODO: Implement actual file deletion from S3 or other storage
    await prisma.document.delete({ where: { id } });
  }
}
