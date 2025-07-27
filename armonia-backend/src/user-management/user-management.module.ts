
import { Module } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { UserManagementController } from './user-management.controller';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  providers: [UserManagementService],
  controllers: [UserManagementController],
  exports: [UserManagementService],
})
export class UserManagementModule {}
