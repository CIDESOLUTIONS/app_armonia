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
import { AssemblyService } from './assembly.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';
import {
  CreateAssemblyDto,
  UpdateAssemblyDto,
  CreateVoteDto,
  SubmitVoteDto,
} from '../common/dto/assembly.dto';

@UseGuards(JwtAuthGuard)
@Controller('assemblies')
export class AssemblyController {
  constructor(private readonly assemblyService: AssemblyService) {}

  @Post()
  async createAssembly(
    @GetUser() user: any,
    @Body() createAssemblyDto: CreateAssemblyDto,
  ) {
    return this.assemblyService.createAssembly(
      user.schemaName,
      createAssemblyDto,
      user.userId,
    );
  }

  @Get()
  async getAssemblies(@GetUser() user: any) {
    return this.assemblyService.getAssemblies(user.schemaName);
  }

  @Get(':id')
  async getAssemblyById(@GetUser() user: any, @Param('id') id: string) {
    return this.assemblyService.getAssemblyById(user.schemaName, +id);
  }

  @Put(':id')
  async updateAssembly(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateAssemblyDto: UpdateAssemblyDto,
  ) {
    return this.assemblyService.updateAssembly(
      user.schemaName,
      +id,
      updateAssemblyDto,
    );
  }

  @Delete(':id')
  async deleteAssembly(@GetUser() user: any, @Param('id') id: string) {
    return this.assemblyService.deleteAssembly(user.schemaName, +id);
  }

  @Post(':id/attendance')
  async registerAttendance(
    @GetUser() user: any,
    @Param('id') assemblyId: string,
    @Body() body: { unitId: number; present: boolean }, // Added unitId to body
  ) {
    return this.assemblyService.registerAttendance(
      user.schemaName,
      +assemblyId,
      user.userId,
      body.unitId,
    );
  }

  @Get(':id/quorum-status') // New endpoint for quorum status
  async getQuorumStatus(@GetUser() user: any, @Param('id') assemblyId: string) {
    return this.assemblyService.getAssemblyQuorumStatus(
      user.schemaName,
      +assemblyId,
    );
  }

  @Post(':id/votes')
  async createVote(
    @GetUser() user: any,
    @Param('id') assemblyId: string,
    @Body() createVoteDto: CreateVoteDto,
  ) {
    return this.assemblyService.createVote(
      user.schemaName,
      +assemblyId,
      createVoteDto,
    );
  }

  @Post(':voteId/submit-vote')
  async submitVote(
    @GetUser() user: any,
    @Param('voteId') voteId: string,
    @Body() submitVoteDto: SubmitVoteDto,
  ) {
    return this.assemblyService.castVote(
      user.schemaName,
      +voteId,
      user.userId,
      submitVoteDto.unitId,
      submitVoteDto.option,
    );
  }

  @Get(':voteId/results')
  async getVoteResults(@GetUser() user: any, @Param('voteId') voteId: string) {
    return this.assemblyService.calculateVoteResults(user.schemaName, +voteId);
  }

  @Post(':id/generate-minutes')
  async generateMeetingMinutes(
    @GetUser() user: any,
    @Param('id') assemblyId: string,
  ) {
    return this.assemblyService.generateMeetingMinutes(
      user.schemaName,
      +assemblyId,
    );
  }
}
