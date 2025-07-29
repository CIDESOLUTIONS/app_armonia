import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { BankReconciliationService } from './bank-reconciliation.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '../common/enums/user-role.enum.js';
import { GetUser } from '../common/decorators/user.decorator.js';

@UseGuards(JwtAuthGuard, RolesGuard([UserRole.COMPLEX_ADMIN, UserRole.ADMIN]))
@Controller('bank-reconciliation')
export class BankReconciliationController {
  constructor(
    private readonly bankReconciliationService: BankReconciliationService,
  ) {}

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
