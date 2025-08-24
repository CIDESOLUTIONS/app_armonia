import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { SurveyModule } from './surveys/survey.module';
import { PackagesModule } from './packages/packages.module';
import { VisitorsModule } from './visitors/visitors.module';
import { PqrModule } from './pqr/pqr.module';
import { PersonalFinancesModule } from './personal-finances/personal-finances.module';
import { ReservationsModule } from './reservations/reservations.module';
import { TenantModule } from './tenant/tenant.module';
import { InventoryModule } from './inventory/inventory.module';
import { CommunicationsModule } from './communications/communications.module';
import { FinancesModule } from './finances/finances.module';
import { ProjectsModule } from './projects/projects.module';
import { SecurityModule } from './security/security.module';
import { PlansModule } from './plans/plans.module';
import { BankReconciliationModule } from './bank-reconciliation/bank-reconciliation.module';
import { DocumentsModule } from './documents/documents.module';
import { PaymentGatewaysModule } from './payment-gateways/payment-gateways.module'; // Uncommented
import { ResidentialComplexModule } from './residential-complex/residential-complex.module';
import { InsurtechModule } from './insurtech/insurtech.module';
import { ReportsModule } from './reports/reports.module';
import { StaffModule } from './staff/staff.module';
import { ServiceProvidersModule } from './service-providers/service-providers.module';
import { FintechModule } from './fintech/fintech.module';
import { IotModule } from './iot/iot.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { AssemblyModule } from './assembly/assembly.module';
import { PanicModule } from './panic/panic.module';
import { AppAdminModule } from './app-admin/app-admin.module';
import { MonitoringModule } from './monitoring/monitoring.module';

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
    AppAdminModule,
    MonitoringModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
