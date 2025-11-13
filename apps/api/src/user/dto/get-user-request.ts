import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class GetUserRequestDto {
  @ApiPropertyOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @Type(() => Number)
  id?: number;
}
