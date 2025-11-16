import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { BookController } from './book/book.controller';
import { BookService } from './book/book.service';
import { BookModule } from './book/book.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { TransactionModule } from './transaction/transaction.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { TransactionController } from './transaction/transaction.controller';
import { TransactionService } from './transaction/transaction.service';
import { PermissionsModule } from './permissions/permissions.module';
import { PermissionsController } from './permissions/permissions.controller';
import { PermissionsService } from './permissions/permissions.service';
import { WebhooksModule } from './webhooks/webhooks.module';
import { APP_GUARD } from '@nestjs/core';
import { ClerkAuthGuard } from './auth/clerk-auth.guard';
import { PermissionsGuard } from './auth/permissions.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    BookModule,
    TransactionModule,
    PermissionsModule,
    WebhooksModule,
  ],
  controllers: [
    BookController,
    UserController,
    TransactionController,
    PermissionsController,
  ],
  providers: [
    BookService,
    UserService,
    TransactionService,
    PermissionsService,
    { provide: APP_GUARD, useClass: ClerkAuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class AppModule {}
