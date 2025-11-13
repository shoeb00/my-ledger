import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { Roles } from '../enum/roles';

export type rolesEnum = Exclude<Roles, Roles.AUTHOR>;

export class SavePermissionsRequestDto {
  @ApiProperty()
  @IsNumber()
  bookId: number;

  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsEnum([Roles.EDITOR, Roles.VIEWER])
  role: rolesEnum;
}
