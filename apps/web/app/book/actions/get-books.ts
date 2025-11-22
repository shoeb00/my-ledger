import { Book } from '@my-ledger/api/book';

export async function getBook(): Promise<Book[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/book/get`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`status ${res.status}`);
  const data = await res.json();
  console.log(data);
  return data;
}
