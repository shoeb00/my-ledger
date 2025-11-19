import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class UpdateBookRequestDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  bookId: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  name: string;
}
