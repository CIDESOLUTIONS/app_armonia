import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PanicService } from './panic.service';
import { CreatePanicAlertDto } from '../common/dto/panic.dto';

@WebSocketGateway({ namespace: '/panic', cors: { origin: '*' } })
export class PanicGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly panicService: PanicService) {}

  @SubscribeMessage('triggerPanic')
  async handleTriggerPanic(
    @MessageBody() data: CreatePanicAlertDto & { schemaName: string },
  ): Promise<void> {
    const newAlert = await this.panicService.createPanicAlert(
      data.schemaName,
      data,
    );
    // Emitir la nueva alerta a todos los clientes conectados en el esquema
    this.server
      .to(`security-${data.schemaName}`)
      .emit('newPanicAlert', newAlert);
  }

  @SubscribeMessage('resolvePanic')
  async handleResolvePanic(
    @MessageBody()
    data: {
      alertId: number;
      schemaName: string;
      status: 'RESOLVED' | 'DISMISSED';
    },
  ): Promise<void> {
    const updatedAlert = await this.panicService.updatePanicAlertStatus(
      data.schemaName,
      data.alertId,
      { status: data.status },
    );
    // Emitir la alerta actualizada a todos los clientes conectados en el esquema
    this.server
      .to(`security-${data.schemaName}`)
      .emit('panicAlertUpdated', updatedAlert);
  }
}
