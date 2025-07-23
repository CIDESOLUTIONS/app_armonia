import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } })
export class WebSocketService {
  @WebSocketServer() server: Server;

  sendToClient(clientId: string, event: string, data: any) {
    this.server.to(clientId).emit(event, data);
  }

  sendToAll(event: string, data: any) {
    this.server.emit(event, data);
  }
}
