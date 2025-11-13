import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { GetBookRequestDto } from './dto/get-book-request';
import { CreateBookRequestDto } from './dto/create-book-request';

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

  @Get('members/:id')
  async getMembers(@Param('id') id: number) {
    return await this.bookService.getMembers(id);
  }
}
