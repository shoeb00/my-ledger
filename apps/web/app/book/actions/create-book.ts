import { callApi } from '../../lib/api';

export async function createBook(formData: FormData) {
  const endpoint = '/v1/book/create';
  return await callApi(endpoint, 'POST', undefined, Object.fromEntries(formData));
}
