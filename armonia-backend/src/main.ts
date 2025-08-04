import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
// import { TenantInterceptor } from './common/interceptors/tenant.interceptor'; // Commented
// import { TenantService } from './tenant/tenant.service'; // Commented
import { PrismaService } from './prisma/prisma.service';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const tenantService = app.get(TenantService); // Commented
  // app.useGlobalInterceptors(new TenantInterceptor(tenantService)); // Commented

  const prismaService = app.get(PrismaService);
  // prismaService.enableShutdownHooks(app) is not a function of PrismaClient, it is a method of INestApplication
  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();