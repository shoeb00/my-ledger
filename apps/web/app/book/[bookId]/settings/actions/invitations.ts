import { Roles } from '@my-ledger/api/role';
import { callApi } from '../../../../lib/api';

export type InviteUserRequest = {
  bookId: string;
  email: string;
  role: Roles.EDITOR | Roles.VIEWER;
};

export const inviteUser = async (body: InviteUserRequest) => {
  const endpoint = `/v1/user/invite`;
  return await callApi(endpoint, 'POST', undefined, body);
};

export const getInvitations = async () => {
  const endpoint = `/v1/user/invitations`;
  return await callApi(endpoint, 'GET');
};

export const cancelInvitation = async (invitationId: string) => {
  const endpoint = `/v1/user/cancelInvite/${invitationId}`;
  return await callApi(endpoint, 'DELETE');
};
