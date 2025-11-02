import { CreateBookRequest } from '../dto/create-book-request';

export interface Book extends CreateBookRequest {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}
