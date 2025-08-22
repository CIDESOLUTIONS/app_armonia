import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateDocumentDto, DocumentType, DocumentStatus, AccessLevel, Priority } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { SearchDocumentDto } from './dto/search-document.dto';
import { DocumentResponseDto } from './dto/document-response.dto';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { Prisma } from '@prisma/client';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Subir un documento único
   */
  async uploadDocument(
    file: Express.Multer.File,
    createDocumentDto: CreateDocumentDto,
    userId: string,
    residentialComplexId: string,
  ): Promise<DocumentResponseDto> {
    try {
      // Generar URL simulada (en producción se subiría a S3)
      const fileExtension = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      const simulatedUrl = `https://storage.armonia.app/documents/${residentialComplexId}/${fileName}`;
      const filePath = `documents/${residentialComplexId}/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${fileName}`;

      // Categorización automática por tipo de archivo
      const autoType = createDocumentDto.type || this.categorizeByFileName(file.originalname);

      // Crear documento en base de datos
      const document = await this.prisma.document.create({
        data: {
          name: createDocumentDto.name || file.originalname,
          originalName: file.originalname,
          description: createDocumentDto.description,
          url: simulatedUrl,
          fileName: file.originalname,
          filePath,
          fileSize: file.size,
          mimeType: file.mimetype,
          checksum: `sha256:${uuidv4()}`, // En producción se calcularía el hash real
          type: autoType,
          category: createDocumentDto.category,
          subcategory: createDocumentDto.subcategory,
          tags: createDocumentDto.tags || [],
          accessLevel: createDocumentDto.accessLevel || AccessLevel.RESIDENTS,
          accessRoles: createDocumentDto.accessRoles || [],
          isPublic: createDocumentDto.isPublic || false,
          version: 1,
          isCurrentVersion: true,
          parentDocumentId: createDocumentDto.parentDocumentId,
          status: DocumentStatus.ACTIVE,
          requiresApproval: createDocumentDto.requiresApproval || false,
          expirationDate: createDocumentDto.expirationDate ? new Date(createDocumentDto.expirationDate) : null,
          priority: createDocumentDto.priority || Priority.NORMAL,
          language: createDocumentDto.language || 'es',
          downloadCount: 0,
          viewCount: 0,
          uploadedById: userId,
          residentialComplexId,
        },
        include: {
          uploadedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          residentialComplex: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      return this.mapToResponseDto(document);
    } catch (error) {
      throw new BadRequestException(`Error al subir documento: ${error.message}`);
    }
  }

  /**
   * Subir múltiples documentos
   */
  async uploadMultipleDocuments(
    files: Array<Express.Multer.File>,
    createDocumentDto: CreateDocumentDto,
    userId: string,
    residentialComplexId: string,
  ): Promise<DocumentResponseDto[]> {
    const uploadPromises = files.map(file => 
      this.uploadDocument(file, createDocumentDto, userId, residentialComplexId)
    );

    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      throw new BadRequestException(`Error al subir documentos: ${error.message}`);
    }
  }

  /**
   * Crear documento (solo metadata, sin archivo)
   */
  async create(
    createDocumentDto: CreateDocumentDto,
    userId: string,
    residentialComplexId: string,
  ): Promise<DocumentResponseDto> {
    try {
      const document = await this.prisma.document.create({
        data: {
          name: createDocumentDto.name,
          originalName: createDocumentDto.name,
          description: createDocumentDto.description,
          url: '',
          fileName: '',
          filePath: '',
          fileSize: 0,
          mimeType: 'application/octet-stream',
          type: createDocumentDto.type || DocumentType.OTHER,
          category: createDocumentDto.category,
          subcategory: createDocumentDto.subcategory,
          tags: createDocumentDto.tags || [],
          accessLevel: createDocumentDto.accessLevel || AccessLevel.RESIDENTS,
          accessRoles: createDocumentDto.accessRoles || [],
          isPublic: createDocumentDto.isPublic || false,
          version: 1,
          isCurrentVersion: true,
          parentDocumentId: createDocumentDto.parentDocumentId,
          status: DocumentStatus.ACTIVE,
          requiresApproval: createDocumentDto.requiresApproval || false,
          expirationDate: createDocumentDto.expirationDate ? new Date(createDocumentDto.expirationDate) : null,
          priority: createDocumentDto.priority || Priority.NORMAL,
          language: createDocumentDto.language || 'es',
          downloadCount: 0,
          viewCount: 0,
          uploadedById: userId,
          residentialComplexId,
        },
        include: {
          uploadedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          residentialComplex: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      return this.mapToResponseDto(document);
    } catch (error) {
      throw new BadRequestException(`Error al crear documento: ${error.message}`);
    }
  }

  /**
   * Obtener todos los documentos con filtros
   */
  async findAll(
    residentialComplexId: string,
    searchDto: SearchDocumentDto,
  ): Promise<DocumentResponseDto[]> {
    const where: Prisma.DocumentWhereInput = {
      residentialComplexId,
      ...this.buildWhereClause(searchDto),
    };

    const orderBy = {
      [searchDto.sortBy || 'createdAt']: searchDto.sortOrder || 'desc',
    };

    const skip = ((searchDto.page || 1) - 1) * (searchDto.limit || 20);
    const take = searchDto.limit || 20;

    try {
      const documents = await this.prisma.document.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          uploadedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          residentialComplex: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          approvedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      return documents.map(doc => this.mapToResponseDto(doc));
    } catch (error) {
      throw new BadRequestException(`Error al obtener documentos: ${error.message}`);
    }
  }

  /**
   * Búsqueda avanzada de documentos
   */
  async searchDocuments(
    residentialComplexId: string,
    searchDto: SearchDocumentDto,
  ): Promise<DocumentResponseDto[]> {
    const where: Prisma.DocumentWhereInput = {
      residentialComplexId,
      ...this.buildWhereClause(searchDto),
    };

    // Búsqueda full-text si hay término de búsqueda
    if (searchDto.searchTerm) {
      where.OR = [
        {
          name: {
            contains: searchDto.searchTerm,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: searchDto.searchTerm,
            mode: 'insensitive',
          },
        },
        {
          fileName: {
            contains: searchDto.searchTerm,
            mode: 'insensitive',
          },
        },
        {
          originalName: {
            contains: searchDto.searchTerm,
            mode: 'insensitive',
          },
        },
      ];
    }

    try {
      const documents = await this.prisma.document.findMany({
        where,
        orderBy: {
          [searchDto.sortBy || 'createdAt']: searchDto.sortOrder || 'desc',
        },
        skip: ((searchDto.page || 1) - 1) * (searchDto.limit || 20),
        take: searchDto.limit || 20,
        include: {
          uploadedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          residentialComplex: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          approvedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      return documents.map(doc => this.mapToResponseDto(doc));
    } catch (error) {
      throw new BadRequestException(`Error en búsqueda de documentos: ${error.message}`);
    }
  }

  /**
   * Obtener documento por ID
   */
  async findOne(id: string, residentialComplexId: string): Promise<DocumentResponseDto> {
    try {
      const document = await this.prisma.document.findFirst({
        where: {
          id,
          residentialComplexId,
        },
        include: {
          uploadedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          residentialComplex: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          approvedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          versions: {
            select: {
              id: true,
              name: true,
              version: true,
              isCurrentVersion: true,
              createdAt: true,
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          shares: {
            include: {
              sharedBy: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          activities: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 10,
          },
        },
      });

      if (!document) {
        throw new NotFoundException('Documento no encontrado');
      }

      // Incrementar contador de visualizaciones
      await this.prisma.document.update({
        where: { id },
        data: {
          viewCount: {
            increment: 1,
          },
          lastAccessedAt: new Date(),
        },
      });

      return this.mapToResponseDto(document);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error al obtener documento: ${error.message}`);
    }
  }

  /**
   * Actualizar documento
   */
  async update(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
    residentialComplexId: string,
  ): Promise<DocumentResponseDto> {
    // Verificar que el documento existe y pertenece al conjunto
    const existingDocument = await this.findOne(id, residentialComplexId);

    try {
      const updatedDocument = await this.prisma.document.update({
        where: {
          id,
          residentialComplexId,
        },
        data: {
          name: updateDocumentDto.name,
          description: updateDocumentDto.description,
          type: updateDocumentDto.type,
          category: updateDocumentDto.category,
          subcategory: updateDocumentDto.subcategory,
          tags: updateDocumentDto.tags,
          accessLevel: updateDocumentDto.accessLevel,
          accessRoles: updateDocumentDto.accessRoles,
          isPublic: updateDocumentDto.isPublic,
          parentDocumentId: updateDocumentDto.parentDocumentId,
          requiresApproval: updateDocumentDto.requiresApproval,
          expirationDate: updateDocumentDto.expirationDate ? new Date(updateDocumentDto.expirationDate) : undefined,
          priority: updateDocumentDto.priority,
          language: updateDocumentDto.language,
          version: updateDocumentDto.version || existingDocument.version,
          isCurrentVersion: updateDocumentDto.isCurrentVersion,
          approvalStatus: updateDocumentDto.approvalStatus,
        },
        include: {
          uploadedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          residentialComplex: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          approvedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      return this.mapToResponseDto(updatedDocument);
    } catch (error) {
      throw new BadRequestException(`Error al actualizar documento: ${error.message}`);
    }
  }

  /**
   * Eliminar documento (soft delete)
   */
  async remove(id: string, residentialComplexId: string): Promise<void> {
    // Verificar que el documento existe
    await this.findOne(id, residentialComplexId);

    try {
      await this.prisma.document.update({
        where: {
          id,
          residentialComplexId,
        },
        data: {
          status: DocumentStatus.DELETED,
        },
      });
    } catch (error) {
      throw new BadRequestException(`Error al eliminar documento: ${error.message}`);
    }
  }

  /**
   * Eliminar documento permanentemente
   */
  async removePermanent(id: string, residentialComplexId: string): Promise<void> {
    // Verificar que el documento existe
    const document = await this.findOne(id, residentialComplexId);

    try {
      // En producción, aquí se eliminaría el archivo del storage
      
      // Eliminar registro de base de datos
      await this.prisma.document.delete({
        where: {
          id,
          residentialComplexId,
        },
      });
    } catch (error) {
      throw new BadRequestException(`Error al eliminar documento permanentemente: ${error.message}`);
    }
  }

  /**
   * Generar URL de descarga temporal
   */
  async generateDownloadUrl(
    id: string,
    residentialComplexId: string,
  ): Promise<{ downloadUrl: string; expiresAt: Date }> {
    const document = await this.findOne(id, residentialComplexId);

    if (!document.url) {
      throw new BadRequestException('El documento no tiene archivo asociado');
    }

    try {
      // En producción se generaría URL firmada de S3
      const downloadUrl = `${document.url}?download=true&token=${uuidv4()}`;
      const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hora

      // Incrementar contador de descargas
      await this.prisma.document.update({
        where: { id },
        data: {
          downloadCount: {
            increment: 1,
          },
        },
      });

      return {
        downloadUrl,
        expiresAt,
      };
    } catch (error) {
      throw new BadRequestException(`Error al generar URL de descarga: ${error.message}`);
    }
  }

  /**
   * Obtener versiones de un documento
   */
  async getDocumentVersions(
    id: string,
    residentialComplexId: string,
  ): Promise<DocumentResponseDto[]> {
    // Verificar que el documento base existe
    await this.findOne(id, residentialComplexId);

    try {
      const documents = await this.prisma.document.findMany({
        where: {
          OR: [
            { id },
            { parentDocumentId: id },
          ],
          residentialComplexId,
        },
        include: {
          uploadedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          residentialComplex: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          version: 'desc',
        },
      });

      return documents.map(doc => this.mapToResponseDto(doc));
    } catch (error) {
      throw new BadRequestException(`Error al obtener versiones: ${error.message}`);
    }
  }

  /**
   * Categorizar documento automáticamente
   */
  async categorizeDocument(
    id: string,
    residentialComplexId: string,
  ): Promise<DocumentResponseDto> {
    const document = await this.findOne(id, residentialComplexId);

    const autoType = this.categorizeByFileName(document.fileName);

    return this.update(id, { type: autoType }, residentialComplexId);
  }

  /**
   * Compartir documento con otros usuarios
   */
  async shareDocument(
    id: string,
    userIds: string[],
    permissions: string[],
    residentialComplexId: string,
  ): Promise<{ message: string; sharedWith: number }> {
    // Verificar que el documento existe
    await this.findOne(id, residentialComplexId);

    try {
      // Crear registros de compartición
      const sharePromises = userIds.map(userId => 
        this.prisma.documentShare.create({
          data: {
            documentId: id,
            sharedById: 'system', // Se debería pasar el ID del usuario que comparte
            recipientId: userId,
            shareToken: uuidv4(),
            accessLevel: permissions[0] || 'VIEW',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
          },
        })
      );

      await Promise.all(sharePromises);

      return {
        message: 'Documento compartido exitosamente',
        sharedWith: userIds.length,
      };
    } catch (error) {
      throw new BadRequestException(`Error al compartir documento: ${error.message}`);
    }
  }

  /**
   * Obtener categorías disponibles
   */
  async getAvailableCategories(): Promise<string[]> {
    return Object.values(DocumentType);
  }

  /**
   * Obtener estadísticas de documentos
   */
  async getDocumentStats(residentialComplexId: string): Promise<any> {
    try {
      const [total, byType, byStatus, storageUsed] = await Promise.all([
        this.prisma.document.count({
          where: { residentialComplexId, status: { not: DocumentStatus.DELETED } },
        }),
        this.prisma.document.groupBy({
          by: ['type'],
          where: { residentialComplexId, status: { not: DocumentStatus.DELETED } },
          _count: true,
        }),
        this.prisma.document.groupBy({
          by: ['status'],
          where: { residentialComplexId },
          _count: true,
        }),
        this.prisma.document.aggregate({
          where: { residentialComplexId, status: { not: DocumentStatus.DELETED } },
          _sum: { fileSize: true },
        }),
      ]);

      return {
        total,
        byType: byType.reduce((acc, item) => {
          acc[item.type] = item._count;
          return acc;
        }, {}),
        byStatus: byStatus.reduce((acc, item) => {
          acc[item.status] = item._count;
          return acc;
        }, {}),
        storageUsed: storageUsed._sum.fileSize || 0,
      };
    } catch (error) {
      throw new BadRequestException(`Error al obtener estadísticas: ${error.message}`);
    }
  }

  // Métodos privados auxiliares

  private buildWhereClause(searchDto: SearchDocumentDto): Prisma.DocumentWhereInput {
    const where: Prisma.DocumentWhereInput = {};

    if (searchDto.type) {
      where.type = searchDto.type;
    }

    if (searchDto.category) {
      where.category = {
        contains: searchDto.category,
        mode: 'insensitive',
      };
    }

    if (searchDto.subcategory) {
      where.subcategory = {
        contains: searchDto.subcategory,
        mode: 'insensitive',
      };
    }

    if (searchDto.status) {
      where.status = searchDto.status;
    } else if (!searchDto.includeDeleted) {
      where.status = { not: DocumentStatus.DELETED };
    }

    if (searchDto.accessLevel) {
      where.accessLevel = searchDto.accessLevel;
    }

    if (searchDto.priority) {
      where.priority = searchDto.priority;
    }

    if (searchDto.publicOnly) {
      where.isPublic = true;
    }

    if (searchDto.language) {
      where.language = searchDto.language;
    }

    if (searchDto.currentVersionsOnly) {
      where.isCurrentVersion = true;
    }

    if (searchDto.tags && searchDto.tags.length > 0) {
      where.tags = {
        hasSome: searchDto.tags,
      };
    }

    if (searchDto.fileType) {
      where.fileName = {
        endsWith: `.${searchDto.fileType}`,
        mode: 'insensitive',
      };
    }

    if (searchDto.createdFrom || searchDto.createdTo) {
      where.createdAt = {};
      if (searchDto.createdFrom) {
        where.createdAt.gte = new Date(searchDto.createdFrom);
      }
      if (searchDto.createdTo) {
        where.createdAt.lte = new Date(searchDto.createdTo);
      }
    }

    if (searchDto.expirationFrom || searchDto.expirationTo) {
      where.expirationDate = {};
      if (searchDto.expirationFrom) {
        where.expirationDate.gte = new Date(searchDto.expirationFrom);
      }
      if (searchDto.expirationTo) {
        where.expirationDate.lte = new Date(searchDto.expirationTo);
      }
    }

    if (searchDto.minSize !== undefined) {
      where.fileSize = { ...where.fileSize, gte: searchDto.minSize };
    }

    if (searchDto.maxSize !== undefined) {
      where.fileSize = { ...where.fileSize, lte: searchDto.maxSize };
    }

    if (searchDto.uploadedBy) {
      where.uploadedById = searchDto.uploadedBy;
    }

    return where;
  }

  private categorizeByFileName(fileName: string): DocumentType {
    const lowerFileName = fileName.toLowerCase();

    // Reglas de categorización automática
    if (lowerFileName.includes('reglamento') || lowerFileName.includes('regulation')) {
      return DocumentType.REGULATION;
    }
    if (lowerFileName.includes('acta') || lowerFileName.includes('minute')) {
      return DocumentType.MINUTES;
    }
    if (lowerFileName.includes('manual') || lowerFileName.includes('guide')) {
      return DocumentType.MANUAL;
    }
    if (lowerFileName.includes('contrato') || lowerFileName.includes('contract')) {
      return DocumentType.CONTRACT;
    }
    if (lowerFileName.includes('factura') || lowerFileName.includes('invoice')) {
      return DocumentType.INVOICE;
    }
    if (lowerFileName.includes('reporte') || lowerFileName.includes('report')) {
      return DocumentType.REPORT;
    }
    if (lowerFileName.includes('certificado') || lowerFileName.includes('certificate')) {
      return DocumentType.CERTIFICATE;
    }
    if (lowerFileName.includes('presupuesto') || lowerFileName.includes('budget')) {
      return DocumentType.BUDGET;
    }

    return DocumentType.OTHER;
  }

  private mapToResponseDto(document: any): DocumentResponseDto {
    return {
      id: document.id,
      name: document.name,
      originalName: document.originalName,
      description: document.description,
      url: document.url,
      fileName: document.fileName,
      filePath: document.filePath,
      fileSize: document.fileSize,
      mimeType: document.mimeType,
      checksum: document.checksum,
      type: document.type,
      category: document.category,
      subcategory: document.subcategory,
      tags: document.tags,
      accessLevel: document.accessLevel,
      accessRoles: document.accessRoles,
      isPublic: document.isPublic,
      version: document.version,
      isCurrentVersion: document.isCurrentVersion,
      parentDocumentId: document.parentDocumentId,
      status: document.status,
      requiresApproval: document.requiresApproval,
      approvalStatus: document.approvalStatus,
      approvedAt: document.approvedAt,
      approvedById: document.approvedById,
      expirationDate: document.expirationDate,
      priority: document.priority,
      language: document.language,
      downloadCount: document.downloadCount,
      viewCount: document.viewCount,
      lastAccessedAt: document.lastAccessedAt,
      uploadedById: document.uploadedById,
      residentialComplexId: document.residentialComplexId,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      updatedById: document.updatedById,
      uploadedBy: document.uploadedBy,
      approvedBy: document.approvedBy,
      residentialComplex: document.residentialComplex,
      totalVersions: document.versions?.length || 1,
      versions: document.versions,
      comments: document.comments,
      shares: document.shares,
      activities: document.activities,
    };
  }
}