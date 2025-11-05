import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { BookController } from './book/book.controller';
import { BookService } from './book/book.service';
import { BookModule } from './book/book.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    BookModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class AppModule {}
