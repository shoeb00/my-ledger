'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { MailPlusIcon, UserPlus2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getEmails, inviteUser } from '../actions/invitations';
import { Member } from '../page';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { useParams } from 'next/navigation';
import { Roles } from '@my-ledger/api/role';

type userDetails = {
  name: string;
  email: string;
  userId: number;
};

type Props = {
  userDetails: Partial<Member>[];
  refetchAction: () => void;
  tab: 'members' | 'invites';
};

// TODO: use zod and add better types
export default function AddOrInviteUser(body: Props) {
  const params = useParams();
  const bookId = params.bookId as string;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState<userDetails[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await getEmails();
      const emails = body.userDetails.map(({ email }) => email);
      const data = result.data as userDetails[];
      const filteredUsers = data.filter(({ email }) => !emails.includes(email));
      setUsers(filteredUsers);
      if (result.err) {
        toast.error(result.err);
      }
      setLoading(false);
    })();
  }, [body.userDetails]);

  const isMemberTab = body.tab === 'members';
  const title = isMemberTab ? 'Add User' : 'Send Invitation';
  const action = isMemberTab ? 'Add' : 'Invite';
  const loadingAction = isMemberTab ? 'Adding...' : 'Inviting...';
  const buttonCheck = isMemberTab && !users.find(({ email: e }) => e === email)?.email;

  const handleUpdate = async () => {
    setLoading(true);
    const { refetchAction } = body;
    const { err } = await inviteUser({ email, bookId, role: Roles.VIEWER });
    if (err) {
      toast.error(err);
    } else {
      toast.success(`User ${isMemberTab ? 'added' : 'invited'} successfully`);
      refetchAction();
    }
    setOpen(false);
    setLoading(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        setOpen(isOpen);
        if (isOpen) {
          setEmail('');
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          {isMemberTab ? (
            <>
              <UserPlus2Icon />
              {title}
            </>
          ) : (
            <>
              <MailPlusIcon /> {title}
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>Email</DialogDescription>
        <div className="h-70 grid gap-3">
          <Command>
            <CommandInput
              placeholder="Type an email..."
              value={email}
              onValueChange={setEmail}
            ></CommandInput>
            {isMemberTab && <CommandEmpty>No results found</CommandEmpty>}
            <CommandGroup className="overflow-auto m">
              {users.map(({ name, email }) => (
                <CommandItem
                  value={email}
                  key={email}
                  onSelect={() => {
                    setEmail(email);
                  }}
                  className="p-2 m-2 rounded-md border bg-card shadow-sm hover:shadow-md transition"
                >
                  <div className="flex flex-col">
                    <span className="capitalize text-sm">{name}</span>
                    <span className="font-semibold">{email}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={loading || buttonCheck}>
            {loading ? loadingAction : action}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
