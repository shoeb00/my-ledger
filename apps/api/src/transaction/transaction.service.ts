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
import { TransactionResponseDto } from './dto/transaction-response';
import { eq, sql } from 'drizzle-orm';
import { CreateTransactionsRequestDto } from './dto/create-transaction-request';
import { PermissionsService } from '../permissions/permissions.service';
import { Roles } from '../permissions/enum/roles';

const schema = { ...transactionsSchema, ...booksSchema };

@Injectable()
export class TransactionService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly permissionsService: PermissionsService,
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
  ): Promise<TransactionResponseDto[]> {
    const { limit, offset } = request;
    return await this.db.query.transactions.findMany({ limit, offset });
  }

  async create(
    body: CreateTransactionsRequestDto,
  ): Promise<TransactionResponseDto> {
    const permission = await this.permissionsService.getPermissions({
      userId: body.userId,
      bookId: body.bookId,
    });
    if (!permission || permission.role === Roles.VIEWER)
      throw new BadRequestException('User does not have access');
    if (parseFloat(body.amount) === 0)
      throw new BadRequestException('Amount cannot be 0');
    const [row] = await this.db
      .insert(schema.transactions)
      .values(body)
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
}
