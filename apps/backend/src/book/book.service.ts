import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { CreateBookRequestDto } from './dto/create-book-request';
import { BookResponseDto } from './dto/book-response';
import { GetBookRequestDto } from './dto/get-book-request';

@Injectable()
export class BookService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}
  async createBook(
    createBook: CreateBookRequestDto,
  ): Promise<BookResponseDto | undefined> {
    const book = {
      name: createBook.name,
      description: createBook.description,
      userId: createBook.userId,
    };
    const [row] = await this.db.insert(schema.books).values(book).returning();
    return row;
  }

  async getBooks(getBook: GetBookRequestDto): Promise<BookResponseDto[]> {
    return await this.db.query.books.findMany();
  }
}
