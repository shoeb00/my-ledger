'use server';

import { Book } from '@my-ledger/api/book';

export default async function getBook(): Promise<Book[]> {
  const data = await fetch(`${process.env.API_URL}/v1/book/get`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const result = await data.json();
  console.log("result", result)
  return result;
}
