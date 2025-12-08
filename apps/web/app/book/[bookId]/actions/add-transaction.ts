import { callApi } from '../../../lib/api';
import { AddRequestPayload } from '../interfaces/add-request-payload';

export async function addTransaction(payload: AddRequestPayload) {
  const endpoint = '/v1/transaction/create';
  return await callApi(endpoint, 'POST', undefined, payload);
}
