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
  BadRequestException,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { DocumentsService } from '@armonia-backend/documents/documents.service';
import { CreateDocumentDto } from '@armonia-backend/documents/dto/create-document.dto';
import { UpdateDocumentDto } from '@armonia-backend/documents/dto/update-document.dto';
import { SearchDocumentDto } from '@armonia-backend/documents/dto/search-document.dto';
import { DocumentResponseDto } from '@armonia-backend/documents/dto/document-response.dto';
import { JwtAuthGuard } from '@armonia-backend/auth/jwt-auth.guard';
import { RolesGuard } from '@armonia-backend/auth/roles.guard';
import { Roles } from '@armonia-backend/auth/roles.decorator';
import { UserRole, AccessLevel } from '@prisma/client';
import { GetUser } from '@armonia-backend/common/decorators/user.decorator';

@ApiTags('documents')
@Controller('documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Subir un documento único' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Documento subido exitosamente', type: DocumentResponseDto })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentDto: CreateDocumentDto,
    @GetUser() user: any,
  ): Promise<DocumentResponseDto> {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }
    return this.documentsService.uploadDocument(file, createDocumentDto, user.id, user.schemaName);
  }

  @Post('upload/multiple')
  @ApiOperation({ summary: 'Subir múltiples documentos' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Documentos subidos exitosamente', type: [DocumentResponseDto] })
  @UseInterceptors(FilesInterceptor('files', 10, { limits: { fileSize: 10 * 1024 * 1024 } }))
  async uploadMultipleDocuments(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createDocumentDto: CreateDocumentDto,
    @GetUser() user: any,
  ): Promise<DocumentResponseDto[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No se proporcionaron archivos');
    }
    return this.documentsService.uploadMultipleDocuments(files, createDocumentDto, user.id, user.schemaName);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo documento (metadata únicamente)' })
  @ApiResponse({ status: 201, description: 'Documento creado exitosamente', type: DocumentResponseDto })
  async create(
    @Body() createDocumentDto: CreateDocumentDto,
    @GetUser() user: any,
  ): Promise<DocumentResponseDto> {
    return this.documentsService.create(createDocumentDto, user.id, user.schemaName);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los documentos con filtros opcionales' })
  @ApiResponse({ status: 200, description: 'Lista de documentos', type: [DocumentResponseDto] })
  async findAll(
    @Query() searchDto: SearchDocumentDto,
    @GetUser() user: any,
  ): Promise<DocumentResponseDto[]> {
    return this.documentsService.findAll(user.schemaName, searchDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Búsqueda avanzada de documentos' })
  @ApiResponse({ status: 200, description: 'Resultados de búsqueda', type: [DocumentResponseDto] })
  async search(
    @Query() searchDto: SearchDocumentDto,
    @GetUser() user: any,
  ): Promise<DocumentResponseDto[]> {
    return this.documentsService.searchDocuments(user.schemaName, searchDto);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de documentos' })
  async getStats(@GetUser() user: any): Promise<any> {
    // return this.documentsService.getDocumentStats(user.schemaName);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un documento por ID' })
  @ApiResponse({ status: 200, description: 'Documento encontrado', type: DocumentResponseDto })
  async findOne(@Param('id') id: string, @GetUser() user: any): Promise<DocumentResponseDto> {
    return this.documentsService.findOne(id, user.schemaName);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Descargar un documento' })
  async downloadDocument(
    @Param('id') id: string,
    @GetUser() user: any,
  ): Promise<{ downloadUrl: string; expiresAt: Date }> {
    return this.documentsService.generateDownloadUrl(id, user.schemaName);
  }

  @Get(':id/versions')
  @ApiOperation({ summary: 'Obtener todas las versiones de un documento' })
  @ApiResponse({ status: 200, description: 'Lista de versiones del documento', type: [DocumentResponseDto] })
  async getVersions(@Param('id') id: string, @GetUser() user: any): Promise<DocumentResponseDto[]> {
    return this.documentsService.getDocumentVersions(id, user.schemaName);
  }

  @Post(':id/share')
  @ApiOperation({ summary: 'Compartir un documento con otros usuarios' })
  @HttpCode(HttpStatus.OK)
  async shareDocument(
    @Param('id') id: string,
    @Body() shareData: { userIds: string[]; permissions: string[] },
    @GetUser() user: any,
  ): Promise<{ message: string; sharedWith: number }> {
    return this.documentsService.shareDocument(id, shareData.userIds, shareData.permissions as AccessLevel[], user.id, user.schemaName);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un documento' })
  @ApiResponse({ status: 200, description: 'Documento actualizado exitosamente', type: DocumentResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @GetUser() user: any,
  ): Promise<DocumentResponseDto> {
    return this.documentsService.update(id, updateDocumentDto, user.schemaName);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un documento' })
  @ApiResponse({ status: 200, description: 'Documento eliminado exitosamente' })
  async remove(@Param('id') id: string, @GetUser() user: any): Promise<{ message: string }> {
    await this.documentsService.remove(id, user.schemaName);
    return { message: 'Documento eliminado exitosamente' };
  }

  @Delete(':id/permanent')
  @ApiOperation({ summary: 'Eliminar permanentemente un documento (solo administradores)' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async removePermanent(@Param('id') id: string, @GetUser() user: any): Promise<{ message: string }> {
    await this.documentsService.removePermanent(id, user.schemaName);
    return { message: 'Documento eliminado permanentemente' };
  }
}