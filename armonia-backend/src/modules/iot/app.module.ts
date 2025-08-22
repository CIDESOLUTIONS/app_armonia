import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

// Core modules
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

// Feature modules
import { ResidentialComplexModule } from './residential-complex/residential-complex.module';
import { PropertyModule } from './property/property.module';
import { FinanceModule } from './finance/finance.module';
import { CommunicationModule } from './communication/communication.module';
import { DocumentsModule } from './documents/documents.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { ReservationModule } from './reservation/reservation.module';
import { SecurityModule } from './security/security.module';
import { AssemblyModule } from './assembly/assembly.module';
import { PlansModule } from './plans/plans.module';
import { IoTModule } from './modules/iot'; // Nuevo módulo IoT

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Core modules
    PrismaModule,
    AuthModule,
    UserModule,

    // Feature modules
    ResidentialComplexModule,
    PropertyModule,
    FinanceModule,
    CommunicationModule,
    DocumentsModule,
    MaintenanceModule,
    ReservationModule,
    SecurityModule,
    AssemblyModule,
    PlansModule,
    IoTModule, // Nuevo módulo IoT
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
