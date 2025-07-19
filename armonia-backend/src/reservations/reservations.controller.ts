import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { GetUser } from '../../common/decorators/user.decorator';
import { ReservationsService } from './reservations.service';
import {
  CreateReservationDto,
  UpdateReservationDto,
  ReservationDto,
  ReservationFilterParamsDto,
  ReservationStatus,
} from '../../common/dto/reservations.dto';

@UseGuards(JwtAuthGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  // Reservation Endpoints
  @Post()
  async createReservation(
    @GetUser() user: any,
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<ReservationDto> {
    return this.reservationsService.createReservation(
      user.schemaName,
      createReservationDto,
    );
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
    return this.reservationsService.updateReservation(
      user.schemaName,
      +id,
      updateReservationDto,
    );
  }

  @Put(':id/status')
  async updateReservationStatus(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body('status') status: ReservationStatus,
  ): Promise<ReservationDto> {
    return this.reservationsService.updateReservationStatus(
      user.schemaName,
      +id,
      status,
    );
  }

  @Delete(':id')
  async deleteReservation(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<void> {
    return this.reservationsService.deleteReservation(user.schemaName, +id);
  }

  @Post(':id/approve')
  async approveReservation(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<ReservationDto> {
    return this.reservationsService.approveReservation(
      user.schemaName,
      +id,
      user.userId,
    );
  }

  @Post(':id/reject')
  async rejectReservation(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body('reason') reason: string,
  ): Promise<ReservationDto> {
    return this.reservationsService.rejectReservation(
      user.schemaName,
      +id,
      user.userId,
      reason,
    );
  }
}
