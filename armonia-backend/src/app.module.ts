import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule } from '@nestjs/config';
import { SurveyModule } from './surveys/survey.module.js';
import { PackagesModule } from './packages/packages.module.js';
import { VisitorsModule } from './visitors/visitors.module.js';
import { PqrModule } from './pqr/pqr.module.js';
import { PersonalFinancesModule } from './personal-finances/personal-finances.module.js';
import { ReservationsModule } from './reservations/reservations.module.js';
import { TenantModule } from './tenant/tenant.module.js';
import { InventoryModule } from './inventory/inventory.module.js';
import { CommunicationsModule } from './communications/communications.module.js';
import { FinancesModule } from './finances/finances.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { SecurityModule } from './security/security.module.js';
import { PlansModule } from './plans/plans.module.js';
import { BankReconciliationModule } from './bank-reconciliation/bank-reconciliation.module.js';
import { DocumentsModule } from './documents/documents.module.js';
import { PaymentGatewaysModule } from './payment-gateways/payment-gateways.module.js';
import { ResidentialComplexModule } from './residential-complex/residential-complex.module.js';
import { InsurtechModule } from './insurtech/insurtech.module.js';
import { ReportsModule } from './reports/reports.module.js';
import { StaffModule } from './staff/staff.module.js';
import { ServiceProvidersModule } from './service-providers/service-providers.module.js';
import { FintechModule } from './fintech/fintech.module.js';
import { IotModule } from './iot/iot.module.js';
import { PortfolioModule } from './portfolio/portfolio.module.js';
import { MarketplaceModule } from './marketplace/marketplace.module.js';
import { AssemblyModule } from './assembly/assembly.module.js';
import { PanicModule } from './panic/panic.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    SurveyModule,
    PackagesModule,
    VisitorsModule,
    PqrModule,
    PersonalFinancesModule,
    ReservationsModule,
    TenantModule,
    InventoryModule,
    CommunicationsModule,
    FinancesModule,
    ProjectsModule,
    SecurityModule,
    PlansModule,
    BankReconciliationModule,
    DocumentsModule,
    PaymentGatewaysModule,
    ResidentialComplexModule,
    InsurtechModule,
    ReportsModule,
    StaffModule,
    ServiceProvidersModule,
    FintechModule,
    IotModule,
    PortfolioModule,
    MarketplaceModule,
    AssemblyModule,
    PanicModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
