import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class BookIdQueryRequestDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  bookId: number;
}

export class CreateTransactionsRequestDto {
  @ApiProperty()
  @IsNumberString()
  amount: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  paymentMethodId?: number | null = null;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string | null = null;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  categoryId?: number | null = null;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  categoryName?: string | null = null;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  paymentMethodName?: string | null = null;
}

class BulkCreateTransactionRecord extends CreateTransactionsRequestDto {
  @ApiProperty()
  @IsString()
  createdAt: string;
}
export class BulkCreateTransactionRequestDto {
  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(500)
  transactions: Array<BulkCreateTransactionRecord>;
}
