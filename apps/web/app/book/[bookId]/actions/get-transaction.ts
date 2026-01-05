import { FetchParams } from '../page';
import { callApi } from '../../../lib/api';
import { TransactionRow } from '../../components/transaction';

type response = {
  data: TransactionRow[];
  count: number;
};

export async function getTransaction(filter: FetchParams) {
  const endpoint = '/v1/transaction/getAll';
  const res = await callApi(endpoint, 'GET', filter);
  const err = res.err;
  const data = res.data as response;
  return { err, data };
}
