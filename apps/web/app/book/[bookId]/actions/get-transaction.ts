import { Transaction } from '@my-ledger/api/transaction';
import { FetchParams } from '../page';

type response = {
  data: Transaction[];
  count: number;
};

export async function getTransaction(filter: FetchParams): Promise<response> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/v1/transaction/getAll`);
  for (const [key, value] of Object.entries(filter)) {
    url.searchParams.set(key, value as string);
  }
  const res = await fetch(url.href, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) {
    console.log('err response', res);
    throw new Error(`status ${res.status}`);
  }  const data = await res.json();
  console.log('response', data);
  return data;
}
