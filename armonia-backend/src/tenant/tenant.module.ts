import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule {}
