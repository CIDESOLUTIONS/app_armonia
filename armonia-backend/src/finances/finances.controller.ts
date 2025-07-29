import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FinancesService } from './finances.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '../common/enums/user-role.enum.js';
import { GetUser } from '../common/decorators/user.decorator.js';
import {
  CreateFeeDto,
  UpdateFeeDto,
  FeeFilterParamsDto,
  CreatePaymentDto,
  UpdatePaymentDto,
  RegisterManualPaymentDto,
  CreateBudgetDto,
  UpdateBudgetDto,
  BudgetFilterParamsDto,
  CreateExpenseDto,
  UpdateExpenseDto,
  ExpenseFilterParamsDto,
  PaymentGatewayCallbackDto,
} from '../common/dto/finances.dto.js';
import { PaymentStatus } from '../common/enums/payment-status.enum.js';

@UseGuards(JwtAuthGuard, RolesGuard([UserRole.COMPLEX_ADMIN, UserRole.ADMIN]))
@Controller('finances')
export class FinancesController {
  constructor(private readonly financesService: FinancesService) {}

  // Fees
  @Post('fees')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async createFee(@GetUser() user: any, @Body() createFeeDto: CreateFeeDto) {
    return this.financesService.createFee(user.schemaName, createFeeDto);
  }

  @Get('fees')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN, UserRole.RESIDENT)
  async getFees(@GetUser() user: any, @Query() filters: FeeFilterParamsDto) {
    return this.financesService.getFees(user.schemaName, filters);
  }

  @Get('fees/:id')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN, UserRole.RESIDENT)
  async getFeeById(@GetUser() user: any, @Param('id') id: string) {
    return this.financesService.getFeeById(user.schemaName, +id);
  }

  @Put('fees/:id')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async updateFee(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateFeeDto: UpdateFeeDto,
  ) {
    return this.financesService.updateFee(user.schemaName, +id, updateFeeDto);
  }

  @Delete('fees/:id')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async deleteFee(@GetUser() user: any, @Param('id') id: string) {
    return this.financesService.deleteFee(user.schemaName, +id);
  }

  @Post('fees/generate-ordinary')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async generateOrdinaryFees(@GetUser() user: any) {
    return this.financesService.generateOrdinaryFees(user.schemaName);
  }

  // Payments
  @Post('payments')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async createPayment(
    @GetUser() user: any,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.financesService.createPayment(
      user.schemaName,
      createPaymentDto,
    );
  }

  @Post('payments/manual')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async registerManualPayment(
    @GetUser() user: any,
    @Body() registerManualPaymentDto: RegisterManualPaymentDto,
  ) {
    return this.financesService.registerManualPayment(
      user.schemaName,
      registerManualPaymentDto.feeId,
      registerManualPaymentDto.userId,
      registerManualPaymentDto.amount,
      new Date(registerManualPaymentDto.paymentDate),
      registerManualPaymentDto.paymentMethod,
      registerManualPaymentDto.transactionId,
    );
  }

  @Get('payments')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN, UserRole.RESIDENT)
  async getPayments(
    @GetUser() user: any,
    @Query() filters: FeeFilterParamsDto,
  ) {
    return this.financesService.getPayments(user.schemaName, filters);
  }

  @Get('payments/:id')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN, UserRole.RESIDENT)
  async getPaymentById(@GetUser() user: any, @Param('id') id: string) {
    return this.financesService.getPaymentById(user.schemaName, +id);
  }

  @Put('payments/:id')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async updatePayment(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.financesService.updatePayment(
      user.schemaName,
      +id,
      updatePaymentDto,
    );
  }

  @Delete('payments/:id')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async deletePayment(@GetUser() user: any, @Param('id') id: string) {
    return this.financesService.deletePayment(user.schemaName, +id);
  }

  // Budgets
  @Post('budgets')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async createBudget(
    @GetUser() user: any,
    @Body() createBudgetDto: CreateBudgetDto,
  ) {
    return this.financesService.createBudget(user.schemaName, createBudgetDto);
  }

  @Get('budgets')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async getBudgets(
    @GetUser() user: any,
    @Query() filters: BudgetFilterParamsDto,
  ) {
    return this.financesService.getBudgets(user.schemaName, filters);
  }

  @Get('budgets/:id')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async getBudgetById(@GetUser() user: any, @Param('id') id: string) {
    return this.financesService.getBudgetById(user.schemaName, +id);
  }

  @Put('budgets/:id')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async updateBudget(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ) {
    return this.financesService.updateBudget(
      user.schemaName,
      +id,
      updateBudgetDto,
    );
  }

  @Delete('budgets/:id')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async deleteBudget(@GetUser() user: any, @Param('id') id: string) {
    return this.financesService.deleteBudget(user.schemaName, +id);
  }

  @Post('budgets/:id/approve')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async approveBudget(@GetUser() user: any, @Param('id') id: string) {
    return this.financesService.approveBudget(
      user.schemaName,
      +id,
      user.userId,
    );
  }

  // Expenses
  @Post('expenses')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async createExpense(
    @GetUser() user: any,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    return this.financesService.createExpense(
      user.schemaName,
      createExpenseDto,
    );
  }

  @Get('expenses')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async getExpenses(
    @GetUser() user: any,
    @Query() filters: ExpenseFilterParamsDto,
  ) {
    return this.financesService.getExpenses(user.schemaName, filters);
  }

  @Get('expenses/:id')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async getExpenseById(@GetUser() user: any, @Param('id') id: string) {
    return this.financesService.getExpenseById(user.schemaName, +id);
  }

  @Put('expenses/:id')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async updateExpense(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.financesService.updateExpense(
      user.schemaName,
      +id,
      updateExpenseDto,
    );
  }

  @Delete('expenses/:id')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async deleteExpense(@GetUser() user: any, @Param('id') id: string) {
    return this.financesService.deleteExpense(user.schemaName, +id);
  }

  @Get('summary')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN, UserRole.RESIDENT)
  async getFinancialSummary(@GetUser() user: any) {
    return this.financesService.getFinancialSummary(user.schemaName);
  }

  @Get('transactions/recent')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN, UserRole.RESIDENT)
  async getRecentTransactions(@GetUser() user: any) {
    return this.financesService.getRecentTransactions(user.schemaName);
  }

  @Post('payments/initiate')
  @Roles(UserRole.RESIDENT)
  async initiatePayment(@GetUser() user: any, @Body('feeId') feeId: number) {
    return this.financesService.initiatePayment(
      user.schemaName,
      feeId,
      user.userId,
    );
  }

  @Post('payments/webhook')
  async handlePaymentWebhook(
    @Body() paymentGatewayCallbackDto: PaymentGatewayCallbackDto,
  ) {
    return this.financesService.handlePaymentWebhook(
      paymentGatewayCallbackDto.schemaName,
      paymentGatewayCallbackDto.transactionId,
      paymentGatewayCallbackDto.status,
    );
  }

  @Get('reports/generate')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async generateReport(
    @GetUser() user: any,
    @Query('reportType') reportType: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('format') format: string,
  ) {
    return this.financesService.generateFinancialReport(
      user.schemaName,
      reportType,
      startDate,
      endDate,
      format,
    );
  }
}
