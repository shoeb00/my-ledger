import { ApiProperty } from '@nestjs/swagger';

export class TransactionResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  bookId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  amount: string;

  @ApiProperty({ nullable: true })
  description?: string | null;

  @ApiProperty({ nullable: true })
  paymentType: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
