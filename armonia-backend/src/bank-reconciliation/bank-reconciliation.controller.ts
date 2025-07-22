import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { BankReconciliationService } from './bank-reconciliation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { GetUser } from '../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard(UserRole.COMPLEX_ADMIN, UserRole.ADMIN))
@Controller('bank-reconciliation')
export class BankReconciliationController {
  constructor(private readonly bankReconciliationService: BankReconciliationService) {}

  @Post('reconcile')
  async reconcileBankStatement(
    @GetUser() user: any,
    @Body() transactions: any[], // This would be a DTO for bank transactions
  ) {
    return this.bankReconciliationService.reconcileBankStatement(
      user.schemaName,
      transactions,
    );
  }
}