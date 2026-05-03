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
import { Roles } from '@my-ledger/db/schema';
import { UserCog2Icon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useHasPermission } from '../../../../lib';
import LoaderCircle from '../../../../components/loader';

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

  const isOwner = useHasPermission(Roles.AUTHOR);

  const handleUpdateMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
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
        <Button disabled={member.role === Roles.AUTHOR} hidden={!isOwner} size="sm" variant="ghost">
          <UserCog2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <LoaderCircle loading={loading}>
          <form onSubmit={handleUpdateMember} className="no-style">
            <DialogTitle>Change Member Role</DialogTitle>
            <div className="grid gap-3 mt-4">
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
            </div>
            <DialogFooter className="pt-5">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update'}
              </Button>
            </DialogFooter>
          </form>
        </LoaderCircle>
      </DialogContent>
    </Dialog>
  );
}
