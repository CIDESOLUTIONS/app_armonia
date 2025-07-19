import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResidentialComplexDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  schemaName: string;

  @ApiProperty()
  adminId: number;

  @ApiProperty()
  contactEmail: string;

  @ApiProperty()
  contactPhone: string;

  @ApiProperty({ required: false, nullable: true })
  logoUrl?: string;

  @ApiProperty({ required: false, nullable: true })
  primaryColor?: string;

  @ApiProperty({ required: false, nullable: true })
  secondaryColor?: string;

  @ApiProperty()
  planId: number;

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
  schemaName: string;

  @ApiProperty()
  @IsInt()
  adminId: number;

  @ApiProperty()
  @IsString()
  contactEmail: string;

  @ApiProperty()
  @IsString()
  contactPhone: string;

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

  @ApiProperty()
  @IsInt()
  planId: number;

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
  @IsInt()
  planId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
