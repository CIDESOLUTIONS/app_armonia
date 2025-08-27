import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAssemblyDto,
  UpdateAssemblyDto,
  AssemblyDto,
  AssemblyStatus,
  AssemblyAttendanceDto,
  AssemblyVoteDto,
  AssemblyVoteRecordDto,
  CalculateQuorumResultDto,
  CalculateVoteResultsResultDto,
  AssemblyType,
} from '../common/dto/assembly.dto';
import { ServerLogger } from '../lib/logging/server-logger';
import { ActivityLogger } from '../lib/logging/activity-logger';
// import { WebSocketService } from '../communications/websocket.service';
// import { DigitalSignatureService } from '../common/services/digital-signature.service';
// import { notifyAssemblyConvocation } from '../communications/integrations/assembly-notifications';

@Injectable()
export class AssemblyService {
  constructor(
    private prisma: PrismaService,
    private activityLogger: ActivityLogger,
  ) {}

  async createAssembly(
    schemaName: string,
    data: CreateAssemblyDto,
    userId: string,
  ): Promise<AssemblyDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    try {
      const assembly = await prisma.assembly.create({
        data: {
          ...data,
          status: AssemblyStatus.SCHEDULED,
          residentialComplex: {
            connect: { id: schemaName },
          },
        },
      });

      await this.activityLogger.logActivity({
        userId,
        action: 'CREATE_ASSEMBLY',
        resourceType: 'ASSEMBLY',
        resourceId: assembly.id,
        details: {
          title: assembly.title,
          date: assembly.date,
        },
      });

      return {
        ...assembly,
        quorum: assembly.quorum.toNumber(),
        type: assembly.type as AssemblyType,
        status: assembly.status as AssemblyStatus,
      };
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
    const prisma = this.prisma.getTenantDB(schemaName);
    const assemblies = await prisma.assembly.findMany({
      orderBy: { date: 'desc' },
    });
    return assemblies.map((assembly) => ({
      ...assembly,
      quorum: assembly.quorum.toNumber(),
      type: assembly.type as AssemblyType,
      status: assembly.status as AssemblyStatus,
    }));
  }

  async getAssemblyById(schemaName: string, id: string): Promise<AssemblyDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const assembly = await prisma.assembly.findUnique({ where: { id } });
    if (!assembly) {
      throw new NotFoundException(`Asamblea con ID ${id} no encontrada.`);
    }
    return {
      ...assembly,
      quorum: assembly.quorum.toNumber(),
      type: assembly.type as AssemblyType,
      status: assembly.status as AssemblyStatus,
    };
  }

  async updateAssembly(
    schemaName: string,
    id: string,
    data: UpdateAssemblyDto,
  ): Promise<AssemblyDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const updatedAssembly = await prisma.assembly.update({
      where: { id },
      data,
    });
    return {
      ...updatedAssembly,
      quorum: updatedAssembly.quorum.toNumber(),
      type: updatedAssembly.type as AssemblyType,
      status: updatedAssembly.status as AssemblyStatus,
    };
  }

  async deleteAssembly(schemaName: string, id: string): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);
    await prisma.assembly.delete({ where: { id } });
  }

  async registerAttendance(
    schemaName: string,
    assemblyId: string,
    userId: string,
    unitId: string,
  ): Promise<AssemblyAttendanceDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
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

      const property = await prisma.property.findUnique({
        where: { id: unitId },
        include: {
          resident: true,
        },
      });

      if (!property) {
        ServerLogger.warn(`Propiedad no encontrada: ${unitId}`);
        throw new NotFoundException('Propiedad no encontrada');
      }

      const isOwner = property.resident?.userId === userId;

      if (!isOwner) {
        ServerLogger.warn(
          `Usuario ${userId} no autorizado para asistir por unidad ${unitId}`,
        );
        throw new Error('Usuario no autorizado para asistir por esta unidad');
      }

      const existingAttendance = await prisma.assemblyAttendance.findFirst({
        where: {
          assemblyId,
          userId,
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
            },
          });

          ServerLogger.info(
            `Registro de asistencia actualizado para unidad ${unitId} en asamblea ${assemblyId}`,
          );

          return {
            ...updatedAttendance,
            unitId: updatedAttendance.unitId,
            checkInTime: updatedAttendance.checkInTime || null,
            notes: updatedAttendance.notes || null,
            proxyName: updatedAttendance.proxyName || null,
            proxyDocument: updatedAttendance.proxyDocument || null,
            isDelegate: updatedAttendance.isDelegate,
            isOwner: updatedAttendance.isOwner,
          };
        }

        return {
          ...existingAttendance,
          unitId: existingAttendance.unitId,
          checkInTime: existingAttendance.checkInTime || null,
          notes: existingAttendance.notes || null,
          proxyName: existingAttendance.proxyName || null,
          proxyDocument: existingAttendance.proxyDocument || null,
          isDelegate: existingAttendance.isDelegate,
          isOwner: existingAttendance.isOwner,
        };
      }

      const attendance = await prisma.assemblyAttendance.create({
        data: {
          assemblyId,
          userId,
          unitId,
          attended: true,
          checkInTime: new Date(),
          notes: '',
          proxyName: null,
          proxyDocument: null,
          isDelegate: false,
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
    assemblyId: string,
  ): Promise<CalculateQuorumResultDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    try {
      if (!assemblyId) {
        throw new Error('Se requiere un ID de asamblea para calcular quórum');
      }

      const assembly = await prisma.assembly.findUnique({
        where: { id: assemblyId },
        include: {
          attendance: true,
          residentialComplex: {
            include: {
              properties: true,
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

      const totalUnits = assembly.residentialComplex.properties.length;
      const presentUnits = assembly.attendance.length;

      const totalCoefficients = totalUnits;
      const presentCoefficients = presentUnits;

      const quorumPercentage =
        totalCoefficients > 0
          ? (presentCoefficients / totalCoefficients) * 100
          : 0;

      const requiredQuorum = 50; 
      const quorumReached = quorumPercentage >= requiredQuorum;

      const result: CalculateQuorumResultDto = {
        assemblyId,
        totalUnits,
        presentUnits,
        totalCoefficients,
        presentCoefficients,
        quorumPercentage,
        requiredQuorum,
        quorumReached,
        timestamp: new Date().toISOString(),
        currentAttendance: presentUnits,
        quorumMet: quorumReached,
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
    assemblyId: string,
    voteData: {
      title: string;
      description: string;
      options: string[];
      startTime?: Date;
      endTime?: Date;
      weightedVoting?: boolean;
      createdBy?: string;
    },
  ): Promise<AssemblyVoteDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
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
          question: voteData.title,
          options: voteData.options || ['A favor', 'En contra', 'Abstención'],
        },
      });

      ServerLogger.info(
        `Creada votación ${vote.id} para asamblea ${assemblyId}`,
      );

      return {
        id: vote.id,
        question: vote.question,
        options: vote.options,
      };
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
    voteId: string,
    userId: string,
    unitId: string,
    option: string,
  ): Promise<AssemblyVoteRecordDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
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

      if (!vote.options.includes(option)) {
        ServerLogger.warn(`Opción de voto inválida: ${option}`);
        throw new Error('Opción de voto inválida');
      }

      const attendance = await prisma.assemblyAttendance.findFirst({
        where: {
          assemblyId: vote.assemblyId,
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
          assemblyVoteId: voteId,
          userId,
        },
      });

      if (existingVote) {
        ServerLogger.warn(
          `Ya existe un voto para unidad ${unitId} en votación ${voteId}`,
        );

        const updatedVote = await prisma.assemblyVoteRecord.update({
          where: { id: existingVote.id },
          data: {
            option,
            createdAt: new Date(),
          },
        });

        ServerLogger.info(
          `Voto actualizado para unidad ${unitId} en votación ${voteId}`,
        );

        return {
            ...updatedVote,
            coefficient: updatedVote.coefficient.toNumber(),
        };
      }

      const coefficient = 1;

      const voteRecord = await prisma.assemblyVoteRecord.create({
        data: {
          assemblyVoteId: voteId,
          userId,
          option,
          coefficient,
          createdAt: new Date(),
        },
      });

      ServerLogger.info(
        `Registrado voto para unidad ${unitId} en votación ${voteId}`,
      );

      await this.calculateVoteResults(schemaName, voteId);

      return {
        ...voteRecord,
        coefficient: voteRecord.coefficient.toNumber(),
      };
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
    voteId: string,
  ): Promise<CalculateVoteResultsResultDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
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
        where: { assemblyVoteId: voteId },
      });

      const results: CalculateVoteResultsResultDto = {
        voteId,
        title: vote.question,
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

      voteRecords.forEach((record) => {
        const option = record.option;
        if (results.options[option]) {
          results.options[option].count++;
          const coefficient = record.coefficient.toNumber() || 1;
          results.options[option].weight += coefficient;
          results.totalWeight += coefficient;
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
    voteId: string,
  ): Promise<{
    vote: AssemblyVoteDto;
    results: CalculateVoteResultsResultDto;
  }> {
    const prisma = this.prisma.getTenantDB(schemaName);
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

      const updatedVote = await prisma.assemblyVote.update({
        where: { id: voteId },
        data: {},
      });

      ServerLogger.info(`Finalizada votación ${voteId}`);

      const results = await this.calculateVoteResults(schemaName, voteId);

      return {
        vote: {
          id: updatedVote.id,
          question: updatedVote.question,
          options: updatedVote.options,
        },
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
    assemblyId: string,
  ): Promise<Buffer> {
    const prisma = this.prisma.getTenantDB(schemaName);
    try {
      if (!assemblyId) {
        throw new Error('Se requiere un ID de asamblea para generar acta');
      }

      const assembly = await prisma.assembly.findUnique({
        where: { id: assemblyId },
        include: {
          residentialComplex: {
            include: {
              properties: true,
            },
          },
          attendance: {
            include: {
              user: true,
            },
          },
          votes: {
            include: {
              votes: true,
            },
          },
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
        date: assembly.date,
        property: assembly.residentialComplex.properties[0].id,
        quorum: quorum,
        attendees: assembly.attendance.map((a) => ({
          name: `${a.user.name}`,
          unit: a.unitId,
          coefficient: 1,
          checkInTime: a.checkInTime,
        })),
        votes: assembly.votes.map((v) => {
          const results: { [key: string]: { count: number; weight: number } } =
            {};
          v.options.forEach((option: string) => {
            results[option] = {
              count: 0,
              weight: 0,
            };
          });

          v.votes.forEach((record) => {
            if (results[record.option]) {
              results[record.option].count++;
              results[record.option].weight += record.coefficient.toNumber() || 1;
            }
          });

          return {
            title: v.question,
            options: v.options,
            results,
          };
        }),
        generatedAt: new Date().toISOString(),
      };

      const minutes = await prisma.assemblyMinutes.create({
        data: {
          assemblyId,
          content: JSON.stringify(minutesData),
        },
      });

      ServerLogger.info(
        `Acta generada para asamblea ${assemblyId}: ${minutes.id}`,
      );

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
    assemblyId: string,
  ): Promise<{ currentAttendance: number; quorumMet: boolean }> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const assembly = await prisma.assembly.findUnique({
      where: { id: assemblyId },
    });
    if (!assembly) {
      throw new NotFoundException(
        `Asamblea con ID ${assemblyId} no encontrada.`,
      );
    }

    const currentAttendance = await prisma.assemblyAttendance.count({
      where: { assemblyId },
    });

    const quorum = await this.calculateQuorum(schemaName, assemblyId);
    const quorumMet = quorum.quorumReached;

    return { currentAttendance, quorumMet };
  }
}
