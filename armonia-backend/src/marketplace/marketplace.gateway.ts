import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';

@WebSocketGateway({ namespace: '/marketplace', cors: { origin: '*' } })
export class MarketplaceGateway {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('MarketplaceGateway');

  constructor(private readonly marketplaceService: MarketplaceService) {}

  afterInit(server: Server) {
    this.logger.log('MarketplaceGateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(
    @MessageBody() data: { listingId: number; userId: number },
    @ConnectedSocket() client: Socket,
  ): void {
    const roomName = `listing-${data.listingId}`;
    client.join(roomName);
    this.logger.log(
      `Client ${client.id} joined room ${roomName} for listing ${data.listingId}`,
    );
    // Optionally, send previous messages to the newly joined client
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    data: {
      listingId: number;
      senderId: number;
      receiverId: number;
      content: string;
      schemaName: string;
    },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.logger.log(
      `Received message for listing ${data.listingId} from ${data.senderId}: ${data.content}`,
    );

    // Save message to database
    const savedMessage = await this.marketplaceService.createMessage(
      data.schemaName,
      data,
    );

    // Emit message to all clients in the room
    this.server
      .to(`listing-${data.listingId}`)
      .emit('receiveMessage', savedMessage);
  }
}
