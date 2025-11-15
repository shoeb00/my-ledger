import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Roles } from '../../permissions/enum/roles';

export class BookResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  balance: string;

  @ApiProperty({ enum: Roles })
  role?: Roles;
}
