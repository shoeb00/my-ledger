import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsDateString,
  IsString,
  IsOptional,
  IsEnum,
  IsIn,
  Min,
} from 'class-validator';
import { TransactionSortableFields } from '../enums/transactions-sort-fields';

export class GetTransactionsRequestDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  bookId: number;

  @ApiPropertyOptional({ default: 10 })
  @IsNumber()
  @Type(() => Number)
  limit: number = 10;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Type(() => Number)
  offset: number = 0;

  @ApiPropertyOptional({
    enum: TransactionSortableFields,
    default: TransactionSortableFields.createdAt,
  })
  @IsEnum(TransactionSortableFields)
  sort: TransactionSortableFields = TransactionSortableFields.createdAt;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsIn(['desc', 'asc'])
  order: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  createdBefore?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  createdAfter?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  paymentType?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  minAmount?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  maxAmount?: string;

  @ApiPropertyOptional({ description: 'Filter by category ID. Pass 0 to filter transactions with no category.' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  categoryId?: number;

  @ApiPropertyOptional({ description: 'Filter by payment method ID. Pass 0 to filter transactions with no payment method.' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  paymentMethodId?: number;
}
