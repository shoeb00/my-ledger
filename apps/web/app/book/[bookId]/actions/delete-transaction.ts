import { callApi } from '../../../lib/api';

export async function deleteTransaction({
  transactionId,
  bookId,
}: {
  transactionId: string;
  bookId: string;
}) {
  const endpoint = `/v1/transaction/delete/${transactionId}`;
  return await callApi(endpoint, 'DELETE', { bookId });
}
