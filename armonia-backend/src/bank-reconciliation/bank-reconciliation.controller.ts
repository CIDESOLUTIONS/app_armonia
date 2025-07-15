import { Controller, Post, UseInterceptors, UploadedFile, Body, UseGuards, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BankReconciliationService } from './bank-reconciliation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('bank-reconciliation')
export class BankReconciliationController {
  constructor(private readonly bankReconciliationService: BankReconciliationService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadStatement(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: any,
    @Body('complexId') complexId: string,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    // Asumiendo que el servicio procesará el archivo y devolverá sugerencias
    return this.bankReconciliationService.processBankStatement(user.schemaName, file.buffer, file.mimetype, +complexId);
  }
}