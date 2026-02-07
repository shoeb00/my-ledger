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
import { and, eq, sql } from 'drizzle-orm';
import { Roles } from '../permissions/enum/roles';
import { RequestContextService } from '../common/request-context.service';
import { UpdateBookRequestDto } from './dto/update-book-request';
import { transactions } from '../transaction/schema';
import { ChangeOwnerBookRequestDto } from './dto/change-owner-book-request';
import { invitations } from '../invitations/schema';

const schema = { ...bookSchema, permissions, users, invitations, transactions };

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
    const rows = await this.db
      .select({
        book: schema.books,
        role: schema.permissions.role,
        lastTransaction: sql`max(${schema.transactions.createdAt})`,
      })
      .from(schema.permissions)
      .leftJoin(schema.books, eq(schema.books.id, schema.permissions.bookId))
      .leftJoin(
        schema.transactions,
        eq(schema.books.id, schema.transactions.bookId),
      )
      .where(eq(schema.permissions.userId, user.id))
      .groupBy(schema.books.id, schema.permissions.role);
    if (rows.length === 0) return [];
    const books: BookResponseDto[] = [];
    for (const row of rows) {
      if (name && !row.book?.name.includes(name)) continue;
      if (bookId && row.book?.id !== bookId) continue;
      books.push({
        ...row.book!,
        role: row.role,
        lastTransaction: row.lastTransaction as Date,
      });
    }
    return books;
  }

  async createBook(createBook: CreateBookRequestDto): Promise<BookResponseDto> {
    const user = this.cxt.getUser();
    const count = await this.db.$count(
      schema.books,
      eq(schema.books.userId, user.id),
    );
    if (count >= (Number(process.env.BOOKS_LIMIT) || 5))
      throw new InternalServerErrorException('Max books reached');
    const [row] = await this.db
      .insert(schema.books)
      .values({ ...createBook, userId: user.id })
      .returning();
    if (!row) throw new InternalServerErrorException('Failed to create');
    await this.db.insert(permissions).values({
      bookId: row.id,
      userId: user.id,
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

  async changeOwner(query: ChangeOwnerBookRequestDto): Promise<void> {
    const { id: authorId } = this.cxt.getUser();
    await this.db.transaction(async () => {
      await this.db
        .update(schema.permissions)
        .set({ role: Roles.AUTHOR, updatedAt: sql`now()` })
        .where(
          and(
            eq(schema.permissions.userId, query.userId),
            eq(schema.permissions.bookId, query.bookId),
          ),
        );
      await this.db
        .update(schema.permissions)
        .set({ role: Roles.EDITOR, updatedAt: sql`now()` })
        .where(
          and(
            eq(schema.permissions.userId, authorId),
            eq(schema.permissions.bookId, query.bookId),
          ),
        );
    });
  }

  async updateBook(query: UpdateBookRequestDto): Promise<BookResponseDto> {
    const [row] = await this.db
      .update(schema.books)
      .set({ ...query, updatedAt: sql`now()` })
      .where(eq(schema.books.id, query.bookId))
      .returning();
    if (!row) throw new InternalServerErrorException('Failed to update');
    return row;
  }

  async deleteBook(bookId: number) {
    await this.db.transaction(async () => {
      await this.db
        .delete(schema.invitations)
        .where(eq(schema.invitations.bookId, bookId));
      await this.db
        .delete(schema.transactions)
        .where(eq(schema.transactions.bookId, bookId));
      await this.db
        .delete(schema.permissions)
        .where(eq(schema.permissions.bookId, bookId));
      await this.db.delete(schema.books).where(eq(schema.books.id, bookId));
      return;
    });
  }
}
