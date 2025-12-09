'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2Icon, UserPlus2Icon } from 'lucide-react';
import type { Member } from '../page';
import { Roles } from '@my-ledger/api/role';

export function MemberRow({ member }: { member: Member }) {
  return (
    <article
      role="listitem"
      aria-label={`Member ${member.email}`}
      className="w-full rounded-lg border bg-card px-4 py-3 shadow-sm hover:shadow-md transition flex justify-between items-center gap-4"
    >
      <div className="text-md truncate capitalize">{member.name}</div>
      <div className="text-md truncate">{member.email}</div>

      <Badge
        className="text-sm capitalize shrink-0 w-[120px]"
        variant={member.role === Roles.AUTHOR ? 'default' : 'outline'}
      >
        {member.role}
      </Badge>
      <div className="flex items-center gap-2">
        <Button variant="ghost" disabled={member.role === Roles.AUTHOR}>
          <Edit2 />
        </Button>
        <Button variant="ghost" disabled={member.role === Roles.AUTHOR}>
          <Trash2Icon />
        </Button>
      </div>
    </article>
  );
}

export default function MemberList({ members }: { members: Member[] }) {
  if (!members || members.length === 0) {
    return (
      <div className="rounded-md border border-dashed h-85 p-6 text-center text-sm text-muted-foreground">
        <div className="mb-2 font-medium">No members yet</div>
        <div className="mb-4 text-xs">Add a member to see them listed here.</div>
        <Button>
          <UserPlus2Icon /> Add Member
        </Button>
      </div>
    );
  }

  return (
    <section className="h-105 overflow-auto space-y-2">
      {members.map(m => (
        <MemberRow member={m} key={m.email} />
      ))}
    </section>
  );
}
