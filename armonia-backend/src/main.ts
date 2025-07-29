import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import * as dotenv from 'dotenv';
import { TenantInterceptor } from './common/interceptors/tenant.interceptor.js';
import { TenantService } from './tenant/tenant.service.js';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const tenantService = app.get(TenantService);
  app.useGlobalInterceptors(new TenantInterceptor(tenantService));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
