import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAssemblyDto,
  UpdateAssemblyDto,
  AssemblyDto,
  AssemblyStatus,
} from '../common/dto/assembly.dto';
import { ServerLogger } from '../lib/logging/server-logger';
import { ActivityLogger } from '../lib/logging/activity-logger';
import { WebSocketService } from '../communications/websocket.service';
import { DigitalSignatureService } from '../common/services/digital-signature.service';
import { notifyAssemblyConvocation } from '../communications/integrations/assembly-notifications';

export interface AssemblyAttendance {
  id: number;
  assemblyId: number;
  userId: number;
  unitId: number;
  checkInTime: Date;
  notes: string | null;
  proxyName: string | null;
  proxyDocument: string | null;
  isDelegate: boolean;
  isOwner: boolean;
  updatedAt?: Date;
}

interface Unit {
  id: number;
  coefficient?: number;
  name: string;
  owners: { id: number }[];
  delegates: { id: number }[];
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

interface Attendee {
  userId: number;
  unitId: number;
  checkInTime: Date;
  user: User;
  unit: Unit;
}

interface Topic {
  title: string;
  description: string;
  decisions?: string;
}

export interface AssemblyVote {
  id: number;
  title: string;
  description: string;
  options: string[];
  weightedVoting: boolean;
  startTime: Date;
  endTime?: Date;
  status: string;
  voteRecords: AssemblyVoteRecord[];
}

export interface AssemblyVoteRecord {
  option: string;
  coefficient?: number;
}

interface CalculateQuorumResult {
  assemblyId: number;
  totalUnits: number;
  presentUnits: number;
  totalCoefficients: number;
  presentCoefficients: number;
  quorumPercentage: number;
  requiredQuorum: number;
  quorumReached: boolean;
  timestamp: string;
}

export interface CalculateVoteResultsResult {
  voteId: number;
  title: string;
  totalVotes: number;
  totalWeight: number;
  options: {
    [key: string]: {
      count: number;
      weight: number;
      percentage: number;
    };
  };
  timestamp: string;
}

@Injectable()
export class AssemblyService {
  constructor(
    private prismaClientManager: PrismaClientManager,
    private prisma: PrismaService,
    private activityLogger: ActivityLogger,
    private wsService: WebSocketService,
    private signatureService: DigitalSignatureService,
  ) {}

  private getTenantPrismaClient(schemaName: string) {
    return this.prismaClientManager.getClient(schemaName);
  }

  async createAssembly(
    schemaName: string,
    data: CreateAssemblyDto,
    userId: number,
  ): Promise<AssemblyDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const realtimeChannel = `assembly-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const assembly = await prisma.assembly.create({
        data: {
          ...data,
          status: AssemblyStatus.SCHEDULED,
          realtimeChannel,
          createdBy: userId,
        },
      });

      await this.activityLogger.logActivity({
        userId,
        action: 'CREATE_ASSEMBLY',
        resourceType: 'ASSEMBLY',
        resourceId: assembly.id,
        details: {
          title: assembly.title,
          date: assembly.scheduledDate,
        },
      });

      await notifyAssemblyConvocation(
        assembly.id,
        assembly.title,
        assembly.scheduledDate,
        assembly.location,
      );

      return assembly;
    } catch (error: unknown) {
      if (error instanceof Error) {
        ServerLogger.error('Error al crear asamblea avanzada:', error.message);
      } else {
        ServerLogger.error('Error al crear asamblea avanzada:', error);
      }
      throw error;
    }
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
    unitId: number,
  ): Promise<AssemblyAttendance> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      if (!assemblyId || !userId || !unitId) {
        throw new Error(
          'Se requieren ID de asamblea, usuario y unidad para registrar asistencia',
        );
      }

      const assembly = await prisma.assembly.findUnique({
        where: { id: assemblyId },
      });

      if (!assembly) {
        ServerLogger.warn(`Asamblea no encontrada: ${assemblyId}`);
        throw new NotFoundException('Asamblea no encontrada');
      }

      if (
        assembly.status !== AssemblyStatus.IN_PROGRESS &&
        assembly.status !== AssemblyStatus.SCHEDULED
      ) {
        ServerLogger.warn(
          `Intento de registro en asamblea no activa: ${assemblyId} (estado: ${assembly.status})`,
        );
        throw new Error(
          `La asamblea no está en progreso (estado actual: ${assembly.status})`,
        );
      }

      const unit = await prisma.unit.findUnique({
        where: { id: unitId },
        include: {
          owners: true,
          delegates: true,
        },
      });

      if (!unit) {
        ServerLogger.warn(`Unidad no encontrada: ${unitId}`);
        throw new NotFoundException('Unidad no encontrada');
      }

      const isOwner = unit.owners.some(
        (owner: { id: number }) => owner.id === userId,
      );
      const isDelegate = unit.delegates.some(
        (delegate: { id: number }) => delegate.id === userId,
      );

      if (!isOwner && !isDelegate) {
        ServerLogger.warn(
          `Usuario ${userId} no autorizado para asistir por unidad ${unitId}`,
        );
        throw new Error('Usuario no autorizado para asistir por esta unidad');
      }

      const existingAttendance = await prisma.assemblyAttendance.findFirst({
        where: {
          assemblyId,
          unitId,
        },
      });

      if (existingAttendance) {
        ServerLogger.warn(
          `Ya existe registro de asistencia para unidad ${unitId} en asamblea ${assemblyId}`,
        );

        if (existingAttendance.userId !== userId) {
          const updatedAttendance = await prisma.assemblyAttendance.update({
            where: { id: existingAttendance.id },
            data: {
              userId,
              updatedAt: new Date(),
            },
          });

          ServerLogger.info(
            `Registro de asistencia actualizado para unidad ${unitId} en asamblea ${assemblyId}`,
          );

          return updatedAttendance;
        }

        return existingAttendance;
      }

      const attendance = await prisma.assemblyAttendance.create({
        data: {
          assemblyId,
          userId,
          unitId,
          checkInTime: new Date(),
          notes: '',
          proxyName: null,
          proxyDocument: null,
          isDelegate: isDelegate,
          isOwner: isOwner,
        },
      });

      ServerLogger.info(
        `Registrada asistencia para unidad ${unitId} en asamblea ${assemblyId}`,
      );

      return attendance;
    } catch (error: unknown) {
      if (error instanceof Error) {
        ServerLogger.error(`Error al registrar asistencia: ${error.message}`);
      } else {
        ServerLogger.error(`Error al registrar asistencia: ${error}`);
      }
      throw error;
    }
  }

  async calculateQuorum(
    schemaName: string,
    assemblyId: number,
  ): Promise<CalculateQuorumResult> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      if (!assemblyId) {
        throw new Error('Se requiere un ID de asamblea para calcular quórum');
      }

      const assembly = await prisma.assembly.findUnique({
        where: { id: assemblyId },
        include: {
          attendees: true,
          property: {
            include: {
              units: true,
            },
          },
        },
      });

      if (!assembly) {
        ServerLogger.warn(`Asamblea no encontrada: ${assemblyId}`);
        throw new NotFoundException(
          `Asamblea con ID ${assemblyId} no encontrada.`,
        );
      }

      const totalCoefficients = assembly.property.units.reduce(
        (sum: number, unit: Unit) => sum + (unit.coefficient || 0),
        0,
      );

      const presentCoefficients = assembly.attendees.reduce(
        (sum: number, attendee: Attendee) => {
          const unit = assembly.property.units.find(
            (u: Unit) => u.id === attendee.unitId,
          );
          return sum + (unit ? unit.coefficient || 0 : 0);
        },
        0,
      );

      const quorumPercentage =
        totalCoefficients > 0
          ? (presentCoefficients / totalCoefficients) * 100
          : 0;

      const requiredQuorum = assembly.requiredQuorum || 50;
      const quorumReached = quorumPercentage >= requiredQuorum;

      const result: CalculateQuorumResult = {
        assemblyId,
        totalUnits: assembly.property.units.length,
        presentUnits: assembly.attendees.length,
        totalCoefficients,
        presentCoefficients,
        quorumPercentage,
        requiredQuorum,
        quorumReached,
        timestamp: new Date().toISOString(),
      };

      ServerLogger.info(
        `Quórum calculado para asamblea ${assemblyId}: ${quorumPercentage.toFixed(2)}% (requerido: ${requiredQuorum}%)`,
      );
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        ServerLogger.error(
          `Error al calcular quórum para asamblea ${assemblyId}: ${error.message}`,
        );
      } else {
        ServerLogger.error(
          `Error al calcular quórum para asamblea ${assemblyId}: ${error}`,
        );
      }
      throw error;
    }
  }

  async createVote(
    schemaName: string,
    assemblyId: number,
    voteData: {
      title: string;
      description: string;
      options: string[];
      startTime?: Date;
      endTime?: Date;
      weightedVoting?: boolean;
      createdBy?: string;
    },
  ): Promise<AssemblyVote> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      if (!assemblyId) {
        throw new Error('Se requiere un ID de asamblea para crear votación');
      }

      if (!voteData || !voteData.title || !voteData.description) {
        throw new Error('Datos de votación incompletos');
      }

      const assembly = await prisma.assembly.findUnique({
        where: { id: assemblyId },
      });

      if (!assembly) {
        ServerLogger.warn(`Asamblea no encontrada: ${assemblyId}`);
        throw new NotFoundException('Asamblea no encontrada');
      }

      if (assembly.status !== AssemblyStatus.IN_PROGRESS) {
        ServerLogger.warn(
          `Intento de crear votación en asamblea no activa: ${assemblyId} (estado: ${assembly.status})`,
        );
        throw new Error(
          `La asamblea no está en progreso (estado actual: ${assembly.status})`,
        );
      }

      const vote = await prisma.assemblyVote.create({
        data: {
          assemblyId,
          title: voteData.title,
          description: voteData.description,
          options: voteData.options || ['A favor', 'En contra', 'Abstención'],
          startTime: voteData.startTime || new Date(),
          endTime: voteData.endTime || null,
          status: 'ACTIVE',
          weightedVoting:
            voteData.weightedVoting !== undefined
              ? voteData.weightedVoting
              : true,
          createdBy: voteData.createdBy || 'system',
        },
      });

      ServerLogger.info(
        `Creada votación ${vote.id} para asamblea ${assemblyId}`,
      );

      return vote;
    } catch (error: unknown) {
      if (error instanceof Error) {
        ServerLogger.error(`Error al crear votación: ${error.message}`);
      } else {
        ServerLogger.error(`Error al crear votación: ${error}`);
      }
      throw error;
    }
  }

  async castVote(
    schemaName: string,
    voteId: number,
    userId: number,
    unitId: number,
    option: string,
  ): Promise<AssemblyVoteRecord> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      if (!voteId || !userId || !unitId || !option) {
        throw new Error(
          'Se requieren ID de votación, usuario, unidad y opción para registrar voto',
        );
      }

      const vote = await prisma.assemblyVote.findUnique({
        where: { id: voteId },
        include: {
          assembly: true,
        },
      });

      if (!vote) {
        ServerLogger.warn(`Votación no encontrada: ${voteId}`);
        throw new NotFoundException('Votación no encontrada');
      }

      if (vote.status !== 'ACTIVE') {
        ServerLogger.warn(
          `Intento de votar en votación no activa: ${voteId} (estado: ${vote.status})`,
        );
        throw new Error(
          `La votación no está activa (estado actual: ${vote.status})`,
        );
      }

      if (!vote.options.includes(option)) {
        ServerLogger.warn(`Opción de voto inválida: ${option}`);
        throw new Error('Opción de voto inválida');
      }

      const attendance = await prisma.assemblyAttendance.findFirst({
        where: {
          assemblyId: vote.assemblyId,
          unitId,
          userId,
        },
      });

      if (!attendance) {
        ServerLogger.warn(
          `Usuario ${userId} no registrado como asistente para unidad ${unitId}`,
        );
        throw new Error(
          'Usuario no registrado como asistente para esta unidad',
        );
      }

      const existingVote = await prisma.assemblyVoteRecord.findFirst({
        where: {
          voteId,
          unitId,
        },
      });

      if (existingVote) {
        ServerLogger.warn(
          `Ya existe un voto para unidad ${unitId} en votación ${voteId}`,
        );

        const updatedVote = await prisma.assemblyVoteRecord.update({
          where: { id: existingVote.id },
          data: {
            userId,
            option,
            updatedAt: new Date(),
          },
        });

        ServerLogger.info(
          `Voto actualizado para unidad ${unitId} en votación ${voteId}`,
        );

        return updatedVote;
      }

      let coefficient = 1;

      if (vote.weightedVoting) {
        const unit = await prisma.unit.findUnique({
          where: { id: unitId },
        });

        coefficient = unit ? unit.coefficient || 1 : 1;
      }

      const voteRecord = await prisma.assemblyVoteRecord.create({
        data: {
          voteId,
          userId,
          unitId,
          option,
          coefficient,
          timestamp: new Date(),
        },
      });

      ServerLogger.info(
        `Registrado voto para unidad ${unitId} en votación ${voteId}`,
      );

      await this.calculateVoteResults(schemaName, voteId);

      return voteRecord;
    } catch (error: unknown) {
      if (error instanceof Error) {
        ServerLogger.error(`Error al registrar voto: ${error.message}`);
      } else {
        ServerLogger.error(`Error al registrar voto: ${error}`);
      }
      throw error;
    }
  }

  async calculateVoteResults(
    schemaName: string,
    voteId: number,
  ): Promise<CalculateVoteResultsResult> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      if (!voteId) {
        throw new Error(
          'Se requiere un ID de votación para calcular resultados',
        );
      }

      const vote = await prisma.assemblyVote.findUnique({
        where: { id: voteId },
      });

      if (!vote) {
        ServerLogger.warn(`Votación no encontrada: ${voteId}`);
        throw new NotFoundException(`Votación con ID ${voteId} no encontrada.`);
      }

      const voteRecords = await prisma.assemblyVoteRecord.findMany({
        where: { voteId },
      });

      const results: CalculateVoteResultsResult = {
        voteId,
        title: vote.title,
        totalVotes: voteRecords.length,
        totalWeight: 0,
        options: {},
        timestamp: new Date().toISOString(),
      };

      vote.options.forEach((option: string) => {
        results.options[option] = {
          count: 0,
          weight: 0,
          percentage: 0,
        };
      });

      Object.keys(results.options).forEach((option: string) => {
        results.options[option] = {
          count: 0,
          weight: 0,
          percentage: 0,
        };
      });

      voteRecords.forEach((record: AssemblyVoteRecord) => {
        const option = record.option;
        if (results.options[option]) {
          results.options[option].count++;
          results.options[option].weight += record.coefficient || 1;
          results.totalWeight += record.coefficient || 1;
        }
      });

      if (results.totalWeight > 0) {
        Object.keys(results.options).forEach((option: string) => {
          results.options[option].percentage =
            (results.options[option].weight / results.totalWeight) * 100;
        });
      }

      ServerLogger.info(`Resultados calculados para votación ${voteId}`);
      return results;
    } catch (error: unknown) {
      if (error instanceof Error) {
        ServerLogger.error(
          `Error al calcular resultados de votación ${voteId}: ${error.message}`,
        );
      } else {
        ServerLogger.error(
          `Error al calcular resultados de votación ${voteId}: ${error}`,
        );
      }
      throw error;
    }
  }

  async endVote(
    schemaName: string,
    voteId: number,
  ): Promise<{ vote: AssemblyVote; results: CalculateVoteResultsResult }> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      if (!voteId) {
        throw new Error('Se requiere un ID de votación para finalizar');
      }

      const vote = await prisma.assemblyVote.findUnique({
        where: { id: voteId },
      });

      if (!vote) {
        ServerLogger.warn(`Votación no encontrada: ${voteId}`);
        throw new NotFoundException('Votación no encontrada');
      }

      if (vote.status !== 'ACTIVE') {
        ServerLogger.warn(
          `Intento de finalizar votación no activa: ${voteId} (estado: ${vote.status})`,
        );
        throw new Error(
          `La votación no está activa (estado actual: ${vote.status})`,
        );
      }

      const updatedVote = await prisma.assemblyVote.update({
        where: { id: voteId },
        data: {
          status: 'COMPLETED',
          endTime: new Date(),
        },
      });

      ServerLogger.info(`Finalizada votación ${voteId}`);

      const results = await this.calculateVoteResults(schemaName, voteId);

      await prisma.assemblyVote.update({
        where: { id: voteId },
        data: {
          results: results,
        },
      });

      return {
        vote: updatedVote,
        results,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        ServerLogger.error(
          `Error al finalizar votación ${voteId}: ${error.message}`,
        );
      } else {
        ServerLogger.error(`Error al finalizar votación ${voteId}: ${error}`);
      }
      throw error;
    }
  }

  async generateMeetingMinutes(
    schemaName: string,
    assemblyId: number,
  ): Promise<Buffer> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      if (!assemblyId) {
        throw new Error('Se requiere un ID de asamblea para generar acta');
      }

      const assembly = await prisma.assembly.findUnique({
        where: { id: assemblyId },
        include: {
          property: true,
          attendees: {
            include: {
              user: true,
              unit: true,
            },
          },
          votes: {
            include: {
              voteRecords: true,
            },
          },
          topics: true,
        },
      });

      if (!assembly) {
        ServerLogger.warn(`Asamblea no encontrada: ${assemblyId}`);
        throw new NotFoundException('Asamblea no encontrada');
      }

      const quorum = await this.calculateQuorum(schemaName, assemblyId);

      const minutesData = {
        assemblyId,
        title: `Acta de Asamblea: ${assembly.title}`,
        date: assembly.scheduledDate,
        location: assembly.location,
        property: assembly.property.name,
        quorum: quorum,
        attendees: assembly.attendees.map((a: Attendee) => ({
          name: `${a.user.firstName} ${a.user.lastName}`,
          unit: a.unit.name,
          coefficient: a.unit.coefficient || 0,
          checkInTime: a.checkInTime,
        })),
        topics: assembly.topics.map((t: Topic) => ({
          title: t.title,
          description: t.description,
          decisions: t.decisions || 'Sin decisiones registradas',
        })),
        votes: assembly.votes.map((v: AssemblyVote) => {
          const results: { [key: string]: { count: number; weight: number } } =
            {};
          v.options.forEach((option: string) => {
            results[option] = {
              count: 0,
              weight: 0,
            };
          });

          v.voteRecords.forEach((record: AssemblyVoteRecord) => {
            if (results[record.option]) {
              results[record.option].count++;
              results[record.option].weight += record.coefficient || 1;
            }
          });

          return {
            title: v.title,
            description: v.description,
            options: v.options,
            results,
            startTime: v.startTime,
            endTime: v.endTime || new Date(),
          };
        }),
        conclusions: assembly.conclusions || 'Sin conclusiones registradas',
        generatedAt: new Date().toISOString(),
      };

      const minutes = await prisma.assemblyMinutes.create({
        data: {
          assemblyId,
          content: minutesData,
          generatedBy: 'system',
          status: 'DRAFT',
        },
      });

      ServerLogger.info(
        `Acta generada para asamblea ${assemblyId}: ${minutes.id}`,
      );

      // PDFKit related code commented out due to import issues
      return Buffer.from('PDF generation temporarily disabled');
    } catch (error: unknown) {
      if (error instanceof Error) {
        ServerLogger.error(
          `Error al generar acta para asamblea ${assemblyId}: ${error.message}`,
        );
      } else {
        ServerLogger.error(
          `Error al generar acta para asamblea ${assemblyId}: ${error}`,
        );
      }
      throw error;
    }
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

    const quorum = await this.calculateQuorum(schemaName, assemblyId);
    const quorumMet = quorum.quorumReached;

    return { currentAttendance, quorumMet };
  }
}
