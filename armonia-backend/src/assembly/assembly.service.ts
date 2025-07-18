import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import { PDFDocument } from 'pdfkit';
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
    const vote = await prisma.vote.create({
      data: {
        assemblyId: data.assemblyId,
        question: data.question,
        isWeighted: data.isWeighted,
        options: {
          create: data.options.map(optionText => ({ value: optionText }))
        },
        isActive: true,
      },
    });
    return vote;
  }

  async submitVote(schemaName: string, data: SubmitVoteDto): Promise<any> {
    const prisma = this.getTenantPrismaClient(schemaName);
    // Aquí se registraría el voto del usuario con su ponderación
    return prisma.userVote.create({
      data: {
        voteId: data.voteId,
        optionId: data.optionId,
        userId: data.userId,
        weight: data.weight,
      },
    });
  }

  async getVoteResults(schemaName: string, voteId: number): Promise<any> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const vote = await prisma.vote.findUnique({
      where: { id: voteId },
      include: {
        options: true,
        userVotes: true,
      },
    });

    if (!vote) {
      throw new NotFoundException(`Votación con ID ${voteId} no encontrada.`);
    }

    const results: { [optionId: number]: { value: string; totalWeight: number } } = {};
    vote.options.forEach(option => {
      results[option.id] = { value: option.value, totalWeight: 0 };
    });

    vote.userVotes.forEach(userVote => {
      if (results[userVote.optionId]) {
        results[userVote.optionId].totalWeight += userVote.weight;
      }
    });

    return { voteId, question: vote.question, results: Object.values(results) };
  }

  // Lógica de actas (placeholder)
  async generateMeetingMinutes(
    schemaName: string,
    assemblyId: number,
  ): Promise<Buffer> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const assembly = await prisma.assembly.findUnique({
      where: { id: assemblyId },
      include: {
        votes: { include: { options: true, userVotes: true } },
        attendances: { include: { user: true } },
      },
    });

    if (!assembly) {
      throw new NotFoundException(`Asamblea con ID ${assemblyId} no encontrada.`);
    }

    const doc = new PDFDocument();
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    doc.fontSize(20).text(`Acta de Asamblea: ${assembly.title}`, { align: 'center' });
    doc.fontSize(12).text(`Fecha: ${assembly.scheduledDate.toLocaleDateString()}`, { align: 'center' });
    doc.fontSize(12).text(`Lugar: ${assembly.location}`, { align: 'center' });
    doc.moveDown();

    doc.fontSize(16).text('Descripción:');
    doc.fontSize(12).text(assembly.description);
    doc.moveDown();

    doc.fontSize(16).text('Agenda:');
    doc.fontSize(12).text(assembly.agenda);
    doc.moveDown();

    doc.fontSize(16).text('Asistencia:');
    assembly.attendances.forEach(attendance => {
      doc.fontSize(12).text(`- ${attendance.user.name}: ${attendance.present ? 'Presente' : 'Ausente'}`);
    });
    doc.moveDown();

    doc.fontSize(16).text('Resultados de Votaciones:');
    for (const vote of assembly.votes) {
      doc.fontSize(14).text(`Pregunta: ${vote.question}`);
      const results = await this.getVoteResults(schemaName, vote.id);
      results.results.forEach((result: any) => {
        doc.fontSize(12).text(`  - ${result.value}: ${result.totalWeight} votos`);
      });
      doc.moveDown();
    }

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);
    });
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
