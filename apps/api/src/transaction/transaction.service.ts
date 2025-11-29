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
import { DATABASE_CONNECTION } from '../database/database-connection';
import { GetTransactionsRequestDto } from './dto/get-transaction-request';
import {
  TransactionListResponseDto,
  TransactionResponseDto,
} from './dto/transaction-response';
import { and, asc, desc, eq, gte, like, lte, SQL, sql } from 'drizzle-orm';
import { CreateTransactionsRequestDto } from './dto/create-transaction-request';
import { RequestContextService } from '../common/request-context.service';
import { UpdateTransactionsRequestDto } from './dto/update-transaction-request';

const schema = { ...transactionsSchema, ...booksSchema };

@Injectable()
export class TransactionService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly cxt: RequestContextService,
  ) {}

  async get(id: number): Promise<TransactionResponseDto> {
    const record = await this.db.query.transactions.findFirst({
      where: eq(schema.transactions.id, id),
    });

    if (!record) {
      throw new NotFoundException('Transaction not found');
    }
    return record;
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
        case 'userId':
        case 'paymentType':
          conditions.push(eq(schema.transactions[key], value));
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
      }
    }
    const orderDirection = order === 'desc' ? desc : asc;
    const data = await this.db.query.transactions.findMany({
      limit,
      offset,
      where: and(...conditions),
      orderBy: orderDirection(schema.transactions[sort]),
    });
    const count = await this.db.$count(
      transactionsSchema.transactions,
      and(...conditions),
    );
    return { data: data as TransactionResponseDto[], count };
  }

  async create(
    body: CreateTransactionsRequestDto,
  ): Promise<TransactionResponseDto> {
    const user = this.cxt.getUser();
    if (parseFloat(body.amount) === 0)
      throw new BadRequestException('Amount cannot be 0');
    const [row] = await this.db
      .insert(schema.transactions)
      .values({ ...body, userId: user.id })
      .returning();
    const transactionType =
      parseFloat(body.amount) > 0 ? 'credited' : 'debited';
    const amount = Math.abs(parseFloat(body.amount));
    await this.db
      .update(schema.books)
      .set({
        [transactionType]: sql`${booksSchema.books[transactionType]} + ${amount} `,
        balance: sql`${booksSchema.books.balance} + ${body.amount}`,
      })
      .where(eq(schema.books.id, body.bookId));
    if (!row) throw new InternalServerErrorException('Failed to create');
    return row;
  }

  async update(
    query: UpdateTransactionsRequestDto,
  ): Promise<TransactionResponseDto> {
    const record = await this.db.query.transactions.findFirst({
      where: eq(schema.transactions.id, query.transactionId),
    });
    if (!record) throw new NotFoundException('Transaction not found');
    const [updatedRow] = await this.db
      .update(schema.transactions)
      .set({ paymentType: query.paymentType, description: query.description })
      .where(eq(schema.transactions.id, query.transactionId))
      .returning();
    if (!updatedRow) throw new InternalServerErrorException('Failed to update');
    return updatedRow;
  }

  async delete(id: number): Promise<void> {
    const record = await this.db.query.transactions.findFirst({
      where: and(eq(schema.transactions.id, id)),
    });
    if (!record) throw new NotFoundException('Transaction not found');
    await this.db.transaction(async () => {
      await this.db.update(schema.books).set({
        balance: sql`${schema.books.balance} - ${record.amount}`,
      });
      await this.db
        .delete(schema.transactions)
        .where(eq(schema.transactions.id, id));
    });
  }
}
