'use client';
import type { Invitation } from '../page';
import AddOrInviteUser from './addOrInviteUser';
import CancelInvitation from './cancelInvite';
import { fmtDate } from '../../../../lib';

export function InvitationRow({
  invitation,
  refetchAction,
  loading,
}: {
  invitation: Invitation;
  refetchAction: () => void;
  loading: boolean;
}) {
  return (
    <article
      role="listitem"
      aria-label={`Invitation ${invitation.email}`}
      className="w-full rounded-lg border bg-card p-2 text-xs sm:text-sm shadow-sm hover:shadow-md transition flex justify-between items-center gap-2"
    >
      <div className="w-50  overflow-hidden">{invitation.email}</div>
      <div className='sm:hidden'>{fmtDate(invitation.createdAt, false)}</div>
      <div className='hidden sm:inline'>{fmtDate(invitation.createdAt, true)}</div>

      <CancelInvitation inviteId={invitation.id.toString()} refetchAction={refetchAction} loading={loading} />
    </article>
  );
}

export default function InvitationList({
  invitations,
  refetchAction,
  loading,
  setActiveTabAction
}: {
  invitations: Invitation[];
  refetchAction: () => void;
  loading: boolean;
  setActiveTabAction: (tab: 'members' | 'invites') => void;
}) {
  if (!invitations || invitations.length === 0) {
    return (
      <div className="rounded-md border border-dashed h-85 p-6 text-center text-sm text-muted-foreground">
        <div className="my-2 font-medium">No invitations yet</div>
        <div className="mb-4 text-xs">Add a invitation to see them listed here.</div>
        <AddOrInviteUser tab="invites" refetchAction={refetchAction} userDetails={[]} setActiveTabAction={setActiveTabAction} showName={true} />
      </div>
    );
  }

  return (
    <section className="h-105 overflow-auto space-y-2">
      {invitations.map(m => (
        <InvitationRow invitation={m} key={m.email} refetchAction={refetchAction} loading={loading} />
      ))}
    </section>
  );
}
