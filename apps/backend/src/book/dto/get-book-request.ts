import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetBookRequestDto {
  @ApiPropertyOptional()
  id?: number;

  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  authorId?: number;
}
