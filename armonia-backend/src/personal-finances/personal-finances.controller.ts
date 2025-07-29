import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { GetUser } from '../common/decorators/user.decorator.js';
import { PersonalFinancesService } from './personal-finances.service.js';
import {
  CreatePersonalTransactionDto,
  UpdatePersonalTransactionDto,
  PersonalTransactionDto,
  PersonalTransactionFilterParamsDto,
} from '../common/dto/personal-finances.dto.js';

@UseGuards(JwtAuthGuard)
@Controller('personal-finances')
export class PersonalFinancesController {
  constructor(
    private readonly personalFinancesService: PersonalFinancesService,
  ) {}

  @Post()
  async createTransaction(
    @GetUser() user: any,
    @Body() createPersonalTransactionDto: CreatePersonalTransactionDto,
  ): Promise<PersonalTransactionDto> {
    return this.personalFinancesService.createTransaction(
      user.schemaName,
      user.id,
      createPersonalTransactionDto,
    );
  }

  @Get()
  async getTransactions(
    @GetUser() user: any,
    @Query() filters: PersonalTransactionFilterParamsDto,
  ): Promise<PersonalTransactionDto[]> {
    return this.personalFinancesService.getTransactions(
      user.schemaName,
      user.id,
      filters,
    );
  }

  @Put(':id')
  async updateTransaction(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updatePersonalTransactionDto: UpdatePersonalTransactionDto,
  ): Promise<PersonalTransactionDto> {
    return this.personalFinancesService.updateTransaction(
      user.schemaName,
      user.id,
      +id,
      updatePersonalTransactionDto,
    );
  }

  @Delete(':id')
  async deleteTransaction(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<void> {
    return this.personalFinancesService.deleteTransaction(
      user.schemaName,
      user.id,
      +id,
    );
  }
}
