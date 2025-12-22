import { useState } from 'react';
import { Member } from '../page';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { updateBookMembers } from '../actions/members';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Roles } from '@my-ledger/api/role';
import { UserCog2Icon } from 'lucide-react';
import { Label } from '@/components/ui/label';

type Props = {
  member: Member;
  refetchAction: () => void;
};

export type MemberRole = Omit<Roles, 'author'>;

export default function UpdateMemberRole({ member, refetchAction }: Props) {
  const param = useParams();
  const bookId = param.bookId as string;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<MemberRole>(member.role as MemberRole);

  const handleUpdateMember = async () => {
    if (role === member.role) {
      setOpen(false);
      return;
    }
    setLoading(true);
    const { err } = await updateBookMembers({
      bookId,
      userId: member.userId.toString(),
      role: role,
    });
    if (err) {
      toast.error(err);
    } else {
      toast.success('Member role updated successfully');
      refetchAction();
    }
    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={member.role === Roles.AUTHOR} size="sm" variant="ghost">
          <UserCog2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Change Member Role</DialogTitle>
        <Label>Role</Label>
        <Select value={role as string} onValueChange={v => setRole(v as MemberRole)}>
          <SelectTrigger>
            <SelectValue placeholder={member.role} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={Roles.EDITOR}>Editor</SelectItem>
            <SelectItem value={Roles.VIEWER}>Viewer</SelectItem>
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdateMember}>{loading ? 'Updating...' : 'Update'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
