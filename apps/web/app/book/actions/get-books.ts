import { Book } from '@my-ledger/api/book';

export async function getBook(bookId?: string): Promise<Book[]> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/v1/book/get`);
  if (bookId) url.searchParams.set('bookId', bookId);
  const res = await fetch(url.href, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) {
    console.log('err response', res);
    throw new Error(`status ${res.status}`);
  }  const data = await res.json();
  console.log(data);
  return data;
}
