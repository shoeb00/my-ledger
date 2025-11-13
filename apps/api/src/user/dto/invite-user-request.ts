import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Roles } from '../../permissions/enum/roles';

type rolesEnum = Exclude<Roles, Roles.AUTHOR>;

export class InviteUserRequestDto {
  @ApiProperty()
  @IsEnum([Roles.EDITOR, Roles.VIEWER])
  role: rolesEnum;

  @ApiProperty()
  @IsNumber()
  bookId: number;

  @ApiProperty()
  @IsString()
  email: string;
}
