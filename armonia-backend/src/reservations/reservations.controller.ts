import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { GetUser } from '../../common/decorators/user.decorator';
import { ReservationsService } from './reservations.service';
import {
  CreateReservationDto,
  UpdateReservationDto,
  ReservationDto,
  ReservationFilterParamsDto,
  CreateCommonAreaDto,
  UpdateCommonAreaDto,
  CommonAreaDto,
  ReservationStatus,
} from '../../common/dto/reservations.dto';

@UseGuards(JwtAuthGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  // Common Area Endpoints
  @Post('common-areas')
  async createCommonArea(
    @GetUser() user: any,
    @Body() createCommonAreaDto: CreateCommonAreaDto,
  ): Promise<CommonAreaDto> {
    return this.reservationsService.createCommonArea(user.schemaName, createCommonAreaDto);
  }

  @Get('common-areas')
  async getCommonAreas(@GetUser() user: any): Promise<CommonAreaDto[]> {
    return this.reservationsService.getCommonAreas(user.schemaName);
  }

  @Get('common-areas/:id')
  async getCommonAreaById(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<CommonAreaDto> {
    return this.reservationsService.getCommonAreaById(user.schemaName, +id);
  }

  @Put('common-areas/:id')
  async updateCommonArea(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateCommonAreaDto: UpdateCommonAreaDto,
  ): Promise<CommonAreaDto> {
    return this.reservationsService.updateCommonArea(user.schemaName, +id, updateCommonAreaDto);
  }

  @Delete('common-areas/:id')
  async deleteCommonArea(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<void> {
    return this.reservationsService.deleteCommonArea(user.schemaName, +id);
  }

  // Reservation Endpoints
  @Post()
  async createReservation(
    @GetUser() user: any,
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<ReservationDto> {
    return this.reservationsService.createReservation(user.schemaName, createReservationDto);
  }

  @Get()
  async getReservations(
    @GetUser() user: any,
    @Query() filters: ReservationFilterParamsDto,
  ): Promise<ReservationDto[]> {
    return this.reservationsService.getReservations(user.schemaName, filters);
  }

  @Get(':id')
  async getReservationById(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<ReservationDto> {
    return this.reservationsService.getReservationById(user.schemaName, +id);
  }

  @Put(':id')
  async updateReservation(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ): Promise<ReservationDto> {
    return this.reservationsService.updateReservation(user.schemaName, +id, updateReservationDto);
  }

  @Put(':id/status')
  async updateReservationStatus(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body('status') status: ReservationStatus,
  ): Promise<ReservationDto> {
    return this.reservationsService.updateReservationStatus(user.schemaName, +id, status);
  }

  @Delete(':id')
  async deleteReservation(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<void> {
    return this.reservationsService.deleteReservation(user.schemaName, +id);
  }
}