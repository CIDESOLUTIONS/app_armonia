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
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { GetUser } from '../../common/decorators/user.decorator';
import { ServiceProvidersService } from './service-providers.service';
import {
  CreateServiceProviderDto,
  UpdateServiceProviderDto,
  ServiceProviderDto,
  ServiceProviderFilterParamsDto,
  CreateReviewDto,
  ReviewDto,
} from '../../common/dto/service-providers.dto';

@UseGuards(JwtAuthGuard)
@Controller('service-providers')
export class ServiceProvidersController {
  constructor(
    private readonly serviceProvidersService: ServiceProvidersService,
  ) {}

  @Post()
  async createServiceProvider(
    @GetUser() user: any,
    @Body() createServiceProviderDto: CreateServiceProviderDto,
  ): Promise<ServiceProviderDto> {
    return this.serviceProvidersService.createServiceProvider(
      user.schemaName,
      createServiceProviderDto,
    );
  }

  @Get()
  async getServiceProviders(
    @GetUser() user: any,
    @Query() filters: ServiceProviderFilterParamsDto,
  ): Promise<ServiceProviderDto[]> {
    return this.serviceProvidersService.getServiceProviders(
      user.schemaName,
      filters,
    );
  }

  @Get(':id')
  async getServiceProviderById(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<ServiceProviderDto> {
    return this.serviceProvidersService.getServiceProviderById(
      user.schemaName,
      +id,
    );
  }

  @Put(':id')
  async updateServiceProvider(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateServiceProviderDto: UpdateServiceProviderDto,
  ): Promise<ServiceProviderDto> {
    return this.serviceProvidersService.updateServiceProvider(
      user.schemaName,
      +id,
      updateServiceProviderDto,
    );
  }

  @Delete(':id')
  async deleteServiceProvider(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<void> {
    return this.serviceProvidersService.deleteServiceProvider(
      user.schemaName,
      +id,
    );
  }

  @Post(':id/reviews')
  async addReview(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<ReviewDto> {
    return this.serviceProvidersService.addReview(
      user.schemaName,
      +id,
      user.userId,
      createReviewDto,
    );
  }

  @Get(':id/reviews')
  async getReviewsByServiceProvider(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<ReviewDto[]> {
    return this.serviceProvidersService.getReviewsByServiceProvider(
      user.schemaName,
      +id,
    );
  }
}
