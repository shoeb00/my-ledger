import { Book } from '@my-ledger/api/book';
import { callApi } from '../../lib/api';
import { Roles } from '@my-ledger/api/role';

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
