import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { TenantModule } from './tenant/tenant.module';
import { InventoryModule } from './inventory/inventory.module';
import { CommunicationsModule } from './communications/communications.module';
import { FinancesModule } from './finances/finances.module';
import { PqrModule } from './pqr/pqr.module';
import { ProjectsModule } from './projects/projects.module';
import { SecurityModule } from './security/security.module';
import { PlansModule } from './plans/plans.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    TenantModule,
    InventoryModule,
    CommunicationsModule,
    FinancesModule,
    PqrModule,
    ProjectsModule,
    SecurityModule,
    PlansModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}