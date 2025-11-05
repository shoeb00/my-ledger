import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { BookController } from './book/book.controller';
import { BookService } from './book/book.service';
import { BookModule } from './book/book.module';

@Module({
  imports: [UserModule, BookModule],
  controllers: [BookController],
  providers: [BookService],
})
export class AppModule {}
