import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTransactionsRequestDto {
  @ApiProperty()
  @IsNumber()
  bookId: number;

  @ApiProperty()
  @IsNumberString()
  amount: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  paymentType?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}
