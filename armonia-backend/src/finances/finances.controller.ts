import { Controller, Get, Post, Put, Body, Param, UseGuards, Query } from '@nestjs/common';
import { FinancesService } from './finances.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('finances')
export class FinancesController {
  constructor(private readonly financesService: FinancesService) {}

  @Get('fees')
  async getFees(@GetUser() user: any, @Query() filters: any) {
    return this.financesService.getFees(user.schemaName, filters);
  }

  @Get('fees/:id')
  async getFee(@GetUser() user: any, @Param('id') id: string) {
    return this.financesService.getFee(user.schemaName, +id);
  }

  @Post('fees')
  async createFee(@GetUser() user: any, @Body() createFeeDto: any) {
    return this.financesService.createFee(user.schemaName, createFeeDto);
  }

  @Put('fees/:id')
  async updateFee(@GetUser() user: any, @Param('id') id: string, @Body() updateFeeDto: any) {
    return this.financesService.updateFee(user.schemaName, +id, updateFeeDto);
  }

  @Post('payments')
  async createPayment(@GetUser() user: any, @Body() createPaymentDto: any) {
    return this.financesService.createPayment(user.schemaName, createPaymentDto);
  }

  @Get('properties/:propertyId/payments')
  async getPropertyPayments(@GetUser() user: any, @Param('propertyId') propertyId: string) {
    return this.financesService.getPropertyPayments(user.schemaName, +propertyId);
  }

  @Get('properties/:propertyId/balance')
  async getPropertyBalance(@GetUser() user: any, @Param('propertyId') propertyId: string) {
    return this.financesService.getPropertyBalance(user.schemaName, +propertyId);
  }

  @Post('generate-ordinary-fees')
  async generateOrdinaryFees(@GetUser() user: any, @Body() generateFeesDto: any) {
    const { amount, dueDate, title, description } = generateFeesDto;
    return this.financesService.generateOrdinaryFees(user.schemaName, amount, dueDate, title, description);
  }

  @Post('budgets')
  async createBudget(@GetUser() user: any, @Body() createBudgetDto: any) {
    return this.financesService.createBudget(user.schemaName, createBudgetDto);
  }

  @Get('budgets')
  async getBudgetsByYear(@GetUser() user: any, @Query('year') year: string) {
    return this.financesService.getBudgetsByYear(user.schemaName, +year);
  }

  @Put('budgets/:id/approve')
  async approveBudget(@GetUser() user: any, @Param('id') id: string) {
    return this.financesService.approveBudget(user.schemaName, +id);
  }

  @Get('stats')
  async getFinancialStats(@GetUser() user: any) {
    return this.financesService.getFinancialStats(user.schemaName);
  }

  @Post('reports')
  async generateFinancialReport(@GetUser() user: any, @Body() reportDto: any) {
    const { startDate, endDate, type } = reportDto;
    return this.financesService.generateFinancialReport(user.schemaName, startDate, endDate, type);
  }
}