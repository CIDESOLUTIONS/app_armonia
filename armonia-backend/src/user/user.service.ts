import { Injectable } from '@nestjs/common';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prismaClientManager: PrismaClientManager) {}

  private getPrismaClient(schemaName: string) {
    return this.prismaClientManager.getClient(schemaName);
  }

  async findByEmail(email: string, schemaName: string) {
    return this.getPrismaClient(schemaName).user.findUnique({ where: { email } });
  }

  async findById(id: number, schemaName: string) {
    return this.getPrismaClient(schemaName).user.findUnique({ where: { id } });
  }

  async createUser(data: any, schemaName: string) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.getPrismaClient(schemaName).user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }
}
