import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { TenantInterceptor } from './common/interceptors/tenant.interceptor';
import { TenantService } from './tenant/tenant.service';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const tenantService = app.get(TenantService);
  app.useGlobalInterceptors(new TenantInterceptor(tenantService));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();