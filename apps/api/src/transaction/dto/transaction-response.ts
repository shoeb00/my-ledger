import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TransactionResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  bookId: number;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: '12.00' })
  amount: string;

  @ApiProperty({ nullable: true, example: 'Gas for the car' })
  description?: string | null;

  @ApiProperty({ nullable: true, example: 'Credit Card' })
  paymentType: string | null;

  @ApiProperty({ nullable: true, example: 'Gas' })
  category: string | null;

  @ApiPropertyOptional({ example: 'John Doe' })
  name?: string;

  @ApiPropertyOptional({ example: 'john@doe.com' })
  email?: string;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

export class TransactionListResponseDto {
  @ApiProperty({ type: [TransactionResponseDto] })
  data: TransactionResponseDto[];
  @ApiProperty({ example: 20 })
  count: number;
}
