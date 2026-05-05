import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { CreateCategoryRequestDto } from './dto/category-request';
import { CategoryResponseDto } from './dto/category-response';
import { and, eq, schema } from '@my-ledger/db';
import type { DB } from '@my-ledger/db/connection';


@Injectable()
export class CategoryService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: DB,
  ) { }

  async getCategories(bookId: number): Promise<CategoryResponseDto[]> {
    const categories = await this.db.query.categories.findMany({
      where: eq(schema.categories.bookId, bookId),
      orderBy: (categories, { asc }) => [asc(categories.name)],
    });
    return categories.map((cat) => CategoryResponseDto.from(cat));
  }

  async createCategory(
    body: CreateCategoryRequestDto,
  ): Promise<CategoryResponseDto> {
    const existing = await this.db.query.categories.findFirst({
      where: and(
        eq(schema.categories.bookId, body.bookId),
        eq(schema.categories.name, body.name),
      ),
    });
    if (existing) {
      throw new BadRequestException('Category already exists');
    }

    const [row] = await this.db
      .insert(schema.categories)
      .values({
        bookId: body.bookId,
        name: body.name,
      })
      .returning();
    if (!row)
      throw new InternalServerErrorException('Failed to create category');
    return CategoryResponseDto.from(row);
  }

  async deleteCategory(id: number, bookId: number): Promise<void> {
    const category = await this.db.query.categories.findFirst({
      where: and(
        eq(schema.categories.id, id),
        eq(schema.categories.bookId, bookId),
      ),
    });
    if (!category) throw new BadRequestException('Category not found');

    await this.db
      .delete(schema.categories)
      .where(and(eq(schema.categories.id, id), eq(schema.categories.bookId, bookId)));
  }
}
