import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNumber } from 'class-validator';
import { Roles } from '../../permissions/enum/roles';

export class InviteUserRequestDto {
  @ApiProperty({ enum: [Roles.VIEWER] })
  @IsIn([Roles.VIEWER])
  role: typeof Roles.VIEWER;

  @ApiProperty()
  @IsNumber()
  bookId: number;

  @ApiProperty()
  @IsEmail()
  email: string;
}
