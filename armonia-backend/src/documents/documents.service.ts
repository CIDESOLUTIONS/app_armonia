import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateDocumentDto,
  DocumentDto,
  DocumentFilterParamsDto,
} from '../common/dto/documents.dto';
import { uploadFileToS3, deleteFileFromS3 } from '../lib/storage/s3-upload';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async uploadDocument(
    schemaName: string,
    userId: number,
    file: any,
    createDocumentDto: CreateDocumentDto,
  ): Promise<DocumentDto> {
    const prisma: any = this.prisma;
    const fileUrl = await uploadFileToS3(file);

    const document = await prisma.document.create({
      data: {
        name: createDocumentDto.name,
        description: createDocumentDto.description,
        url: fileUrl,
        type: createDocumentDto.type,
        uploadedBy: userId,
      },
    });

    return document;
  }

  async getDocuments(
    schemaName: string,
    filters: DocumentFilterParamsDto,
  ): Promise<DocumentDto[]> {
    const prisma: any = this.prisma;
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
      skip: ((filters.page ?? 1) - 1) * (filters.limit ?? 10),
      take: filters.limit ?? 10,
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async getDocumentById(schemaName: string, id: number): Promise<DocumentDto> {
    const prisma: any = this.prisma;
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException(`Documento con ID ${id} no encontrado.`);
    }
    return document;
  }

  async deleteDocument(schemaName: string, id: number): Promise<void> {
    const prisma: any = this.prisma;
    const document = await prisma.document.findUnique({ where: { id } });

    if (!document) {
      throw new NotFoundException(`Documento con ID ${id} no encontrado.`);
    }

    await deleteFileFromS3(document.url); // Delete from S3
    await prisma.document.delete({ where: { id } }); // Delete from database
  }
}
