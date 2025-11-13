import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetBookRequestDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  bookId?: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  userId: number;
}
