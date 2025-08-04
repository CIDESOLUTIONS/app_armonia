import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { TenantService } from './tenant.service'; // Restored original path
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN]))
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get(':id/schema')
  getTenantSchemaName(@Param('id') id: string): Promise<string | null> {
    return this.tenantService.getTenantSchemaName(id);
  }
}
