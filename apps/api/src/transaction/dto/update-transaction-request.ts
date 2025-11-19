import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class UpdateTransactionsRequestDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  bookId: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  transactionId: number;

  @ApiProperty()
  @IsString()
  paymentType: string;

  @ApiProperty()
  @IsString()
  description: string;
}
