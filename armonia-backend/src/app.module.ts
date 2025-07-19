import { PersonalFinancesModule } from './personal-finances/personal-finances.module';
import { ReservationsModule } from './reservations/reservations.module';
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
import { ProjectsModule } from './projects/projects.module';
import { SecurityModule } from './security/security.module';
import { PlansModule } from './plans/plans.module';
import { BankReconciliationModule } from './bank-reconciliation/bank-reconciliation.module';
import { DocumentsModule } from './documents/documents.module';
import { PaymentGatewaysModule } from './payment-gateways/payment-gateways.module';
import { ResidentialComplexModule } from './residential-complex/residential-complex.module';
import { InsurtechModule } from './insurtech/insurtech.module';
import { ReportsModule } from './reports/reports.module'; // Importar el nuevo módulo

import { FintechModule } from './fintech/fintech.module';

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
    BankReconciliationModule,
    DocumentsModule,
    VisitorsModule,
    PackagesModule,
    SurveysModule,
    ServiceProvidersModule,
    FintechModule,
    IotModule,
    PortfolioModule,
    MarketplaceModule,
    AssemblyModule,
    PanicModule,
    ReservationsModule,
    PersonalFinancesModule,
    PaymentGatewaysModule,
    ResidentialComplexModule,
    InsurtechModule,
    ReportsModule, // Añadir el nuevo módulo aquí
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}