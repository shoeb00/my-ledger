import { callApi } from '../../../lib/api';

export const acceptInvite = async (token: string) => {
  const endpoint = `/v1/invitations/accept`;
  return await callApi(endpoint, 'GET', { token });
};

export const createInviteLink = async (bookId: string) => {
  const endpoint = `/v1/invitations/createLink`;
  return await callApi(endpoint, 'POST', { bookId });
};

export const getUser = async (clerkUserId: string) => {
  const endpoint = `/v1/user/getRegisteredUser`;
  return await callApi(endpoint, 'GET', { clerkUserId });
};
