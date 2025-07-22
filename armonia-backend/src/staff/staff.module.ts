import { Module } from '@nestjs/common';
import { StaffController } from './staff.controller';
import { UserService } from '../user/user.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [StaffController],
  providers: [UserService, PrismaClientManager, PrismaService],
  exports: [UserService],
})
export class StaffModule {}
