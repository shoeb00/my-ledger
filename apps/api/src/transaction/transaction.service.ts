import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as transactionsSchema from './schema';
import * as booksSchema from '../book/schema';
import * as userSchema from '../user/schema';
import * as paymentMethodsSchema from '../payment-method/schema';
import * as categoriesSchema from '../category/schema';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { GetTransactionsRequestDto } from './dto/get-transaction-request';
import {
  TransactionListResponseDto,
  TransactionResponseDto,
} from './dto/transaction-response';
import {
  and,
  asc,
  desc,
  eq,
  gte,
  inArray,
  isNull,
  like,
  lte,
  SQL,
  sql,
} from 'drizzle-orm';
import {
  BulkCreateTransactionRequestDto,
  CreateTransactionsRequestDto,
} from './dto/create-transaction-request';
import { RequestContextService } from '../common/request-context.service';
import { UpdateTransactionsRequestDto } from './dto/update-transaction-request';
import { getTableColumns } from 'drizzle-orm';

const schema = {
  ...transactionsSchema,
  ...booksSchema,
  ...userSchema,
  ...paymentMethodsSchema,
  ...categoriesSchema,
};

@Injectable()
export class TransactionService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly cxt: RequestContextService,
  ) { }

  async get(id: number): Promise<TransactionResponseDto> {
    const record = await this.db.query.transactions.findFirst({
      where: eq(schema.transactions.id, id),
      with: {
        paymentMethod: true,
        category: true,
      },
    });

    if (!record) {
      throw new NotFoundException('Transaction not found');
    }
    return {
      ...record,
      paymentMethodName: record.paymentMethod?.name ?? null,
      categoryName: record.category?.name ?? null,
    };
  }

  async getAll(
    request: GetTransactionsRequestDto,
  ): Promise<TransactionListResponseDto> {
    const { limit, offset, order, sort, ...rest } = request;
    const conditions: SQL[] = [];
    for (const [key, value] of Object.entries(rest)) {
      if (!value) continue;
      switch (key) {
        case 'bookId':
          conditions.push(eq(schema.transactions.bookId, Number(value)));
          break;
        case 'userId':
          conditions.push(eq(schema.transactions.userId, Number(value)));
          break;
        case 'minAmount':
          conditions.push(gte(schema.transactions.amount, value.toString()));
          break;
        case 'createdAfter':
          conditions.push(
            gte(schema.transactions['createdAt'], new Date(value)),
          );
          break;
        case 'maxAmount':
          conditions.push(lte(schema.transactions.amount, value.toString()));
          break;
        case 'createdBefore':
          conditions.push(
            lte(schema.transactions['createdAt'], new Date(value)),
          );
          break;
        case 'description':
          conditions.push(
            like(schema.transactions[key], `%${value as string}%`),
          );
          break;
        case 'categoryId':
          if (Number(value) === 0) {
            conditions.push(isNull(schema.transactions.categoryId));
          } else {
            conditions.push(eq(schema.transactions.categoryId, Number(value)));
          }
          break;
        case 'paymentMethodId':
          if (Number(value) === 0) {
            conditions.push(isNull(schema.transactions.paymentMethodId));
          } else {
            conditions.push(eq(schema.transactions.paymentMethodId, Number(value)));
          }
          break;
      }
    }
    const orderDirection = order === 'desc' ? desc : asc;

    try {
      const data = await this.db
        .select({
          ...getTableColumns(schema.transactions),
          name: schema.users.name,
          email: schema.users.email,
          paymentMethodName: schema.paymentMethods.name,
          categoryName: schema.categories.name,
        })
        .from(schema.transactions)
        .leftJoin(schema.users, eq(schema.transactions.userId, schema.users.id))
        .leftJoin(
          schema.paymentMethods,
          eq(schema.transactions.paymentMethodId, schema.paymentMethods.id),
        )
        .leftJoin(
          schema.categories,
          eq(schema.transactions.categoryId, schema.categories.id),
        )
        .where(and(...conditions))
        .orderBy(orderDirection(schema.transactions[sort]))
        .limit(limit)
        .offset(offset);

      const count = await this.db.$count(
        transactionsSchema.transactions,
        and(...conditions),
      );
      return { data: data as TransactionResponseDto[], count };
    } catch (error) {
      console.error('Error in getAll transactions:', error);
      throw error;
    }
  }

  async create(
    body: CreateTransactionsRequestDto,
    bookId: number,
  ): Promise<TransactionResponseDto> {
    const user = this.cxt.getUser();
    if (parseFloat(body.amount) === 0)
      throw new BadRequestException('Amount cannot be 0');

    if (!body.paymentMethodId && body.paymentMethodName) {
      const [row] = await this.db.insert(schema.paymentMethods).values({
        name: body.paymentMethodName,
        bookId,
      }).returning({ id: schema.paymentMethods.id })
      if (!row) throw new InternalServerErrorException('Failed to create payment method');
      body.paymentMethodId = row.id;
    }
    if (!body.categoryId && body.categoryName) {
      const [row] = await this.db.insert(schema.categories).values({
        name: body.categoryName,
        bookId,
      }).returning({ id: schema.categories.id })
      if (!row) throw new InternalServerErrorException('Failed to create category');
      body.categoryId = row.id;
    }

    return await this.db.transaction(async (tx) => {
      const [row] = await tx
        .insert(schema.transactions)
        .values({
          ...body,
          userId: user.id,
          bookId,
          paymentMethodId: body.paymentMethodId,
          categoryId: body.categoryId,
          createdAt: body.createdAt ? new Date(body.createdAt) : new Date(),
        })
        .returning();
      const transactionType =
        parseFloat(body.amount) > 0 ? 'credited' : 'debited';
      const amount = Math.abs(parseFloat(body.amount));
      await tx
        .update(schema.books)
        .set({
          [transactionType]: sql`${booksSchema.books[transactionType]} + ${amount} `,
          balance: sql`${booksSchema.books.balance} + ${body.amount}::numeric`,
          updatedAt: sql`now()`,
        })
        .where(eq(schema.books.id, bookId));
      if (!row) throw new InternalServerErrorException('Failed to create');
      return row;
    })
  }

  async createBulk(
    body: BulkCreateTransactionRequestDto,
    bookId: number,
  ): Promise<{ message: string }> {
    const user = this.cxt.getUser();
    let balance = 0;
    let credited = 0;
    let debited = 0;
    type Transaction = Omit<transactionsSchema.Transaction, 'id'>;
    const transactions: Array<Transaction> = [];

    const paymentMethods = new Set(
      body.transactions
        .map((t) => t.paymentMethodName)
        .filter((t) => t != null),
    );
    const categories = new Set(
      body.transactions.map((t) => t.categoryName).filter((t) => t != null),
    );

    const paymentMethodMap = await this._getOrCreatePaymentMethodOrCategory(
      bookId,
      Array.from(paymentMethods),
      'paymentMethods',
    );
    const categoryMap = await this._getOrCreatePaymentMethodOrCategory(
      bookId,
      Array.from(categories),
      'categories',
    );

    for (const transaction of body.transactions) {
      const {
        amount,
        createdAt,
        paymentMethodName,
        categoryName,
        paymentMethodId,
        categoryId,
      } = transaction;

      if (parseFloat(amount) === 0)
        throw new BadRequestException('Amount cannot be 0');
      balance += parseFloat(amount);
      if (parseFloat(amount) > 0) credited += Math.abs(parseFloat(amount));
      if (parseFloat(amount) < 0) debited += Math.abs(parseFloat(amount));
      const createdAtDate = createdAt ? new Date(createdAt) : new Date();

      const payId =
        paymentMethodId ||
        (paymentMethodName ? paymentMethodMap.get(paymentMethodName)! : null);
      const catId =
        categoryId || (categoryName ? categoryMap.get(categoryName)! : null);

      transactions.push({
        ...transaction,
        createdAt: createdAtDate,
        userId: user.id,
        updatedAt: new Date(),
        description: transaction.description ?? null,
        bookId,
        paymentMethodId: payId,
        categoryId: catId,
      });
    }
    if (transactions.length === 0)
      throw new BadRequestException('No transactions found');
    await this.db.transaction(async (tx) => {
      await tx
        .insert(schema.transactions)
        .values(transactions)
        .returning({ id: schema.transactions.id });
      await tx
        .update(schema.books)
        .set({
          balance: sql`${booksSchema.books.balance} + ${balance}::numeric`,
          credited: sql`${booksSchema.books.credited} + ${credited}::numeric`,
          debited: sql`${booksSchema.books.debited} + ${debited}::numeric`,
          updatedAt: sql`now()`,
        })
        .where(eq(schema.books.id, bookId));
    });
    return {
      message: 'Transactions created successfully',
    };
  }

  async update(
    query: UpdateTransactionsRequestDto,
  ): Promise<TransactionResponseDto> {
    const record = await this.db.query.transactions.findFirst({
      where: and(
        eq(schema.transactions.id, query.transactionId),
        eq(schema.transactions.bookId, query.bookId),
      ),
    });
    if (!record) throw new NotFoundException('Transaction not found');
    const [updatedRow] = await this.db
      .update(schema.transactions)
      .set({
        paymentMethodId: query.paymentMethodId,
        description: query.description,
        categoryId: query.categoryId,
        updatedAt: sql`now()`,
        ...(query.createdAt && { createdAt: new Date(query.createdAt) }),
      })
      .where(
        and(
          eq(schema.transactions.id, query.transactionId),
          eq(schema.transactions.bookId, query.bookId),
        ),
      )
      .returning();
    if (!updatedRow) throw new InternalServerErrorException('Failed to update');
    return updatedRow;
  }

  async delete(id: number, bookId: number): Promise<void> {
    await this.db.transaction(async (tx) => {
      const [record] = await tx
        .delete(schema.transactions)
        .where(
          and(
            eq(schema.transactions.id, id),
            eq(schema.transactions.bookId, bookId),
          ),
        )
        .returning({
          amount: schema.transactions.amount,
        });

      if (!record) throw new NotFoundException('Transaction not found');

      const key = Number(record.amount) > 0 ? 'credited' : 'debited';

      await tx.update(schema.books).set({
        balance: sql`${schema.books.balance} - ${record.amount}::numeric`,
        [key]: sql`${schema.books[key]} - ABS(${record.amount}::numeric)`,
        updatedAt: sql`now()`,
      }).where(eq(schema.books.id, bookId));
    });
  }

  private async _getOrCreatePaymentMethodOrCategory(
    bookId: number,
    names: string[],
    type: 'paymentMethods' | 'categories',
  ): Promise<Map<string, number>> {
    const table =
      type === 'paymentMethods' ? schema.paymentMethods : schema.categories;

    const existing = await this.db
      .select({ id: table.id, name: table.name })
      .from(table)
      .where(and(eq(table.bookId, bookId), inArray(table.name, names)));

    const map = new Map(existing.map((r) => [r.name, r.id]));

    const missing = names.filter((name) => !map.has(name));
    if (!missing.length) return map;

    const inserted = await this.db
      .insert(table)
      .values(missing.map((name) => ({ bookId, name })))
      .returning({ id: table.id, name: table.name });

    inserted.forEach((r) => map.set(r.name, r.id));

    return map;
  }
}
