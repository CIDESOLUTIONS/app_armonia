import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  Request,
  BadRequestException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { SearchDocumentDto } from './dto/search-document.dto';
import { DocumentResponseDto } from './dto/document-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('documents')
@Controller('documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Subir un documento único' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Documento subido exitosamente',
    type: DocumentResponseDto,
  })
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
    fileFilter: (req, file, cb) => {
      const allowedMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png',
        'image/gif',
        'text/plain',
      ];
      
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestException('Tipo de archivo no permitido'), false);
      }
    },
  }))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentDto: CreateDocumentDto,
    @Request() req: any,
  ): Promise<DocumentResponseDto> {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    return this.documentsService.uploadDocument(
      file,
      createDocumentDto,
      req.user.id,
      req.user.companyId,
    );
  }

  @Post('upload/multiple')
  @ApiOperation({ summary: 'Subir múltiples documentos' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Documentos subidos exitosamente',
    type: [DocumentResponseDto],
  })
  @UseInterceptors(FilesInterceptor('files', 10, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB por archivo
    },
    fileFilter: (req, file, cb) => {
      const allowedMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png',
        'image/gif',
        'text/plain',
      ];
      
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestException('Tipo de archivo no permitido'), false);
      }
    },
  }))
  async uploadMultipleDocuments(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createDocumentDto: CreateDocumentDto,
    @Request() req: any,
  ): Promise<DocumentResponseDto[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No se proporcionaron archivos');
    }

    return this.documentsService.uploadMultipleDocuments(
      files,
      createDocumentDto,
      req.user.id,
      req.user.companyId,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo documento (metadata únicamente)' })
  @ApiResponse({
    status: 201,
    description: 'Documento creado exitosamente',
    type: DocumentResponseDto,
  })
  async create(
    @Body() createDocumentDto: CreateDocumentDto,
    @Request() req: any,
  ): Promise<DocumentResponseDto> {
    return this.documentsService.create(
      createDocumentDto,
      req.user.id,
      req.user.companyId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los documentos con filtros opcionales' })
  @ApiResponse({
    status: 200,
    description: 'Lista de documentos',
    type: [DocumentResponseDto],
  })
  async findAll(
    @Query() searchDto: SearchDocumentDto,
    @Request() req: any,
  ): Promise<DocumentResponseDto[]> {
    return this.documentsService.findAll(
      req.user.companyId,
      searchDto,
    );
  }

  @Get('search')
  @ApiOperation({ summary: 'Búsqueda avanzada de documentos' })
  @ApiResponse({
    status: 200,
    description: 'Resultados de búsqueda',
    type: [DocumentResponseDto],
  })
  async search(
    @Query() searchDto: SearchDocumentDto,
    @Request() req: any,
  ): Promise<DocumentResponseDto[]> {
    return this.documentsService.searchDocuments(
      req.user.companyId,
      searchDto,
    );
  }

  @Get('categories')
  @ApiOperation({ summary: 'Obtener lista de categorías disponibles' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías',
    schema: {
      type: 'array',
      items: { type: 'string' },
    },
  })
  async getCategories(): Promise<string[]> {
    return this.documentsService.getAvailableCategories();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de documentos' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de documentos',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        byCategory: { type: 'object' },
        byStatus: { type: 'object' },
        storageUsed: { type: 'number' },
      },
    },
  })
  async getStats(
    @Request() req: any,
  ): Promise<any> {
    return this.documentsService.getDocumentStats(req.user.companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un documento por ID' })
  @ApiResponse({
    status: 200,
    description: 'Documento encontrado',
    type: DocumentResponseDto,
  })
  async findOne(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<DocumentResponseDto> {
    return this.documentsService.findOne(id, req.user.residentialComplexId);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Descargar un documento' })
  @ApiResponse({
    status: 200,
    description: 'URL de descarga del documento',
    schema: {
      type: 'object',
      properties: {
        downloadUrl: { type: 'string' },
        expiresAt: { type: 'string' },
      },
    },
  })
  async downloadDocument(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<{ downloadUrl: string; expiresAt: Date }> {
    return this.documentsService.generateDownloadUrl(id, req.user.residentialComplexId);
  }

  @Get(':id/versions')
  @ApiOperation({ summary: 'Obtener todas las versiones de un documento' })
  @ApiResponse({
    status: 200,
    description: 'Lista de versiones del documento',
    type: [DocumentResponseDto],
  })
  async getVersions(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<DocumentResponseDto[]> {
    return this.documentsService.getDocumentVersions(id, req.user.residentialComplexId);
  }

  @Post(':id/categorize')
  @ApiOperation({ summary: 'Categorizar automáticamente un documento' })
  @ApiResponse({
    status: 200,
    description: 'Documento categorizado exitosamente',
    type: DocumentResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async categorizeDocument(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<DocumentResponseDto> {
    return this.documentsService.categorizeDocument(id, req.user.residentialComplexId);
  }

  @Post(':id/share')
  @ApiOperation({ summary: 'Compartir un documento con otros usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Documento compartido exitosamente',
  })
  @HttpCode(HttpStatus.OK)
  async shareDocument(
    @Param('id', ParseIntPipe) id: number,
    @Body() shareData: { userIds: number[]; permissions: string[] },
    @Request() req: any,
  ): Promise<{ message: string; sharedWith: number }> {
    return this.documentsService.shareDocument(
      id,
      shareData.userIds,
      shareData.permissions,
      req.user.companyId,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un documento' })
  @ApiResponse({
    status: 200,
    description: 'Documento actualizado exitosamente',
    type: DocumentResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @Request() req: any,
  ): Promise<DocumentResponseDto> {
    return this.documentsService.update(id, updateDocumentDto, req.user.residentialComplexId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un documento' })
  @ApiResponse({
    status: 200,
    description: 'Documento eliminado exitosamente',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<{ message: string }> {
    await this.documentsService.remove(id, req.user.residentialComplexId);
    return { message: 'Documento eliminado exitosamente' };
  }

  @Delete(':id/permanent')
  @ApiOperation({ summary: 'Eliminar permanentemente un documento (solo administradores)' })
  @ApiResponse({
    status: 200,
    description: 'Documento eliminado permanentemente',
  })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async removePermanent(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<{ message: string }> {
    await this.documentsService.removePermanent(id, req.user.residentialComplexId);
    return { message: 'Documento eliminado permanentemente' };
  }
}
