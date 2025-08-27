import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { GetUser } from '@armonia-backend/common/decorators/user.decorator';
import { MicroCreditService } from './micro-credit.service';
import {
  CreateMicroCreditApplicationDto,
  UpdateMicroCreditApplicationDto,
} from '@armonia-backend/common/dto/fintech.dto';

@UseGuards(JwtAuthGuard)
@Controller('fintech/micro-credits')
export class MicroCreditController {
  constructor(private readonly microCreditService: MicroCreditService) {}

  @Post('apply')
  @Roles(UserRole.RESIDENT)
  async applyForCredit(
    @GetUser() user: any,
    @Body() createDto: CreateMicroCreditApplicationDto,
  ) {
    return this.microCreditService.createApplication(
      user.schemaName,
      user.id,
      createDto,
    );
  }

  @Get('my-applications')
  @Roles(UserRole.RESIDENT)
  async getMyApplications(@GetUser() user: any) {
    return this.microCreditService.getApplicationsForUser(
      user.schemaName,
      user.id,
    );
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllApplications(
    @GetUser() user: any,
    @Query('status') status?: string,
  ) {
    return this.microCreditService.getAllApplications(user.schemaName, status);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMPLEX_ADMIN)
  async updateApplicationStatus(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateDto: UpdateMicroCreditApplicationDto,
  ) {
    return this.microCreditService.updateApplicationStatus(
      user.schemaName,
      id,
      updateDto.status,
      user.id, // admin who approved/rejected
    );
  }
}
