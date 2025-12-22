import { callApi } from '../../../../lib/api';
import { MemberRole } from '../components/updateMemberRole';

export const getBookMembers = async (bookId: string) => {
  const endpoint = `/v1/book/members`;
  return await callApi(endpoint, 'GET', { bookId });
};

export const updateBookMembers = async (body: {
  userId: string;
  bookId: string;
  role: MemberRole;
}) => {
  const endpoint = '/v1/permissions/update';
  return await callApi(endpoint, 'PUT', undefined, body);
};

export const removeBookMembers = async (bookId: string, userId: string) => {
  const endpoint = '/v1/permissions/delete';
  return await callApi(endpoint, 'DELETE', { bookId, userId });
};
