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
import { and, eq, ilike, inArray } from 'drizzle-orm';
import { Roles } from '../permissions/enum/roles';

const schema = { ...bookSchema, permissions, users };

@Injectable()
export class BookService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async getBooks(query: GetBookRequestDto): Promise<BookResponseDto[]> {
    const perms = await this.db.query.permissions.findMany({
      where: eq(schema.permissions.userId, query.userId),
    });

    if (perms.length === 0) return [];

    const bookIds = perms.map((p) => p.bookId);
    const conditions = [inArray(schema.books.id, bookIds)];
    if (query.name)
      conditions.push(ilike(schema.books.name, `%${query.name}%`));
    if (query.bookId) conditions.push(eq(schema.books.id, query.bookId));
    return this.db.query.books.findMany({
      where: and(...conditions),
    });
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
