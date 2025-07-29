import { Inject, forwardRef } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PanicService } from './panic.service.js';
import { CreatePanicAlertDto } from '../common/dto/panic.dto.js';
import { NotificationType, NotificationSourceType, } from '../common/dto/communications.dto.js';
import { PanicStatus } from '../common/enums/panic.enum.js';

interface NotificationPayload {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  createdAt: string;
}

@WebSocketGateway({ namespace: '/panic', cors: { origin: '*' } })
export class PanicGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => PanicService))
    private readonly panicService: PanicService,
  ) {}

  @SubscribeMessage('triggerPanic')
  async handleTriggerPanic(
    @MessageBody() data: CreatePanicAlertDto & { schemaName: string },
  ): Promise<void> {
    const newAlert = await this.panicService.createAlert(
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
    const updatedAlert = await this.panicService.updateAlert(
      data.schemaName,
      data.alertId,
      { status: data.status as PanicStatus },
    );
    // Emitir la alerta actualizada a todos los clientes conectados en el esquema
    this.server
      .to(`security-${data.schemaName}`)
      .emit('panicAlertUpdated', updatedAlert);
  }

  // New method to send notifications to a specific schema
  sendNotificationToSchema(
    schemaName: string,
    notification: NotificationPayload,
  ) {
    this.server
      .to(`notifications-${schemaName}`)
      .emit('receiveNotification', notification);
  }
}
