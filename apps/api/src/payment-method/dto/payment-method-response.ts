import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../schema';

export class PaymentMethodResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  bookId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static from(paymentMethod: PaymentMethod): PaymentMethodResponseDto {
    return {
      id: paymentMethod.id,
      bookId: paymentMethod.bookId,
      name: paymentMethod.name,
      createdAt: paymentMethod.createdAt,
      updatedAt: paymentMethod.updatedAt,
    };
  }
}
