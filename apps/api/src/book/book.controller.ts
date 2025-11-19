import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { GetBookRequestDto } from './dto/get-book-request';
import { CreateBookRequestDto } from './dto/create-book-request';
import { Roles } from '../common/decorators/roles.decorator';
import { Roles as rolesEnum } from '../permissions/enum/roles';
import { UpdateBookRequestDto } from './dto/update-book-request';

@Controller('v1/book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('create')
  async createBook(@Body() createBook: CreateBookRequestDto) {
    return await this.bookService.createBook(createBook);
  }

  @Get('get')
  async getBook(@Query() getBook: GetBookRequestDto) {
    return await this.bookService.getBooks(getBook);
  }

  @Get('members')
  @Roles(rolesEnum.VIEWER)
  async getMembers(@Query('bookId', ParseIntPipe) id: number) {
    return await this.bookService.getMembers(id);
  }

  @Post('update')
  @Roles(rolesEnum.AUTHOR)
  async updateBook(@Body() updateBook: UpdateBookRequestDto) {
    return await this.bookService.updateBook(updateBook);
  }

  @Delete('delete')
  @Roles(rolesEnum.AUTHOR)
  async deleteBook(@Query('bookId', ParseIntPipe) id: number) {
    return await this.bookService.deleteBook(id);
  }
}
