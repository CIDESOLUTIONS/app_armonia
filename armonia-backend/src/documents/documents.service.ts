import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@armonia-backend/prisma/prisma.service';
import { CreateDocumentDto } from '@armonia-backend/documents/dto/create-document.dto';
import { UpdateDocumentDto } from '@armonia-backend/documents/dto/update-document.dto';
import { SearchDocumentDto } from '@armonia-backend/documents/dto/search-document.dto';
import { DocumentResponseDto } from '@armonia-backend/documents/dto/document-response.dto';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { Prisma } from '@prisma/client';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadDocument(
    file: Express.Multer.File,
    createDocumentDto: CreateDocumentDto,
    userId: string,
    schemaName: string,
  ): Promise<DocumentResponseDto> {
    const tenantPrisma = this.prisma.getTenantDB(schemaName);
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const simulatedUrl = `https://storage.armonia.app/documents/${schemaName}/${fileName}`;
    const filePath = `documents/${schemaName}/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${fileName}`;

    const autoType = createDocumentDto.type || this.categorizeByFileName(file.originalname);

    const document = await tenantPrisma.document.create({
      data: {
        name: createDocumentDto.name || file.originalname,
        originalName: file.originalname,
        description: createDocumentDto.description,
        url: simulatedUrl,
        fileName: file.originalname,
        filePath,
        fileSize: file.size,
        mimeType: file.mimetype,
        checksum: `sha256:${uuidv4()}`,
        type: autoType,
        category: createDocumentDto.category,
        subcategory: createDocumentDto.subcategory,
        tags: createDocumentDto.tags || [],
        accessLevel: createDocumentDto.accessLevel || Prisma.AccessLevel.RESIDENTS,
        accessRoles: createDocumentDto.accessRoles || [],
        isPublic: createDocumentDto.isPublic || false,
        version: 1,
        isCurrentVersion: true,
        parentDocumentId: createDocumentDto.parentDocumentId,
        status: Prisma.DocumentStatus.ACTIVE,
        requiresApproval: createDocumentDto.requiresApproval || false,
        expirationDate: createDocumentDto.expirationDate ? new Date(createDocumentDto.expirationDate) : null,
        priority: createDocumentDto.priority || Prisma.Priority.NORMAL,
        language: createDocumentDto.language || 'es',
        uploadedBy: { connect: { id: userId } },
        residentialComplex: { connect: { id: schemaName } },
      },
      include: { uploadedBy: true, residentialComplex: true },
    });

    return this.mapToResponseDto(document);
  }

  async uploadMultipleDocuments(
    files: Array<Express.Multer.File>,
    createDocumentDto: CreateDocumentDto,
    userId: string,
    schemaName: string,
  ): Promise<DocumentResponseDto[]> {
    const uploadPromises = files.map((file) => this.uploadDocument(file, createDocumentDto, userId, schemaName));
    return Promise.all(uploadPromises);
  }

  async create(
    createDocumentDto: CreateDocumentDto,
    userId: string,
    schemaName: string,
  ): Promise<DocumentResponseDto> {
    const tenantPrisma = this.prisma.getTenantDB(schemaName);
    const document = await tenantPrisma.document.create({
      data: {
        name: createDocumentDto.name,
        originalName: createDocumentDto.name,
        description: createDocumentDto.description,
        url: '',
        fileName: '',
        filePath: '',
        fileSize: 0,
        mimeType: 'application/octet-stream',
        type: createDocumentDto.type || Prisma.DocumentType.OTHER,
        category: createDocumentDto.category,
        subcategory: createDocumentDto.subcategory,
        tags: createDocumentDto.tags || [],
        accessLevel: createDocumentDto.accessLevel || Prisma.AccessLevel.RESIDENTS,
        accessRoles: createDocumentDto.accessRoles || [],
        isPublic: createDocumentDto.isPublic || false,
        version: 1,
        isCurrentVersion: true,
        parentDocumentId: createDocumentDto.parentDocumentId,
        status: Prisma.DocumentStatus.ACTIVE,
        requiresApproval: createDocumentDto.requiresApproval || false,
        expirationDate: createDocumentDto.expirationDate ? new Date(createDocumentDto.expirationDate) : null,
        priority: createDocumentDto.priority || Prisma.Priority.NORMAL,
        language: createDocumentDto.language || 'es',
        uploadedBy: { connect: { id: userId } },
        residentialComplex: { connect: { id: schemaName } },
      },
      include: { uploadedBy: true, residentialComplex: true },
    });
    return this.mapToResponseDto(document);
  }

  async findAll(schemaName: string, searchDto: SearchDocumentDto): Promise<DocumentResponseDto[]> {
    const tenantPrisma = this.prisma.getTenantDB(schemaName);
    const where = this.buildWhereClause(searchDto, schemaName);
    const documents = await tenantPrisma.document.findMany({
      where,
      orderBy: { [searchDto.sortBy || 'createdAt']: searchDto.sortOrder || 'desc' },
      skip: ((searchDto.page || 1) - 1) * (searchDto.limit || 20),
      take: searchDto.limit || 20,
      include: { uploadedBy: true, residentialComplex: true, approvedBy: true },
    });
    return documents.map((doc) => this.mapToResponseDto(doc));
  }

  async searchDocuments(schemaName: string, searchDto: SearchDocumentDto): Promise<DocumentResponseDto[]> {
    const tenantPrisma = this.prisma.getTenantDB(schemaName);
    const where = this.buildWhereClause(searchDto, schemaName);

    if (searchDto.searchTerm) {
      where.OR = [
        { name: { contains: searchDto.searchTerm, mode: 'insensitive' } },
        { description: { contains: searchDto.searchTerm, mode: 'insensitive' } },
        { fileName: { contains: searchDto.searchTerm, mode: 'insensitive' } },
        { originalName: { contains: searchDto.searchTerm, mode: 'insensitive' } },
      ];
    }

    const documents = await tenantPrisma.document.findMany({
      where,
      orderBy: { [searchDto.sortBy || 'createdAt']: searchDto.sortOrder || 'desc' },
      skip: ((searchDto.page || 1) - 1) * (searchDto.limit || 20),
      take: searchDto.limit || 20,
      include: { uploadedBy: true, residentialComplex: true, approvedBy: true },
    });

    return documents.map((doc) => this.mapToResponseDto(doc));
  }

  async findOne(id: string, schemaName: string): Promise<DocumentResponseDto> {
    const tenantPrisma = this.prisma.getTenantDB(schemaName);
    const document = await tenantPrisma.document.findFirst({
      where: { id, residentialComplexId: schemaName },
      include: { uploadedBy: true, residentialComplex: true, approvedBy: true, versions: true, comments: { include: { user: true } }, shares: { include: { sharedBy: true } }, activities: { include: { user: true }, orderBy: { createdAt: 'desc' }, take: 10 } },
    });

    if (!document) {
      throw new NotFoundException('Documento no encontrado');
    }

    await tenantPrisma.document.update({
      where: { id },
      data: { viewCount: { increment: 1 }, lastAccessedAt: new Date() },
    });

    return this.mapToResponseDto(document);
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto, schemaName: string): Promise<DocumentResponseDto> {
    const tenantPrisma = this.prisma.getTenantDB(schemaName);
    await this.findOne(id, schemaName); // check existence

    const updatedDocument = await tenantPrisma.document.update({
      where: { id },
      data: { ...updateDocumentDto, expirationDate: updateDocumentDto.expirationDate ? new Date(updateDocumentDto.expirationDate) : undefined },
      include: { uploadedBy: true, residentialComplex: true, approvedBy: true },
    });

    return this.mapToResponseDto(updatedDocument);
  }

  async remove(id: string, schemaName: string): Promise<void> {
    const tenantPrisma = this.prisma.getTenantDB(schemaName);
    await this.findOne(id, schemaName); // check existence
    await tenantPrisma.document.update({
      where: { id },
      data: { status: Prisma.DocumentStatus.ARCHIVED },
    });
  }

  async removePermanent(id: string, schemaName: string): Promise<void> {
    const tenantPrisma = this.prisma.getTenantDB(schemaName);
    await this.findOne(id, schemaName); // check existence
    await tenantPrisma.document.delete({ where: { id } });
  }

  async generateDownloadUrl(id: string, schemaName: string): Promise<{ downloadUrl: string; expiresAt: Date }> {
    const document = await this.findOne(id, schemaName);
    if (!document.url) {
      throw new BadRequestException('El documento no tiene archivo asociado');
    }
    const downloadUrl = `${document.url}?download=true&token=${uuidv4()}`;
    const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour

    const tenantPrisma = this.prisma.getTenantDB(schemaName);
    await tenantPrisma.document.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    });

    return { downloadUrl, expiresAt };
  }

  async getDocumentVersions(id: string, schemaName: string): Promise<DocumentResponseDto[]> {
    const tenantPrisma = this.prisma.getTenantDB(schemaName);
    await this.findOne(id, schemaName); // check existence

    const documents = await tenantPrisma.document.findMany({
      where: { OR: [{ id }, { parentDocumentId: id }], residentialComplexId: schemaName },
      include: { uploadedBy: true, residentialComplex: true },
      orderBy: { version: 'desc' },
    });

    return documents.map((doc) => this.mapToResponseDto(doc));
  }

  async shareDocument(
    id: string,
    userIds: string[],
    permissions: string[],
    schemaName: string,
  ): Promise<{ message: string; sharedWith: number }> {
    const tenantPrisma = this.prisma.getTenantDB(schemaName);
    await this.findOne(id, schemaName); // check existence

    const sharePromises = userIds.map((userId) =>
      tenantPrisma.documentShare.create({
        data: {
          documentId: id,
          sharedById: 'system', // This should be the current user's ID
          recipientId: userId,
          shareToken: uuidv4(),
          accessLevel: permissions[0] as Prisma.AccessLevel || Prisma.AccessLevel.VIEW,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      }),
    );
    await Promise.all(sharePromises);
    return { message: 'Documento compartido exitosamente', sharedWith: userIds.length };
  }

  private buildWhereClause(searchDto: SearchDocumentDto, residentialComplexId: string): Prisma.DocumentWhereInput {
    const where: Prisma.DocumentWhereInput = { residentialComplexId };

    if (searchDto.type) where.type = searchDto.type;
    if (searchDto.category) where.category = { contains: searchDto.category, mode: 'insensitive' };
    if (searchDto.subcategory) where.subcategory = { contains: searchDto.subcategory, mode: 'insensitive' };
    if (searchDto.status) where.status = searchDto.status;
    else if (!searchDto.includeDeleted) where.status = { not: Prisma.DocumentStatus.ARCHIVED };

    // ... add other filters from DTO

    return where;
  }

  private categorizeByFileName(fileName: string): Prisma.DocumentType {
    const lowerFileName = fileName.toLowerCase();
    if (lowerFileName.includes('reglamento')) return Prisma.DocumentType.REGULATION;
    if (lowerFileName.includes('acta')) return Prisma.DocumentType.MINUTES;
    if (lowerFileName.includes('manual')) return Prisma.DocumentType.MANUAL;
    if (lowerFileName.includes('contrato')) return Prisma.DocumentType.CONTRACT;
    if (lowerFileName.includes('factura')) return Prisma.DocumentType.INVOICE;
    if (lowerFileName.includes('reporte')) return Prisma.DocumentType.REPORT;
    if (lowerFileName.includes('certificado')) return Prisma.DocumentType.CERTIFICATE;
    if (lowerFileName.includes('presupuesto')) return Prisma.DocumentType.BUDGET;
    return Prisma.DocumentType.OTHER;
  }

  private mapToResponseDto(document: any): DocumentResponseDto {
    return { ...document, totalVersions: document.versions?.length || 1 };
  }
}
