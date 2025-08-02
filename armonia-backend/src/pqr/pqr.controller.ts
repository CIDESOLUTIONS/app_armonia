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
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { GetUser } from '../common/decorators/user.decorator';
import {
  CreatePQRDto,
  UpdatePQRDto,
  GetPQRParamsDto,
} from '../common/dto/pqr.dto';

@UseGuards(JwtAuthGuard)
@Controller('pqr')
export class PqrController {
  constructor(private readonly pqrService: PqrService) {}

  @Post()
  @UseGuards(RolesGuard([UserRole.RESIDENT]))
  async createPqr(@GetUser() user: any, @Body() createPQRDto: CreatePQRDto) {
    return this.pqrService.createPqr(user.schemaName, user.userId, {
      ...createPQRDto,
      residentialComplexId: user.residentialComplexId,
    });
  }

  @Get()
  @UseGuards(
    RolesGuard([UserRole.RESIDENT, UserRole.ADMIN, UserRole.COMPLEX_ADMIN]),
  )
  async getPqrs(
    @GetUser() user: any,
    @Query() filters: GetPQRParamsDto,
  ) {
    return this.pqrService.getPqrs(
      user.schemaName,
      user.userId,
      user.role,
      filters,
    );
  }

  @Get(':id')
  @UseGuards(
    RolesGuard([UserRole.RESIDENT, UserRole.ADMIN, UserRole.COMPLEX_ADMIN]),
  )
  async getPqrById(
    @GetUser() user: any,
    @Param('id') id: string,
  ) {
    return this.pqrService.getPqrById(
      user.schemaName,
      user.userId,
      user.role,
      id,
    );
  }

  @Put(':id')
  @UseGuards(
    RolesGuard([UserRole.RESIDENT, UserRole.ADMIN, UserRole.COMPLEX_ADMIN]),
  )
  async updatePqr(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updatePQRDto: UpdatePQRDto,
  ) {
    return this.pqrService.updatePqr(user.schemaName, id, updatePQRDto);
  }
}
