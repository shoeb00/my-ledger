import { Roles } from '@my-ledger/api/role';
import { callApi } from '../../../../lib/api';

export type InviteUserRequest = {
  bookId: string;
  email: string;
  role: Roles.EDITOR | Roles.VIEWER;
};

export const inviteUser = async (body: InviteUserRequest) => {
  const endpoint = `/v1/invitations/user`;
  return await callApi(endpoint, 'POST', undefined, { ...body, bookId: Number(body.bookId) });
};

export const getInvitations = async (bookId: string) => {
  const endpoint = `/v1/invitations/user`;
  return await callApi(endpoint, 'GET', { bookId });
};

export const cancelInvitation = async (invitationId: string) => {
  const endpoint = `/v1/invitations/revoke/${invitationId}`;
  return await callApi(endpoint, 'DELETE');
};

export const getEmails = async () => {
  const endpoint = `/v1/user/emails`;
  return await callApi(endpoint, 'GET');
};
