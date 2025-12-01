import { AddRequestPayload } from '../interfaces/add-request-payload';

export async function addTransaction(payload: AddRequestPayload): Promise<void> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/v1/transaction/create`);
  console.log('request', url.href, payload);
  const res = await fetch(url.href, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.log('err response', res);
    throw new Error(`status ${res.status}`);
  }
  const data = await res.json();
  console.log('response', data, url.href);
  return data;
}
