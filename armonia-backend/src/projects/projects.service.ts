import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProjectDto,
  UpdateProjectDto,
  CreateProjectTaskDto,
  UpdateProjectTaskDto,
  CreateProjectUpdateDto,
} from '../common/dto/projects.dto';