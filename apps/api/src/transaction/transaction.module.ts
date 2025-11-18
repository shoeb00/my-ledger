import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
  imports: [DatabaseModule],
})
export class TransactionModule {}
