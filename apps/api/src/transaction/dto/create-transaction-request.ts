import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTransactionsRequestDto {
  @ApiProperty()
  @IsNumber()
  bookId: number;

  @ApiProperty()
  @IsString()
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
