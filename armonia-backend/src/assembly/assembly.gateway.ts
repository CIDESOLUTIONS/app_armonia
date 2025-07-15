import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AssemblyService } from './assembly.service';
import { RegisterAttendanceDto, SubmitVoteDto } from '../common/dto/assembly.dto';

@WebSocketGateway({ namespace: '/assembly', cors: { origin: '*' } })
export class AssemblyGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly assemblyService: AssemblyService) {}

  @SubscribeMessage('joinAssembly')
  handleJoinAssembly(@MessageBody() data: { assemblyId: number; schemaName: string; userId: number }, @ConnectedSocket() client: Socket): void {
    client.join(`assembly-${data.assemblyId}-${data.schemaName}`);
    console.log(`Client ${client.id} joined assembly ${data.assemblyId} in schema ${data.schemaName}`);
    // Emitir el estado actual del quórum a este cliente
    this.server.to(`assembly-${data.assemblyId}-${data.schemaName}`).emit('quorumUpdate', { currentQuorum: 0 }); // Placeholder
  }

  @SubscribeMessage('registerAttendance')
  async handleRegisterAttendance(@MessageBody() data: RegisterAttendanceDto & { schemaName: string }, @ConnectedSocket() client: Socket): Promise<void> {
    await this.assemblyService.registerAttendance(data.schemaName, data.assemblyId, data.userId, data.present);
    // Emitir actualización de quórum a todos los clientes en la sala
    this.server.to(`assembly-${data.assemblyId}-${data.schemaName}`).emit('quorumUpdate', { currentQuorum: 1 }); // Placeholder
  }

  @SubscribeMessage('submitVote')
  async handleSubmitVote(@MessageBody() data: SubmitVoteDto & { schemaName: string }, @ConnectedSocket() client: Socket): Promise<void> {
    await this.assemblyService.submitVote(data.schemaName, data);
    // Emitir actualización de resultados de votación
    this.server.to(`assembly-${data.assemblyId}-${data.schemaName}`).emit('voteResultsUpdate', { voteId: data.voteId, results: [] }); // Placeholder
  }
}
