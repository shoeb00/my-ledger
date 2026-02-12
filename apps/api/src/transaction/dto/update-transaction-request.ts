import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateTransactionsRequestDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  bookId: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  transactionId: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  paymentMethodId?: number | null = null;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string | null = null;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  categoryId?: number | null = null;
}
