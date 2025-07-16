import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FinancesService } from './finances.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';
import {
  FeeDto,
  FeeListResponseDto,
  CreateFeeDto,
  UpdateFeeDto,
  CreatePaymentDto,
  CreateBudgetDto,
  FeeFilterParamsDto,
  PaymentDto,
  BudgetDto,
  InitiatePaymentDto,
  PaymentGatewayCallbackDto,
} from '../common/dto/finances.dto';

@UseGuards(JwtAuthGuard)
@Controller('finances')
export class FinancesController {
  constructor(private readonly financesService: FinancesService) {}

  @Post('payments/initiate')
  async initiatePayment(
    @GetUser() user: any,
    @Body() initiatePaymentDto: InitiatePaymentDto,
  ): Promise<any> {
    return this.financesService.initiatePayment(
      user.schemaName,
      user.userId,
      initiatePaymentDto,
    );
  }

  @Post('payments/callback')
  async handlePaymentCallback(
    @Body() paymentCallbackDto: PaymentGatewayCallbackDto,
  ): Promise<any> {
    // This endpoint might not need @GetUser() if it's a public webhook from the payment gateway
    // Security considerations: Verify webhook signature/IPs
    return this.financesService.handlePaymentCallback(paymentCallbackDto);
  }

  @Get('fees')
  async getFees(
    @GetUser() user: any,
    @Query() filters: FeeFilterParamsDto,
  ): Promise<FeeListResponseDto> {
    return this.financesService.getFees(user.schemaName, filters);
  }

  @Get('fees/:id')
  async getFee(@GetUser() user: any, @Param('id') id: string): Promise<FeeDto> {
    return this.financesService.getFee(user.schemaName, +id);
  }

  @Post('fees')
  async createFee(
    @GetUser() user: any,
    @Body() createFeeDto: CreateFeeDto,
  ): Promise<FeeDto> {
    return this.financesService.createFee(user.schemaName, createFeeDto);
  }

  @Put('fees/:id')
  async updateFee(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateFeeDto: UpdateFeeDto,
  ): Promise<FeeDto> {
    return this.financesService.updateFee(user.schemaName, +id, updateFeeDto);
  }

  @Post('payments')
  async createPayment(
    @GetUser() user: any,
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentDto> {
    return this.financesService.createPayment(
      user.schemaName,
      createPaymentDto,
    );
  }

  @Get('properties/:propertyId/payments')
  async getPropertyPayments(
    @GetUser() user: any,
    @Param('propertyId') propertyId: string,
  ): Promise<PaymentDto[]> {
    return this.financesService.getPropertyPayments(
      user.schemaName,
      +propertyId,
    );
  }

  @Get('properties/:propertyId/balance')
  async getPropertyBalance(
    @GetUser() user: any,
    @Param('propertyId') propertyId: string,
  ) {
    return this.financesService.getPropertyBalance(
      user.schemaName,
      +propertyId,
    );
  }

  @Post('generate-ordinary-fees')
  async generateOrdinaryFees(
    @GetUser() user: any,
    @Body() generateFeesDto: any,
  ) {
    const { amount, dueDate, title, description } = generateFeesDto;
    return this.financesService.generateOrdinaryFees(
      user.schemaName,
      amount,
      dueDate,
      title,
      description,
    );
  }

  @Post('budgets')
  async createBudget(
    @GetUser() user: any,
    @Body() createBudgetDto: CreateBudgetDto,
  ): Promise<BudgetDto> {
    return this.financesService.createBudget(user.schemaName, createBudgetDto);
  }

  @Get('budgets')
  async getBudgetsByYear(
    @GetUser() user: any,
    @Query('year') year: string,
  ): Promise<BudgetDto[]> {
    return this.financesService.getBudgetsByYear(user.schemaName, +year);
  }

  @Put('budgets/:id/approve')
  async approveBudget(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<BudgetDto> {
    return this.financesService.approveBudget(user.schemaName, +id);
  }

  @Get('stats')
  async getFinancialStats(@GetUser() user: any) {
    return this.financesService.getFinancialStats(user.schemaName);
  }

  @Post('reports')
  async generateFinancialReport(@GetUser() user: any, @Body() reportDto: any) {
    const { startDate, endDate, type } = reportDto;
    return this.financesService.generateFinancialReport(
      user.schemaName,
      startDate,
      endDate,
      type,
    );
  }

  @Post('upload-statement')
  @UseInterceptors(FileInterceptor('file'))
  async uploadStatement(
    @GetUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.financesService.processBankStatement(user.schemaName, file);
  }
}
