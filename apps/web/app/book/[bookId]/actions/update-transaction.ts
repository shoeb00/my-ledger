import { EditRequestPayload } from '../interfaces/edit-request-payload';

export async function updateTransaction(query: EditRequestPayload): Promise<void> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/v1/transaction/update`);
  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, value);
  }
  const res = await fetch(url.href, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) {
    console.log('err response', res);
    throw new Error(`status ${res.status}`);
  }  const data = await res.json();
  console.log('response', data, url.href);
  return data;
}
