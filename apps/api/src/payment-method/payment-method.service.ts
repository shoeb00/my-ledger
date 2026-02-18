import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as paymentMethodSchema from './schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { eq, and } from 'drizzle-orm';
import * as booksSchema from '../book/schema';
import { CreatePaymentMethodRequestDto } from './dto/payment-method-request';
import { PaymentMethodResponseDto } from './dto/payment-method-response';

const schema = { ...paymentMethodSchema, ...booksSchema };

@Injectable()
export class PaymentMethodService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async getPaymentMethods(bookId: number): Promise<PaymentMethodResponseDto[]> {
    const paymentMethods = await this.db.query.paymentMethods.findMany({
      where: eq(schema.paymentMethods.bookId, bookId),
      orderBy: (paymentMethods, { asc }) => [asc(paymentMethods.name)],
    });
    return paymentMethods.map((pm) => PaymentMethodResponseDto.from(pm));
  }

  async createPaymentMethod(
    body: CreatePaymentMethodRequestDto,
  ): Promise<PaymentMethodResponseDto> {
    // Check if payment method already exists for this book
    const existing = await this.db.query.paymentMethods.findFirst({
      where: and(
        eq(schema.paymentMethods.bookId, body.bookId),
        eq(schema.paymentMethods.name, body.name),
      ),
    });
    if (existing) {
      throw new BadRequestException('Payment method already exists');
    }

    const [row] = await this.db
      .insert(schema.paymentMethods)
      .values({
        bookId: body.bookId,
        name: body.name,
      })
      .returning();
    if (!row)
      throw new InternalServerErrorException('Failed to create payment method');
    return PaymentMethodResponseDto.from(row);
  }

  async deletePaymentMethod(id: number): Promise<void> {
    const paymentMethod = await this.db.query.paymentMethods.findFirst({
      where: eq(schema.paymentMethods.id, id),
    });
    if (!paymentMethod)
      throw new BadRequestException('Payment method not found');

    await this.db
      .delete(schema.paymentMethods)
      .where(eq(schema.paymentMethods.id, id));
  }
}
