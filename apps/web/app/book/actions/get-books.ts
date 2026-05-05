import { Book, Roles } from '@my-ledger/db/schema';
import { callApi } from '../../lib/api';

export interface BookResponse extends Book {
  lastTransaction: string;
  role: Roles;
}
export async function getBook(bookId?: string) {
  const endpoint = '/v1/book/get';
  const query = bookId ? { bookId } : {};
  const res = await callApi(endpoint, 'GET', query);
  const err = res.err;
  const data = res.data as BookResponse[];
  return { err, data };
}
