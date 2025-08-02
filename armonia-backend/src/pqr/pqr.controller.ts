import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PqrService } from './pqr.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';
import {
  PQRDto,
  GetPQRParamsDto,
  CreatePQRDto,
  UpdatePQRDto,
  PQRCommentDto,
} from '../common/dto/pqr.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@UseGuards(JwtAuthGuard)
@Controller('pqr')
export class PqrController {
  constructor(private readonly pqrService: PqrService) {}

  @Post()
  async createPqr(@GetUser() user: any, @Body() createPQRDto: CreatePQRDto) {
    return this.pqrService.createPqr(
      user.schemaName,
      user.userId,
      createPQRDto,
    );
  }

  @Get()
  async getPqrs(@GetUser() user: any, @Query() filters: GetPQRParamsDto) {
    return this.pqrService.getPqrs(
      user.schemaName,
      user.userId,
      user.role,
      filters,
    );
  }

  @Get(':id')
  async getPqrById(@GetUser() user: any, @Param('id') id: string) {
    return this.pqrService.getPqrById(
      user.schemaName,
      user.userId,
      user.role,
      id,
    );
  }

  @Put(':id')
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  async updatePqr(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updatePQRDto: UpdatePQRDto,
  ) {
    return this.pqrService.updatePqr(user.schemaName, id, updatePQRDto);
  }

  // Commented out as addComment is not implemented in PqrService
  /*
  @Post(':id/comments')
  async addComment(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() pqrCommentDto: PQRCommentDto,
  ) {
    return this.pqrService.addComment(
      user.schemaName,
      user.userId,
      id,
      pqrCommentDto,
    );
  }
  */
}