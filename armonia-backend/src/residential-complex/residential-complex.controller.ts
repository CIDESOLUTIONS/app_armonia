import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ResidentialComplexService } from './residential-complex.service'; // Restored original path
import {
  CreateResidentialComplexDto,
  UpdateResidentialComplexDto,
} from '../common/dto/residential-complex.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN]))
@Controller('residential-complexes')
export class ResidentialComplexController {
  constructor(
    private readonly residentialComplexService: ResidentialComplexService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async create(
    @Body() createResidentialComplexDto: CreateResidentialComplexDto,
  ) {
    return this.residentialComplexService.createComplexAndSchema(
      createResidentialComplexDto,
    );
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll() {
    return this.residentialComplexService.getResidentialComplexes();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.COMPLEX_ADMIN)
  async findOne(@Param('id') id: string) {
    return this.residentialComplexService.getResidentialComplexById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.COMPLEX_ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateResidentialComplexDto: UpdateResidentialComplexDto,
  ) {
    return this.residentialComplexService.updateResidentialComplex(
      id,
      updateResidentialComplexDto,
    );
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    return this.residentialComplexService.deleteResidentialComplex(id);
  }
}
