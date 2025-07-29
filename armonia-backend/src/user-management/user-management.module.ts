import { Module } from '@nestjs/common';
import { UserManagementController } from './user-management.controller.js';
import { UserManagementService } from './user-management.service.js';

@Module({
  controllers: [UserManagementController],
  providers: [UserManagementService],
})
export class UserManagementModule {}
