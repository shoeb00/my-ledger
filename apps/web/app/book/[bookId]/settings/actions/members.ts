import { callApi } from '../../../../lib/api';
import { InviteUserRequest } from './invitations';

export const getBookMembers = async (bookId: string) => {
  const endpoint = `/v1/book/members`;
  return await callApi(endpoint, 'GET', { bookId });
};

export const updateBookMembers = async (body: InviteUserRequest) => {
  const endpoint = '/v1/permissions/update';
  return await callApi(endpoint, 'PUT', undefined, body);
};

export const removeBookMembers = async (bookId: string, permissionId: string) => {
  const endpoint = '/v1/permissions/delete';
  return await callApi(endpoint, 'PUT', { bookId, permissionId });
};
