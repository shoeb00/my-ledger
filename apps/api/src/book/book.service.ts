import { permissions } from './../permissions/schema';
import { users } from './../user/schema';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as bookSchema from './schema';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { CreateBookRequestDto } from './dto/create-book-request';
import { BookResponseDto } from './dto/book-response';
import { GetBookRequestDto } from './dto/get-book-request';
import { eq } from 'drizzle-orm';
import { Roles } from '../permissions/enum/roles';
import { RequestContextService } from '../common/request-context.service';

const schema = { ...bookSchema, permissions, users };

@Injectable()
export class BookService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly cxt: RequestContextService,
  ) {}

  async getBooks(query: GetBookRequestDto): Promise<BookResponseDto[]> {
    const { name, bookId } = query;
    const user = this.cxt.getUser();
    console.log(user);
    const rows = await this.db
      .select({
        book: schema.books,
        role: schema.permissions.role,
      })
      .from(schema.permissions)
      .leftJoin(schema.books, eq(schema.books.id, schema.permissions.bookId))
      .where(eq(schema.permissions.userId, query.userId));
    if (rows.length === 0) return [];
    const books: BookResponseDto[] = [];
    for (const row of rows) {
      if (name && !row.book?.name.includes(name)) continue;
      if (bookId && row.book?.id !== bookId) continue;
      books.push({ ...row.book!, role: row.role });
    }
    return books;
  }

  async createBook(createBook: CreateBookRequestDto): Promise<BookResponseDto> {
    const [row] = await this.db
      .insert(schema.books)
      .values(createBook)
      .returning();
    if (!row) throw new InternalServerErrorException('Failed to create');
    await this.db.insert(permissions).values({
      bookId: row.id,
      userId: createBook.userId,
      role: Roles.AUTHOR,
    });
    return row;
  }

  async getMembers(id: number) {
    return await this.db
      .select({
        userId: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        role: schema.permissions.role,
      })
      .from(permissions)
      .leftJoin(schema.users, eq(schema.users.id, schema.permissions.userId))
      .where(eq(schema.permissions.bookId, id));
  }
}
