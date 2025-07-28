import { Module } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { UserManagementController } from './user-management.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserManagementService],
  controllers: [UserManagementController],
  exports: [UserManagementService],
})
export class UserManagementModule {}