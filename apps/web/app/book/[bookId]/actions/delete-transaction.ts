export async function deleteTransaction({
  transactionId,
  bookId,
}: {
  transactionId: string;
  bookId: string;
}): Promise<void> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/v1/transaction/delete/${transactionId}`);
  url.searchParams.set('bookId', bookId);
  const res = await fetch(url.href, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) {
    console.log('err response', res);
    throw new Error(`status ${res.status}`);
  }
  return;
}
