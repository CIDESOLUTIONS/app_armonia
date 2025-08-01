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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MarketplaceService } from './marketplace.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';
import {
  CreateListingDto,
  UpdateListingDto,
  ListingFilterParamsDto,
  ReportListingDto,
  ResolveReportDto,
  CreateMessageDto,
  MessageDto,
} from '../common/dto/marketplace.dto';

@UseGuards(JwtAuthGuard)
@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.marketplaceService.uploadImage(file);
  }

  @Post('messages')
  async createMessage(
    @GetUser() user: any,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.marketplaceService.createMessage(user.schemaName, {
      ...createMessageDto,
      senderId: user.userId, // Ensure senderId is from authenticated user
    });
  }

  @Get('messages/:listingId')
  async getMessages(
    @GetUser() user: any,
    @Param('listingId') listingId: string,
  ) {
    return this.marketplaceService.getMessages(
      user.schemaName,
      +listingId,
      user.userId,
    );
  }

  @Post('listings')
  async createListing(
    @GetUser() user: any,
    @Body() createListingDto: CreateListingDto,
  ) {
    return this.marketplaceService.createListing(
      user.schemaName,
      user.userId,
      createListingDto,
    );
  }

  @Get('listings')
  async getListings(
    @GetUser() user: any,
    @Query() filters: ListingFilterParamsDto,
  ) {
    return this.marketplaceService.getListings(user.schemaName, filters);
  }

  @Get('listings/:id')
  async getListingById(@GetUser() user: any, @Param('id') id: string) {
    return this.marketplaceService.getListingById(user.schemaName, +id);
  }

  @Put('listings/:id')
  async updateListing(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateListingDto: UpdateListingDto,
  ) {
    return this.marketplaceService.updateListing(
      user.schemaName,
      +id,
      user.userId,
      updateListingDto,
    );
  }

  @Delete('listings/:id')
  async deleteListing(@GetUser() user: any, @Param('id') id: string) {
    return this.marketplaceService.deleteListing(
      user.schemaName,
      +id,
      user.userId,
    );
  }

  @Post('listings/report')
  async reportListing(
    @GetUser() user: any,
    @Body() reportListingDto: ReportListingDto,
  ) {
    return this.marketplaceService.reportListing(
      user.schemaName,
      reportListingDto.listingId,
      user.userId,
      reportListingDto.reason,
    );
  }

  @Get('moderation/reports')
  async getReportedListings(@GetUser() user: any) {
    // Solo administradores de conjunto pueden acceder a esto
    return this.marketplaceService.getReportedListings(user.schemaName);
  }

  @Post('moderation/reports/:id/resolve')
  async resolveReport(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() resolveReportDto: ResolveReportDto,
  ) {
    // Solo administradores de conjunto pueden acceder a esto
    return this.marketplaceService.resolveReport(
      user.schemaName,
      +id,
      resolveReportDto.action,
    );
  }

  @Get('categories')
  async getCategories() {
    return this.marketplaceService.getListingCategories();
  }
}
