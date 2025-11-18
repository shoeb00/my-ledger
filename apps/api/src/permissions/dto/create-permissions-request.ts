import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber } from 'class-validator';
import { Roles } from '../enum/roles';
import { Type } from 'class-transformer';

export class UpdatePermissionsRequestDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  bookId: number;

  @ApiProperty({ enum: [Roles.EDITOR, Roles.VIEWER] })
  @IsIn([Roles.EDITOR, Roles.VIEWER])
  role: Exclude<Roles, Roles.AUTHOR>;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  userId: number;
}
