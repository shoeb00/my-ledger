import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsDateString, IsString, IsOptional } from 'class-validator';

export class GetTransactionsRequestDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  bookId: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  limit: number = 10;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  offset: number = 0;

  @ApiPropertyOptional()
  @IsString()
  sort: string = 'createdAt';

  @ApiPropertyOptional()
  @IsString()
  order: string = 'desc';

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  userId?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  paymentType?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}
