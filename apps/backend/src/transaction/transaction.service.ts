import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { GetTransactionsRequestDto } from './dto/get-transaction-request';
import { TransactionResponseDto } from './dto/transaction-response';
import { eq } from 'drizzle-orm';
import { CreateTransactionsRequestDto } from './dto/create-transaction-request';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async get(id: number): Promise<TransactionResponseDto> {
    const record = await this.db.query.transaction.findFirst({
      where: eq(schema.transaction.id, id),
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
    return await this.db.query.transaction.findMany({ limit, offset });
  }

  async create(
    body: CreateTransactionsRequestDto,
  ): Promise<TransactionResponseDto> {
    const [row] = await this.db
      .insert(schema.transaction)
      .values(body)
      .returning();
    if (!row) throw new InternalServerErrorException('Failed to create');
    return row;
  }
}
