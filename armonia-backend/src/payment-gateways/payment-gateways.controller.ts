import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PaymentGatewaysService } from './payment-gateways.service';
import {
  CreatePaymentGatewayDto,
  UpdatePaymentGatewayDto,
  PaymentGatewayConfigDto,
  CreatePaymentDto,
  ProcessPaymentDto,
  PaymentResponseDto,
  CreateRefundDto,
  CreatePaymentMethodDto,
  PaymentMethodDto,
  PaymentFilterDto,
  TransactionDto,
  WebhookEventDto,
  PaymentStatus,
} from '../common/dto/payment-gateways.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { GetUser } from '../common/decorators/user.decorator';

@ApiTags('payment-gateways')
@Controller('payment-gateways')
export class PaymentGatewaysController {
  constructor(
    private readonly paymentGatewaysService: PaymentGatewaysService,
  ) {}

  // ========================================
  // GATEWAY CONFIGURATION ENDPOINTS
  // ========================================

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN]))
  @ApiOperation({ summary: 'Crear nueva pasarela de pago' })
  @ApiResponse({ status: 201, type: PaymentGatewayConfigDto })
  async create(
    @GetUser() user: any,
    @Body() createPaymentGatewayDto: CreatePaymentGatewayDto,
  ): Promise<PaymentGatewayConfigDto> {
    return this.paymentGatewaysService.createPaymentGateway(
      user.schemaName,
      createPaymentGatewayDto,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN, UserRole.RESIDENT]))
  @ApiOperation({ summary: 'Obtener todas las pasarelas de pago' })
  @ApiResponse({ status: 200, type: [PaymentGatewayConfigDto] })
  async findAll(@GetUser() user: any): Promise<PaymentGatewayConfigDto[]> {
    return this.paymentGatewaysService.getPaymentGateways(user.schemaName);
  }

  @Get('active')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener pasarelas activas para pagos' })
  @ApiResponse({ status: 200, type: [PaymentGatewayConfigDto] })
  async getActiveGateways(@GetUser() user: any): Promise<PaymentGatewayConfigDto[]> {
    const gateways = await this.paymentGatewaysService.getPaymentGateways(user.schemaName);
    return gateways.filter(gateway => gateway.isActive);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN]))
  @ApiOperation({ summary: 'Obtener pasarela por ID' })
  @ApiResponse({ status: 200, type: PaymentGatewayConfigDto })
  async findOne(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<PaymentGatewayConfigDto> {
    return this.paymentGatewaysService.getPaymentGatewayById(
      user.schemaName,
      id,
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN]))
  @ApiOperation({ summary: 'Actualizar pasarela de pago' })
  @ApiResponse({ status: 200, type: PaymentGatewayConfigDto })
  async update(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updatePaymentGatewayDto: UpdatePaymentGatewayDto,
  ): Promise<PaymentGatewayConfigDto> {
    return this.paymentGatewaysService.updatePaymentGateway(
      user.schemaName,
      id,
      updatePaymentGatewayDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN]))
  @ApiOperation({ summary: 'Eliminar pasarela de pago' })
  @ApiResponse({ status: 204 })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@GetUser() user: any, @Param('id') id: string): Promise<void> {
    return this.paymentGatewaysService.deletePaymentGateway(
      user.schemaName,
      id,
    );
  }

  // ========================================
  // PAYMENT PROCESSING ENDPOINTS
  // ========================================

  @Post('process')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Procesar un pago' })
  @ApiResponse({ status: 201, type: PaymentResponseDto })
  async processPayment(
    @GetUser() user: any,
    @Body() processPaymentDto: ProcessPaymentDto,
    @Req() request: any,
  ): Promise<PaymentResponseDto> {
    const { paymentData, gatewayId, ...additionalParams } = processPaymentDto as any;
    
    // Agregar información del contexto
    const context = {
      ...additionalParams,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
      baseUrl: `${request.protocol}://${request.get('Host')}`,
    };

    return this.paymentGatewaysService.processPayment(
      user.schemaName,
      paymentData,
      gatewayId,
      context,
    );
  }

  @Get('payments')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener lista de pagos' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: PaymentStatus })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'method', required: false, type: String })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  async getPayments(
    @GetUser() user: any,
    @Query() filters: PaymentFilterDto,
  ): Promise<{ payments: any[]; total: number }> {
    // Los usuarios normales solo pueden ver sus propios pagos
    if (user.role !== UserRole.ADMIN) {
      filters.userId = user.id;
    }

    return this.paymentGatewaysService.getPayments(user.schemaName, filters);
  }

  @Get('payments/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener detalles de un pago' })
  async getPaymentById(
    @GetUser() user: any,
    @Param('id') paymentId: string,
  ): Promise<any> {
    const payment = await this.paymentGatewaysService.getPaymentById(
      user.schemaName,
      paymentId,
    );

    // Los usuarios normales solo pueden ver sus propios pagos
    if (user.role !== UserRole.ADMIN && payment.userId !== user.id) {
      throw new BadRequestException('No tienes acceso a este pago');
    }

    return payment;
  }

  @Get('payments/:id/transactions')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener transacciones de un pago' })
  @ApiResponse({ status: 200, type: [TransactionDto] })
  async getPaymentTransactions(
    @GetUser() user: any,
    @Param('id') paymentId: string,
  ): Promise<TransactionDto[]> {
    // Verificar acceso al pago
    const payment = await this.paymentGatewaysService.getPaymentById(
      user.schemaName,
      paymentId,
    );

    if (user.role !== UserRole.ADMIN && payment.userId !== user.id) {
      throw new BadRequestException('No tienes acceso a este pago');
    }

    return this.paymentGatewaysService.getTransactionsByPayment(
      user.schemaName,
      paymentId,
    );
  }

  // ========================================
  // PAYMENT METHODS ENDPOINTS
  // ========================================

  @Post('payment-methods')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Crear método de pago' })
  @ApiResponse({ status: 201, type: PaymentMethodDto })
  async createPaymentMethod(
    @GetUser() user: any,
    @Body() createPaymentMethodDto: CreatePaymentMethodDto,
  ): Promise<PaymentMethodDto> {
    // Asegurar que el usuario solo pueda crear métodos para sí mismo
    createPaymentMethodDto.userId = user.id;
    
    return this.paymentGatewaysService.createPaymentMethod(
      user.schemaName,
      createPaymentMethodDto,
    );
  }

  @Get('payment-methods')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener métodos de pago del usuario' })
  @ApiResponse({ status: 200, type: [PaymentMethodDto] })
  async getUserPaymentMethods(
    @GetUser() user: any,
  ): Promise<PaymentMethodDto[]> {
    return this.paymentGatewaysService.getUserPaymentMethods(
      user.schemaName,
      user.id,
    );
  }

  @Delete('payment-methods/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Eliminar método de pago' })
  @ApiResponse({ status: 204 })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePaymentMethod(
    @GetUser() user: any,
    @Param('id') methodId: string,
  ): Promise<void> {
    return this.paymentGatewaysService.deletePaymentMethod(
      user.schemaName,
      methodId,
      user.id,
    );
  }

  // ========================================
  // REFUNDS ENDPOINTS
  // ========================================

  @Post('refunds')
  @UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN]))
  @ApiOperation({ summary: 'Crear reembolso' })
  async createRefund(
    @GetUser() user: any,
    @Body() createRefundDto: CreateRefundDto,
  ): Promise<any> {
    return this.paymentGatewaysService.createRefund(
      user.schemaName,
      createRefundDto,
    );
  }

  // ========================================
  // UTILITY ENDPOINTS
  // ========================================

  @Get('pse/banks')
  @ApiOperation({ summary: 'Obtener lista de bancos PSE' })
  @ApiResponse({ status: 200 })
  async getPSEBanks(): Promise<any[]> {
    return this.paymentGatewaysService.getPSEBanks();
  }

  @Get('webhooks/events')
  @UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN]))
  @ApiOperation({ summary: 'Obtener eventos de webhook' })
  @ApiQuery({ name: 'provider', required: false, type: String })
  @ApiQuery({ name: 'processed', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: [WebhookEventDto] })
  async getWebhookEvents(
    @GetUser() user: any,
    @Query('provider') provider?: string,
    @Query('processed') processed?: boolean,
  ): Promise<WebhookEventDto[]> {
    return this.paymentGatewaysService.getWebhookEvents(
      user.schemaName,
      { provider, processed },
    );
  }

  @Post('webhooks/retry')
  @UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN]))
  @ApiOperation({ summary: 'Reintentar webhooks fallidos' })
  @ApiResponse({ status: 200 })
  @HttpCode(HttpStatus.OK)
  async retryFailedWebhooks(
    @GetUser() user: any,
  ): Promise<{ message: string }> {
    await this.paymentGatewaysService.retryFailedWebhooks(user.schemaName);
    return { message: 'Webhooks fallidos procesados para reintento' };
  }

  // ========================================
  // WEBHOOK ENDPOINTS (PUBLIC)
  // ========================================

  @Post('webhooks/stripe')
  @ApiOperation({ summary: 'Webhook de Stripe' })
  @ApiResponse({ status: 200 })
  @HttpCode(HttpStatus.OK)
  async stripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Body() payload: any,
    @Req() request: any,
  ): Promise<{ success: boolean; message: string }> {
    // Obtener schema del header o usar default
    const schemaName = request.headers['x-schema-name'] || 'default';
    
    return this.paymentGatewaysService.processStripeWebhook(
      schemaName,
      JSON.stringify(payload),
      signature,
    );
  }

  @Post('webhooks/paypal')
  @ApiOperation({ summary: 'Webhook de PayPal' })
  @ApiResponse({ status: 200 })
  @HttpCode(HttpStatus.OK)
  async paypalWebhook(
    @Headers() headers: any,
    @Body() body: any,
    @Req() request: any,
  ): Promise<{ success: boolean; message: string }> {
    const schemaName = request.headers['x-schema-name'] || 'default';
    
    return this.paymentGatewaysService.processPayPalWebhook(
      schemaName,
      headers,
      JSON.stringify(body),
    );
  }

  @Post('webhooks/pse')
  @ApiOperation({ summary: 'Notificación de PSE' })
  @ApiResponse({ status: 200 })
  @HttpCode(HttpStatus.OK)
  async pseNotification(
    @Body() notificationData: any,
    @Req() request: any,
  ): Promise<{ success: boolean; message: string }> {
    const schemaName = request.headers['x-schema-name'] || 'default';
    
    return this.paymentGatewaysService.processPSENotification(
      schemaName,
      notificationData,
    );
  }

  // ========================================
  // RETURN URLS (PUBLIC)
  // ========================================

  @Get('paypal/return')
  @ApiOperation({ summary: 'URL de retorno de PayPal' })
  async paypalReturn(
    @Query('token') token: string,
    @Query('PayerID') payerId: string,
    @Query('paymentId') paymentId: string,
  ): Promise<any> {
    // Aquí se manejaría la captura del pago de PayPal
    // Por ahora retornamos información básica
    return {
      success: true,
      message: 'Pago de PayPal completado',
      data: { token, payerId, paymentId },
    };
  }

  @Get('paypal/cancel')
  @ApiOperation({ summary: 'URL de cancelación de PayPal' })
  async paypalCancel(
    @Query('paymentId') paymentId: string,
  ): Promise<any> {
    return {
      success: false,
      message: 'Pago de PayPal cancelado',
      data: { paymentId },
    };
  }

  @Get('pse/return')
  @ApiOperation({ summary: 'URL de retorno de PSE' })
  async pseReturn(
    @Query('transactionId') transactionId: string,
    @Query('trazabilityCode') trazabilityCode: string,
  ): Promise<any> {
    return {
      success: true,
      message: 'Transacción PSE procesada',
      data: { transactionId, trazabilityCode },
    };
  }
}