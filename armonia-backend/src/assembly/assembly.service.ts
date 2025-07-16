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

  async createAssembly(
    schemaName: string,
    data: CreateAssemblyDto,
  ): Promise<AssemblyDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    return prisma.assembly.create({
      data: { ...data, status: AssemblyStatus.SCHEDULED },
    });
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

  async updateAssembly(
    schemaName: string,
    id: number,
    data: UpdateAssemblyDto,
  ): Promise<AssemblyDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    return prisma.assembly.update({ where: { id }, data });
  }

  async deleteAssembly(schemaName: string, id: number): Promise<void> {
    const prisma = this.getTenantPrismaClient(schemaName);
    await prisma.assembly.delete({ where: { id } });
  }

  async registerAttendance(
    schemaName: string,
    assemblyId: number,
    userId: number,
    present: boolean,
  ): Promise<any> {
    const prisma = this.getTenantPrismaClient(schemaName);
    // Register attendance
    await prisma.attendance.upsert({
      where: { userId_assemblyId: { userId, assemblyId } },
      update: { present },
      create: { userId, assemblyId, present },
    });

    // Update current attendance count
    const currentAttendance = await prisma.attendance.count({
      where: { assemblyId, present: true },
    });

    // Assuming Assembly model has a field like `totalRegisteredAttendees` for quorum calculation
    const assembly = await prisma.assembly.findUnique({
      where: { id: assemblyId },
    });
    if (!assembly) {
      throw new NotFoundException(
        `Asamblea con ID ${assemblyId} no encontrada.`,
      );
    }

    const quorumMet = this.calculateQuorum(
      currentAttendance,
      assembly.totalRegisteredAttendees,
    ); // Assuming totalRegisteredAttendees exists

    await prisma.assembly.update({
      where: { id: assemblyId },
      data: { currentAttendance, quorumMet },
    });

    console.log(
      `Usuario ${userId} ${present ? 'presente' : 'ausente'} en asamblea ${assemblyId}. Quórum: ${quorumMet}`,
    );
    return { message: 'Asistencia registrada', currentAttendance, quorumMet };
  }

  private calculateQuorum(
    currentAttendance: number,
    totalRegisteredAttendees: number,
  ): boolean {
    // Example quorum logic: 50% + 1 of total registered attendees
    const requiredQuorum = Math.floor(totalRegisteredAttendees / 2) + 1;
    return currentAttendance >= requiredQuorum;
  }

  // Lógica de votaciones (placeholder)
  async createVote(schemaName: string, data: CreateVoteDto): Promise<any> {
    const prisma = this.getTenantPrismaClient(schemaName);
    // Aquí se crearía la votación en la DB
    return prisma.vote.create({
      data: { ...data, assemblyId: data.assemblyId, isActive: true },
    });
  }

  async submitVote(schemaName: string, data: SubmitVoteDto): Promise<any> {
    const prisma = this.getTenantPrismaClient(schemaName);
    // Aquí se registraría el voto del usuario con su ponderación
    return prisma.userVote.create({
      data: { ...data, userId: data.userId, weight: data.weight },
    });
  }

  async getVoteResults(schemaName: string, voteId: number): Promise<any> {
    const prisma = this.getTenantPrismaClient(schemaName);
    // Aquí se calcularían los resultados de la votación, incluyendo ponderación
    const votes = await prisma.userVote.findMany({
      where: { voteId },
      select: {
        optionIndex: true,
        weight: true,
      },
    });

    const results: { [optionIndex: number]: number } = {};
    votes.forEach((vote) => {
      if (!results[vote.optionIndex]) {
        results[vote.optionIndex] = 0;
      }
      results[vote.optionIndex] += vote.weight;
    });

    return { voteId, results };
  }

  // Lógica de actas (placeholder)
  async generateMeetingMinutes(
    schemaName: string,
    assemblyId: number,
  ): Promise<any> {
    // Aquí se generaría el borrador del acta
    return { documentUrl: 'placeholder.pdf' };
  }

  async getAssemblyQuorumStatus(
    schemaName: string,
    assemblyId: number,
  ): Promise<{ currentAttendance: number; quorumMet: boolean }> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const assembly = await prisma.assembly.findUnique({
      where: { id: assemblyId },
    });
    if (!assembly) {
      throw new NotFoundException(
        `Asamblea con ID ${assemblyId} no encontrada.`,
      );
    }

    const currentAttendance = await prisma.attendance.count({
      where: { assemblyId, present: true },
    });

    const quorumMet = this.calculateQuorum(
      currentAttendance,
      assembly.totalRegisteredAttendees,
    );

    return { currentAttendance, quorumMet };
  }
}
