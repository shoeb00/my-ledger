import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { Roles } from '../enum/roles';
import { Type } from 'class-transformer';

export class SavePermissionsRequestDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  bookId: number;

  @ApiProperty({ enum: Roles })
  @IsEnum(Roles)
  role: Roles;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  userId: number;
}
