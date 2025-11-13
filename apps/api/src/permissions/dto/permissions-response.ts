import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '../enum/roles';
import { IsEnum } from 'class-validator';

export class PermissionsResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  bookId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  @IsEnum(Roles)
  role: Roles;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
