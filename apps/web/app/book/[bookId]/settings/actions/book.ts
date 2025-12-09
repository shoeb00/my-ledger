import { callApi } from '../../../../lib/api';

export type UpdateBookRequest = {
  bookId: string;
  name: string;
  description: string;
};

export const updateBook = async (body: UpdateBookRequest) => {
  const endpoint = '/v1/book/update';
  return await callApi(endpoint, 'PUT', undefined, { ...body, bookId: Number(body.bookId) });
};

export const deleteBook = async (bookId: string) => {
  const endpoint = `/v1/book/delete`;
  return await callApi(endpoint, 'DELETE', { bookId });
};

export const changeOwnership = async (bookId: string, userId: string) => {
  const endpoint = `/v1/book/changeOwnership`;
  return await callApi(endpoint, 'PUT', { bookId, userId });
};
