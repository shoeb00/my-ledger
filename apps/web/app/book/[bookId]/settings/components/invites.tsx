'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MailPlusIcon, XIcon } from 'lucide-react';
import type { Invitation } from '../page';
import { fmtDate } from '../../../../components/book';
import { cancelInvitation } from '../actions/invitations';
import { toast } from 'sonner';

export function InvitationRow({
  invitation,
  refetchAction,
}: {
  invitation: Invitation;
  refetchAction: () => void;
}) {
  const handleCancelInvite = async (id: string) => {
    const { err } = await cancelInvitation(id);
    if (err) toast.error(err);
    else {
      toast.success('Invitation canceled successfully');
      refetchAction();
    }
  };
  return (
    <article
      role="listitem"
      aria-label={`Invitation ${invitation.email}`}
      className="w-full rounded-lg border bg-card px-4 py-3 shadow-sm hover:shadow-md transition flex justify-between items-center gap-4"
    >
      <div className="text-sm truncate">{invitation.email}</div>
      <div className="text-sm truncate">{fmtDate(invitation.createdAt)}</div>

      <Badge className="text-sm capitalize shrink-0 w-[120px]">{invitation.role}</Badge>

      <Button variant="ghost" onClick={() => handleCancelInvite(invitation.id.toString())}>
        <XIcon />
      </Button>
    </article>
  );
}

export default function InvitationList({
  invitations,
  refetchAction,
}: {
  invitations: Invitation[];
  refetchAction: () => void;
}) {
  if (!invitations || invitations.length === 0) {
    return (
      <div className="rounded-md border border-dashed h-85 p-6 text-center text-sm text-muted-foreground">
        <div className="my-2 font-medium">No invitations yet</div>
        <div className="mb-4 text-xs">Add a invitation to see them listed here.</div>
        <Button>
          <MailPlusIcon /> Send Invitation
        </Button>
      </div>
    );
  }

  return (
    <section className="h-105 overflow-auto space-y-2">
      {invitations.map(m => (
        <InvitationRow invitation={m} key={m.email} refetchAction={refetchAction} />
      ))}
    </section>
  );
}
