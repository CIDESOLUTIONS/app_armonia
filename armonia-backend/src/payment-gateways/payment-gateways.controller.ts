import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PaymentGatewaysService } from './payment-gateways.service.js';
import {
  CreatePaymentGatewayDto,
  UpdatePaymentGatewayDto,
} from '../common/dto/payment-gateways.dto.js';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('payment-gateways')
@Controller('payment-gateways')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PaymentGatewaysController {
  constructor(
    private readonly paymentGatewaysService: PaymentGatewaysService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.COMPLEX_ADMIN)
  @ApiOperation({ summary: 'Create a new payment gateway configuration' })
  @ApiResponse({
    status: 201,
    description: 'The payment gateway has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  create(@Req() req, @Body() createPaymentGatewayDto: CreatePaymentGatewayDto) {
    const schemaName = req.user.schemaName;
    return this.paymentGatewaysService.createPaymentGateway(
      schemaName,
      createPaymentGatewayDto,
    );
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.COMPLEX_ADMIN)
  @ApiOperation({ summary: 'Get all payment gateway configurations' })
  @ApiResponse({
    status: 200,
    description: 'Return all payment gateway configurations.',
  })
  @ApiBearerAuth()
  findAll(@Req() req) {
    const schemaName = req.user.schemaName;
    return this.paymentGatewaysService.getPaymentGateways(schemaName);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.COMPLEX_ADMIN)
  @ApiOperation({ summary: 'Get a payment gateway configuration by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the payment gateway configuration.',
  })
  @ApiResponse({ status: 404, description: 'Payment gateway not found.' })
  @ApiBearerAuth()
  findOne(@Req() req, @Param('id') id: string) {
    const schemaName = req.user.schemaName;
    return this.paymentGatewaysService.getPaymentGatewayById(schemaName, +id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.COMPLEX_ADMIN)
  @ApiOperation({ summary: 'Update a payment gateway configuration by ID' })
  @ApiResponse({
    status: 200,
    description: 'The payment gateway has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Payment gateway not found.' })
  @ApiBearerAuth()
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updatePaymentGatewayDto: UpdatePaymentGatewayDto,
  ) {
    const schemaName = req.user.schemaName;
    return this.paymentGatewaysService.updatePaymentGateway(
      schemaName,
      +id,
      updatePaymentGatewayDto,
    );
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.COMPLEX_ADMIN)
  @ApiOperation({ summary: 'Delete a payment gateway configuration by ID' })
  @ApiResponse({
    status: 200,
    description: 'The payment gateway has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Payment gateway not found.' })
  @ApiBearerAuth()
  remove(@Req() req, @Param('id') id: string) {
    const schemaName = req.user.schemaName;
    return this.paymentGatewaysService.deletePaymentGateway(schemaName, +id);
  }
}
