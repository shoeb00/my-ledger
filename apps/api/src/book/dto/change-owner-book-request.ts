import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class ChangeOwnerBookRequestDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  bookId: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  userId: number;
}
