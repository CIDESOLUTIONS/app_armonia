import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResidentialComplexDto {
  @ApiProperty()
  id: string; // Changed to string

  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  planId: string; // Changed to string

  @ApiProperty()
  @IsOptional()
  status?: string; // Added

  @ApiProperty()
  @IsOptional()
  adminId?: string; // Changed to string

  @ApiProperty()
  @IsOptional()
  contactEmail?: string; // Added

  @ApiProperty()
  @IsOptional()
  contactPhone?: string; // Added

  @ApiProperty({ required: false, nullable: true })
  logoUrl?: string;

  @ApiProperty({ required: false, nullable: true })
  primaryColor?: string;

  @ApiProperty({ required: false, nullable: true })
  secondaryColor?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CreateResidentialComplexDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsString()
  planId: string; // Changed to string

  @ApiProperty()
  @IsOptional()
  @IsString()
  status?: string; // Added

  @ApiProperty()
  @IsOptional()
  @IsString()
  adminId?: string; // Changed to string

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactEmail?: string; // Added

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactPhone?: string; // Added

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  primaryColor?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  secondaryColor?: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateResidentialComplexDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  contactEmail?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  primaryColor?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  secondaryColor?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  planId?: string; // Changed to string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string; // Added

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  adminId?: string; // Changed to string
}
