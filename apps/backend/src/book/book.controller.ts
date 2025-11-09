import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { GetBookRequestDto } from './dto/get-book-request';
import { CreateBookRequestDto } from './dto/create-book-request';

@Controller('v1/book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('create')
  createBook(@Body() createBook: CreateBookRequestDto) {
    return this.bookService.createBook(createBook);
  }

  @Get('get')
  getBook(@Query() getBook: GetBookRequestDto) {
    return this.bookService.getBooks(getBook);
  }
}
