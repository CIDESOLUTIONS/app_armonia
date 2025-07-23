import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  email: string;

  @IsString()
  password?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  role: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsNumber()
  @IsOptional()
  complexId?: number;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
