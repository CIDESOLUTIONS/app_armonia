import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query, Request } from '@nestjs/common';
import { PqrService } from './pqr.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('pqr')
export class PqrController {
  constructor(private readonly pqrService: PqrService) {}

  @Get()
  async getPQRs(@GetUser() user: any, @Query() filters: any) {
    return this.pqrService.getPQRs(user.schemaName, filters);
  }

  @Get(':id')
  async getPQRById(@GetUser() user: any, @Param('id') id: string) {
    return this.pqrService.getPQRById(user.schemaName, +id);
  }

  @Post()
  async createPQR(@GetUser() user: any, @Body() createPQRDto: any) {
    return this.pqrService.createPQR(user.schemaName, { ...createPQRDto, reportedById: user.userId });
  }

  @Put(':id')
  async updatePQR(@GetUser() user: any, @Param('id') id: string, @Body() updatePQRDto: any) {
    return this.pqrService.updatePQR(user.schemaName, +id, updatePQRDto);
  }

  @Delete(':id')
  async deletePQR(@GetUser() user: any, @Param('id') id: string) {
    return this.pqrService.deletePQR(user.schemaName, +id);
  }

  @Post(':id/comment')
  async addPQRComment(@GetUser() user: any, @Param('id') pqrId: string, @Body('comment') comment: string) {
    return this.pqrService.addPQRComment(user.schemaName, +pqrId, comment, user.userId);
  }

  @Put(':id/assign')
  async assignPQR(@GetUser() user: any, @Param('id') pqrId: string, @Body('assignedToId') assignedToId: number) {
    return this.pqrService.assignPQR(user.schemaName, +pqrId, assignedToId);
  }
}