import { callApi } from '../../../lib/api';
import { EditRequestPayload } from '../interfaces/edit-request-payload';

type RequestQuery = Omit<EditRequestPayload, 'refetchAction'>;
export async function updateTransaction(payload: RequestQuery) {
  const endpoint = '/v1/transaction/update';
  return await callApi(endpoint, 'PUT', {}, payload);
}
