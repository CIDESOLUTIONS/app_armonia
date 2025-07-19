import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaClientManager {
  constructor(private prismaService: PrismaService) {}

  getClient(schemaName: string): PrismaService {
    // In a multi-schema setup within a single database, the global PrismaClient
    // instance (PrismaService) already has access to all schemas defined in schema.prisma
    // via the @@schema("tenant") directive. The schemaName parameter can be used
    // for logging or validation, but the same PrismaService instance is returned.
    // For actual schema switching in queries, you would typically use Prisma's
    // `$extends` or pass the schema name in the query options if supported by the connector.
    // However, for this project's current multi-schema approach, the generated client
    // handles schema selection based on the model's @@schema directive.
    return this.prismaService;
  }

  async disconnectAll() {
    // The global PrismaService handles its own disconnection.
    // This method can be kept for consistency if needed, but it won't manage multiple clients.
    console.warn(
      'disconnectAll in PrismaClientManager is deprecated in this multi-schema setup. PrismaService handles global disconnection.',
    );
  }
}
