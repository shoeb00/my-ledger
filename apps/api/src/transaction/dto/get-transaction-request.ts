import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsDateString, IsString } from 'class-validator';

export class GetTransactionsRequestDto {
  @ApiProperty()
  @IsNumber()
  bookId: number;

  @ApiPropertyOptional()
  @IsNumber()
  limit: number = 10;

  @ApiPropertyOptional()
  @IsNumber()
  offset: number = 0;

  @ApiPropertyOptional()
  @IsString()
  sort: string = 'createdAt';

  @ApiPropertyOptional()
  @IsString()
  order: string = 'desc';

  @ApiPropertyOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional()
  @IsDateString()
  endDate?: Date;

  @ApiPropertyOptional()
  @IsNumber()
  userId?: number;

  @ApiPropertyOptional()
  @IsString()
  paymentType?: string;

  @ApiPropertyOptional()
  @IsString()
  description?: string;
}
