import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { GetUser } from '../../common/decorators/user.decorator';
import { MicroCreditService } from './micro-credit.service';
import {
  CreateMicroCreditApplicationDto,
  UpdateMicroCreditApplicationDto,
} from '../../common/dto/fintech.dto';

@UseGuards(JwtAuthGuard)
@Controller('fintech/micro-credits')
export class MicroCreditController {
  constructor(private readonly microCreditService: MicroCreditService) {}

  @Post()
  async createApplication(
    @GetUser() user: any,
    @Body() createDto: CreateMicroCreditApplicationDto,
  ) {
    return this.microCreditService.createApplication(
      user.schemaName,
      user.userId,
      createDto,
    );
  }

  @Get()
  async getApplications(@GetUser() user: any) {
    return this.microCreditService.getApplications(
      user.schemaName,
      user.userId,
    );
  }

  @Put(':id')
  async updateApplication(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateDto: UpdateMicroCreditApplicationDto,
  ) {
    // Solo administradores pueden actualizar el estado
    // Se debería añadir un RolesGuard aquí
    return this.microCreditService.updateApplication(
      user.schemaName,
      +id,
      updateDto,
    );
  }
}
