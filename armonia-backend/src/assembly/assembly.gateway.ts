import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AssemblyService } from './assembly.service.js';
import {
  RegisterAttendanceDto,
  SubmitVoteDto,
} from '../common/dto/assembly.dto.js';

@WebSocketGateway({ namespace: '/assembly', cors: { origin: '*' } })
export class AssemblyGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly assemblyService: AssemblyService) {}

  @SubscribeMessage('joinAssembly')
  async handleJoinAssembly(
    @MessageBody()
    data: { assemblyId: number; schemaName: string; userId: number },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    client.join(`assembly-${data.assemblyId}-${data.schemaName}`);
    console.log(
      `Client ${client.id} joined assembly ${data.assemblyId} in schema ${data.schemaName}`,
    );
    // Emitir el estado actual del quórum a este cliente
    const quorumStatus = await this.assemblyService.getAssemblyQuorumStatus(
      data.schemaName,
      data.assemblyId,
    );
    this.server
      .to(`assembly-${data.assemblyId}-${data.schemaName}`)
      .emit('quorumUpdate', quorumStatus);
  }

  @SubscribeMessage('registerAttendance')
  async handleRegisterAttendance(
    @MessageBody() data: RegisterAttendanceDto & { schemaName: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { schemaName, assemblyId, userId, unitId } = data;
    const attendance = await this.assemblyService.registerAttendance(
      schemaName,
      assemblyId,
      userId,
      unitId,
    );
    const { currentAttendance, quorumMet } =
      await this.assemblyService.getAssemblyQuorumStatus(
        data.schemaName,
        data.assemblyId,
      );
    // Emitir actualización de quórum a todos los clientes en la sala
    this.server
      .to(`assembly-${data.assemblyId}-${data.schemaName}`)
      .emit('quorumUpdate', { currentAttendance, quorumMet });
  }

  @SubscribeMessage('submitVote')
  async handleSubmitVote(
    @MessageBody()
    data: SubmitVoteDto & { schemaName: string; assemblyId: number },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await this.assemblyService.castVote(
      data.schemaName,
      data.voteId,
      data.userId,
      data.unitId,
      data.option,
    );
    const results = await this.assemblyService.calculateVoteResults(
      data.schemaName,
      data.voteId,
    );
    // Emitir actualización de resultados de votación
    this.server
      .to(`assembly-${data.assemblyId}-${data.schemaName}`)
      .emit('voteResultsUpdate', {
        voteId: data.voteId,
        results: results,
      });
  }
}
