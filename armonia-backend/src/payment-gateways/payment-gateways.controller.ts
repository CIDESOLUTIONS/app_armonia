import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PaymentGatewaysService } from './payment-gateways.service';
import {
  CreatePaymentGatewayDto,
  UpdatePaymentGatewayDto,
  PaymentGatewayConfigDto,
} from '../common/dto/payment-gateways.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { GetUser } from '../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN]))
@Controller('payment-gateways')
export class PaymentGatewaysController {
  constructor(
    private readonly paymentGatewaysService: PaymentGatewaysService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
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
  @Roles(UserRole.ADMIN)
  async findAll(@GetUser() user: any): Promise<PaymentGatewayConfigDto[]> {
    return this.paymentGatewaysService.getPaymentGateways(user.schemaName);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
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
  @Roles(UserRole.ADMIN)
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
  @Roles(UserRole.ADMIN)
  async remove(@GetUser() user: any, @Param('id') id: string): Promise<void> {
    return this.paymentGatewaysService.deletePaymentGateway(
      user.schemaName,
      id,
    );
  }
}
