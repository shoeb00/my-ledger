import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from '../database/database.module';
import { PermissionsService } from '../permissions/permissions.service';
import { BookService } from '../book/book.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, PermissionsService, BookService],
})
export class UserModule {}
