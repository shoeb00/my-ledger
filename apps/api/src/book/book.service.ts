import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { CreateBookRequestDto } from './dto/create-book-request';
import { BookResponseDto } from './dto/book-response';
import { GetBookRequestDto } from './dto/get-book-request';
import { and, desc, eq, sql, schema } from '@my-ledger/db';
import type { DB } from '@my-ledger/db/connection';
import { Roles } from '../permissions/enum/roles';
import { RequestContextService } from '../common/request-context.service';
import { UpdateBookRequestDto } from './dto/update-book-request';
import { ChangeOwnerBookRequestDto } from './dto/change-owner-book-request';

@Injectable()
export class BookService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: DB,
    private readonly cxt: RequestContextService,
  ) { }

  async getBooks(query: GetBookRequestDto): Promise<BookResponseDto[]> {
    const { name, bookId } = query;
    const user = this.cxt.getUser();
    const rows = await this.db
      .select({
        book: schema.books,
        role: schema.permissions.role,
        lastTransaction: sql<Date>`max(${schema.transactions.createdAt})`.as('lastTransaction'),
      })
      .from(schema.permissions)
      .leftJoin(schema.books, eq(schema.books.id, schema.permissions.bookId))
      .leftJoin(
        schema.transactions,
        eq(schema.books.id, schema.transactions.bookId),
      )
      .where(eq(schema.permissions.userId, user.id))
      .groupBy(schema.books.id, schema.permissions.role)
      .orderBy(desc(schema.books.updatedAt));
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
    const row = await this.db.transaction(async () => {
      const [row] = await this.db
        .insert(schema.books)
        .values({ ...createBook, userId: user.id })
        .returning();
      if (!row) throw new InternalServerErrorException('Failed to create');
      await this.db.insert(schema.permissions).values({
        bookId: row.id,
        userId: user.id,
        role: Roles.AUTHOR,
      });
      await this._createDefaultCategoriesAndPayMethods(row.id);
      return row;
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
      .from(schema.permissions)
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
    await this.db.delete(schema.books).where(eq(schema.books.id, bookId));
    return;
  }

  private async _createDefaultCategoriesAndPayMethods(bookId: number) {
    const DEFAULT_CATEGORIES = [
      'Bills',
      'Maintenance',
      'Salary',
      'Food',
      'Transport',
      'Health',
      'Shopping',
      'Entertainment',
      'Education',
      'Investment',
    ];
    const DEFAULT_PAYMENT_METHODS = [
      'PhonePe',
      'GooglePay',
      'Cash',
      'Credit Card',
      'Debit Card',
      'Bank Transfer',
      'Paytm',
    ];
    await this.db.transaction(async () => {
      await this.db.insert(schema.categories).values(DEFAULT_CATEGORIES.map(name => ({ name, bookId })));
      await this.db.insert(schema.paymentMethods).values(DEFAULT_PAYMENT_METHODS.map(name => ({ name, bookId })));
    });
  }
}
