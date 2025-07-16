import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CommunicationsService } from './communications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';
import {
  NotificationDataDto,
  AnnouncementDataDto,
  MessageDataDto,
  EventDataDto,
} from '../common/dto/communications.dto';

@UseGuards(JwtAuthGuard)
@Controller('communications')
export class CommunicationsController {
  constructor(private readonly communicationsService: CommunicationsService) {}

  // NOTIFICACIONES
  @Get('notifications')
  async getUserNotifications(@GetUser() user: any, @Query() filters: any) {
    return this.communicationsService.getUserNotifications(
      user.userId,
      filters,
    );
  }

  @Post('notifications/mark-read/:id')
  async markNotificationAsRead(@GetUser() user: any, @Param('id') id: string) {
    return this.communicationsService.markNotificationAsRead(id, user.userId);
  }

  @Post('notifications/mark-all-read')
  async markAllNotificationsAsRead(@GetUser() user: any) {
    return this.communicationsService.markAllNotificationsAsRead(user.userId);
  }

  @Post('notifications/confirm-reading/:id')
  async confirmNotificationReading(
    @GetUser() user: any,
    @Param('id') id: string,
  ) {
    return this.communicationsService.confirmNotificationReading(
      id,
      user.userId,
    );
  }

  // ANUNCIOS
  @Get('announcements')
  async getAnnouncements(@GetUser() user: any, @Query() filters: any) {
    return this.communicationsService.getAnnouncements(
      user.schemaName,
      user.userId,
      user.role,
      filters,
    );
  }

  @Post('announcements')
  async createAnnouncement(
    @GetUser() user: any,
    @Body() createAnnouncementDto: AnnouncementDataDto,
  ) {
    return this.communicationsService.createAnnouncement(
      user.schemaName,
      user.userId,
      createAnnouncementDto,
    );
  }

  @Put('announcements/:id')
  async updateAnnouncement(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateAnnouncementDto: AnnouncementDataDto,
  ) {
    return this.communicationsService.updateAnnouncement(
      user.schemaName,
      +id,
      updateAnnouncementDto,
    );
  }

  @Delete('announcements/:id')
  async deleteAnnouncement(@GetUser() user: any, @Param('id') id: string) {
    return this.communicationsService.deleteAnnouncement(user.schemaName, +id);
  }

  // MENSAJES
  @Get('messages/conversation/:id')
  async getConversationMessages(
    @GetUser() user: any,
    @Param('id') conversationId: string,
    @Query() options: any,
  ) {
    return this.communicationsService.getConversationMessages(
      user.schemaName,
      conversationId,
      user.userId,
      options,
    );
  }

  @Post('messages/:id')
  async sendMessage(
    @GetUser() user: any,
    @Param('id') conversationId: string,
    @Body() messageDto: MessageDataDto,
  ) {
    return this.communicationsService.sendMessage(
      user.schemaName,
      conversationId,
      user.userId,
      messageDto,
    );
  }

  @Post('messages/mark-read/:id')
  async markMessageAsRead(
    @GetUser() user: any,
    @Param('id') messageId: string,
  ) {
    return this.communicationsService.markMessageAsRead(
      user.schemaName,
      messageId,
      user.userId,
    );
  }

  // EVENTOS COMUNITARIOS
  @Get('events')
  async getEvents(@GetUser() user: any, @Query() filters: any) {
    return this.communicationsService.getEvents(
      user.schemaName,
      user.userId,
      user.role,
      filters,
    );
  }

  @Post('events')
  async createEvent(
    @GetUser() user: any,
    @Body() createEventDto: EventDataDto,
  ) {
    return this.communicationsService.createEvent(
      user.schemaName,
      user.userId,
      createEventDto,
    );
  }

  @Put('events/:id')
  async updateEvent(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateEventDto: EventDataDto,
  ) {
    return this.communicationsService.updateEvent(
      user.schemaName,
      +id,
      updateEventDto,
    );
  }

  @Delete('events/:id')
  async deleteEvent(@GetUser() user: any, @Param('id') id: string) {
    return this.communicationsService.deleteEvent(user.schemaName, +id);
  }
}
