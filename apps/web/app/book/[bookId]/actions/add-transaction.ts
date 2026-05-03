import { callApi } from '../../../lib/api';
import { Transaction } from '@my-ledger/db/schema';
import { AddRequestPayload } from '../interfaces/add-request-payload';

export async function addTransaction(payload: AddRequestPayload, bookId: string) {
  const endpoint = '/v1/transaction/create';
  return await callApi(endpoint, 'POST', { bookId }, payload);
}

export type AddTransactionRequest = Omit<Transaction, 'id' | 'updatedAt' | 'userId' | 'bookId'> & {
  categoryName?: string;
  paymentMethodName?: string;
};

export async function bulkAddTransaction(
  payload: { transactions: AddTransactionRequest[] },
  bookId: string,
) {
  const endpoint = '/v1/transaction/createBulk';
  return await callApi(endpoint, 'POST', { bookId }, payload);
}
