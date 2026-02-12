import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../schema';

export class CategoryResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  bookId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static from(category: Category): CategoryResponseDto {
    return {
      id: category.id,
      bookId: category.bookId,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
