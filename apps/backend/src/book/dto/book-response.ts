import { ApiProperty } from '@nestjs/swagger';
import { GetBookRequestDto } from './get-book-request';
import { IsDate, IsString } from 'class-validator';

export class BookResponseDto extends GetBookRequestDto {
  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  updatedAt: Date;

  @ApiProperty()
  @IsString()
  balance: string;
}
