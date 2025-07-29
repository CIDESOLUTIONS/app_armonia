import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TenantService } from './tenant.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '../common/enums/user-role.enum.js';

@UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN]))
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get(':id/schema')
  getTenantSchemaName(@Param('id') id: string): Promise<string | null> {
    return this.tenantService.getTenantSchemaName(+id);
  }
}
