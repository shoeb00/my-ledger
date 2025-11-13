import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { DatabaseModule } from '../database/database.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
  imports: [DatabaseModule, PermissionsModule],
})
export class TransactionModule {}
