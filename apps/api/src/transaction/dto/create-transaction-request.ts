import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateTransactionsRequestDto {
  @ApiProperty()
  @IsNumber()
  bookId: number;

  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsString()
  amount: string;

  @ApiPropertyOptional()
  @IsString()
  paymentType?: string;

  @ApiPropertyOptional()
  @IsString()
  description?: string;
}
