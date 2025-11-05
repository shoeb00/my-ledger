import { CreateBookRequest } from '../../../../packages/types/src/books/dto/create-book-request';
import { GetBookRequest } from '../../../../packages/types/src/books/dto/get-book-request';
import { Book } from './../../../../packages/types/src/books/interface/book';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BookService {
  private readonly books: Book[] = [];
  createBook(createBook: CreateBookRequest): string {
    const book: Book = {
      id: this.books.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...createBook,
    };
    this.books.push(book);
    return 'Successfully created book';
  }

  getBooks(getBook: GetBookRequest): Book | Book[] {
    if (getBook.id) {
      const book = this.books.find((book) => book.id === Number(getBook.id));
      if (!book) throw new Error('Book not found');
      return book;
    }
    return this.books;
  }
}
