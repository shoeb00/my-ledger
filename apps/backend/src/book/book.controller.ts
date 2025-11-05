import { CreateBookRequest, GetBookRequest } from '@repo/types';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from '../../../../packages/types/src/books/interface/book';

@Controller('v1/book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('create')
  createBook(@Body() createBook: CreateBookRequest) {
    return this.bookService.createBook(createBook);
  }

  @Get('get')
  getBook(@Query() getBook: GetBookRequest): Book | Book[] {
    return this.bookService.getBooks(getBook);
  }
}
