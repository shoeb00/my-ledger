import { schema, eq, and } from '@my-ledger/db';
import type { DB } from '@my-ledger/db/connection';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { CreatePaymentMethodRequestDto } from './dto/payment-method-request';
import { PaymentMethodResponseDto } from './dto/payment-method-response';


@Injectable()
export class PaymentMethodService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: DB,
  ) { }

  async getPaymentMethods(bookId: number): Promise<PaymentMethodResponseDto[]> {
    const paymentMethods = await this.db.query.paymentMethods.findMany({
      where: eq(schema.paymentMethods.bookId, bookId),
      orderBy: (pm, { asc }) => [asc(pm.name)],
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

  async deletePaymentMethod(id: number, bookId: number): Promise<void> {
    const paymentMethod = await this.db.query.paymentMethods.findFirst({
      where: and(
        eq(schema.paymentMethods.id, id),
        eq(schema.paymentMethods.bookId, bookId),
      ),
    });
    if (!paymentMethod)
      throw new BadRequestException('Payment method not found');

    await this.db
      .delete(schema.paymentMethods)
      .where(
        and(
          eq(schema.paymentMethods.id, id),
          eq(schema.paymentMethods.bookId, bookId),
        ),
      );
  }
}
