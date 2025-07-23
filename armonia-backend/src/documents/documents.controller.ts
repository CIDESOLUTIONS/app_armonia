import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';
import { DocumentsService } from './documents.service';
import {
  CreateDocumentDto,
  DocumentDto,
  DocumentFilterParamsDto,
} from '../common/dto/documents.dto';

@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @GetUser() user: any,
    @UploadedFile() file: any,
    @Body() createDocumentDto: CreateDocumentDto,
  ): Promise<DocumentDto> {
    return this.documentsService.uploadDocument(
      user.schemaName,
      user.userId,
      file,
      createDocumentDto,
    );
  }

  @Get()
  async getDocuments(
    @GetUser() user: any,
    @Query() filters: DocumentFilterParamsDto,
  ): Promise<DocumentDto[]> {
    return this.documentsService.getDocuments(user.schemaName, filters);
  }

  @Get(':id')
  async getDocumentById(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<DocumentDto> {
    return this.documentsService.getDocumentById(user.schemaName, +id);
  }

  @Delete(':id')
  async deleteDocument(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<void> {
    return this.documentsService.deleteDocument(user.schemaName, +id);
  }
}
