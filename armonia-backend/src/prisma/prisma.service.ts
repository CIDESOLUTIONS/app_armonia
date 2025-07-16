import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // NestJS se encargará de llamar a app.close() y Prisma se desconectará automáticamente.
    // Si se necesita una desconexión explícita, se puede añadir un hook OnModuleDestroy.
  }
}
