import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { GetUser } from '../../common/decorators/user.decorator';
import { FintechService } from './fintech.service';
import {
  CreateMicroCreditApplicationDto,
  UpdateMicroCreditApplicationDto,
  MicroCreditApplicationDto,
  MicroCreditFilterParamsDto,
} from '../../common/dto/fintech.dto';

@UseGuards(JwtAuthGuard)
@Controller('fintech')
export class FintechController {
  constructor(private readonly fintechService: FintechService) {}

  @Post('micro-credits')
  async createMicroCreditApplication(
    @GetUser() user: any,
    @Body() createMicroCreditApplicationDto: CreateMicroCreditApplicationDto,
  ): Promise<MicroCreditApplicationDto> {
    return this.fintechService.createMicroCreditApplication(
      user.schemaName,
      user.userId,
      createMicroCreditApplicationDto,
    );
  }

  @Get('micro-credits')
  async getMicroCreditApplications(
    @GetUser() user: any,
    @Query() filters: MicroCreditFilterParamsDto,
  ): Promise<MicroCreditApplicationDto[]> {
    return this.fintechService.getMicroCreditApplications(
      user.schemaName,
      filters,
    );
  }

  @Get('micro-credits/:id')
  async getMicroCreditApplicationById(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<MicroCreditApplicationDto> {
    return this.fintechService.getMicroCreditApplicationById(
      user.schemaName,
      +id,
    );
  }

  @Put('micro-credits/:id')
  async updateMicroCreditApplication(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateMicroCreditApplicationDto: UpdateMicroCreditApplicationDto,
  ): Promise<MicroCreditApplicationDto> {
    return this.fintechService.updateMicroCreditApplication(
      user.schemaName,
      +id,
      updateMicroCreditApplicationDto,
    );
  }
}
