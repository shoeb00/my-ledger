import { FetchParams } from '../page';
import { callApi } from '../../../lib/api';
import { Transaction } from '@my-ledger/api/transaction';

type response = {
  data: Transaction[];
  count: number;
};

export async function getTransaction(filter: FetchParams) {
  const endpoint = '/v1/transaction/getAll';
  const res = await callApi(endpoint, 'GET', filter);
  const err = res.err;
  const data = res.data as response;
  return { err, data };
}
