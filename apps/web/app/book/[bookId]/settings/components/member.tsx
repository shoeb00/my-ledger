'use client';

import { Badge } from '@/components/ui/badge';
import type { Member } from '../page';
import { Roles } from '@my-ledger/api/role';
import RemoveMember from './removeMember';
import UpdateMemberRole from './updateMemberRole';
import AddOrInviteUser from './addOrInviteUser';
import { EyeIcon, ShieldCheckIcon, SquarePenIcon } from 'lucide-react';

export function MemberRow({
  member,
  refetchAction,
}: {
  member: Member;
  refetchAction: () => void;
}) {
  return (
    <article
      role="listitem"
      aria-label={`Member ${member.email}`}
      className="w-full rounded-lg border bg-card p-2 text-xs sm:text-sm shadow-sm hover:shadow-md transition  flex flex-col sm:flex-row  sm:justify-between sm:items-center gap-2"
    >
      <div className="truncate capitalize">{member.name}</div>
      <div className="truncate">{member.email}</div>

      <div className="flex flex-row-reverse items-center gap-2">
        <RemoveMember
          userId={member.userId.toString()}
          refetchAction={refetchAction}
          role={member.role}
        />
        <UpdateMemberRole member={member} refetchAction={refetchAction} />
        <Badge
          className="capitalize shrink-0 min-h-6 w-fit sm:w-[120px]"
          variant='secondary'
        >
          {member.role === Roles.AUTHOR && <ShieldCheckIcon />}
          {member.role === Roles.EDITOR && <SquarePenIcon />}
          {member.role === Roles.VIEWER && <EyeIcon />}
          <span className='hidden sm:block'>{member.role}</span>
        </Badge>
      </div>
    </article>
  );
}

export default function MemberList({
  members,
  refetchAction,
}: {
  members: Member[];
  refetchAction: () => void;
}) {
  if (!members || members.length === 0) {
    return (
      <div className="rounded-md border border-dashed h-85 p-6 text-center text-xs sm:text-sm text-muted-foreground">
        <div className="mb-2 font-medium">No members yet</div>
        <div className="mb-4 text-xs">Add a member to see them listed here.</div>
        <AddOrInviteUser tab="members" refetchAction={refetchAction} userDetails={[]} />
      </div>
    );
  }

  return (
    <section className="h-105 overflow-auto space-y-2">
      {members.map(m => (
        <MemberRow member={m} key={m.email} refetchAction={refetchAction} />
      ))}
    </section>
  );
}
