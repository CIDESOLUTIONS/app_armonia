import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAssemblyDto,
  UpdateAssemblyDto,
  AssemblyDto,
  AssemblyStatus,
  CreateVoteDto,
  SubmitVoteDto,
} from '../common/dto/assembly.dto';

@Injectable()
export class AssemblyService {
  constructor(
    private prismaClientManager: PrismaClientManager,
    private prisma: PrismaService,
  ) {}

  private getTenantPrismaClient(schemaName: string) {
    return this.prismaClientManager.getClient(schemaName);
  }

  async createAssembly(schemaName: string, data: CreateAssemblyDto): Promise<AssemblyDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    return prisma.assembly.create({ data: { ...data, status: AssemblyStatus.SCHEDULED } });
  }

  async getAssemblies(schemaName: string): Promise<AssemblyDto[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    return prisma.assembly.findMany({ orderBy: { scheduledDate: 'desc' } });
  }

  async getAssemblyById(schemaName: string, id: number): Promise<AssemblyDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const assembly = await prisma.assembly.findUnique({ where: { id } });
    if (!assembly) {
      throw new NotFoundException(`Asamblea con ID ${id} no encontrada.`);
    }
    return assembly;
  }

  async updateAssembly(schemaName: string, id: number, data: UpdateAssemblyDto): Promise<AssemblyDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    return prisma.assembly.update({ where: { id }, data });
  }

  async deleteAssembly(schemaName: string, id: number): Promise<void> {
    const prisma = this.getTenantPrismaClient(schemaName);
    await prisma.assembly.delete({ where: { id } });
  }

  // Lógica de asistencia y quórum (placeholder)
  async registerAttendance(schemaName: string, assemblyId: number, userId: number, present: boolean): Promise<any> {
    const prisma = this.getTenantPrismaClient(schemaName);
    // Aquí se registraría la asistencia y se calcularía el quórum
    console.log(`Usuario ${userId} ${present ? 'presente' : 'ausente'} en asamblea ${assemblyId}`);
    return { message: 'Asistencia registrada' };
  }

  // Lógica de votaciones (placeholder)
  async createVote(schemaName: string, data: CreateVoteDto): Promise<any> {
    const prisma = this.getTenantPrismaClient(schemaName);
    // Aquí se crearía la votación en la DB
    return prisma.vote.create({ data: { ...data, assemblyId: data.assemblyId, isActive: true } });
  }

  async submitVote(schemaName: string, data: SubmitVoteDto): Promise<any> {
    const prisma = this.getTenantPrismaClient(schemaName);
    // Aquí se registraría el voto del usuario
    return prisma.userVote.create({ data: { ...data, userId: data.userId } });
  }

  async getVoteResults(schemaName: string, voteId: number): Promise<any> {
    const prisma = this.getTenantPrismaClient(schemaName);
    // Aquí se calcularían los resultados de la votación, incluyendo ponderación
    return { results: [] };
  }

  // Lógica de actas (placeholder)
  async generateMeetingMinutes(schemaName: string, assemblyId: number): Promise<any> {
    // Aquí se generaría el borrador del acta
    return { documentUrl: 'placeholder.pdf' };
  }
}
