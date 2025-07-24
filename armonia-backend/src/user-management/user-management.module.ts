
import { Module } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { UserManagementController } from './user-management.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaClientManager } from '../prisma/prisma-client-manager';

@Module({
  imports: [PrismaModule],
  providers: [UserManagementService, PrismaClientManager],
  controllers: [UserManagementController],
  exports: [UserManagementService],
})
export class UserManagementModule {}
