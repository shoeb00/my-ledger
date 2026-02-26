'use client';

import { useEffect, useState } from 'react';
import { changeOwnership } from '../actions/book';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { InfoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { getEmails } from '../actions/invitations';
import { UserDetails } from './addOrInviteUser';
import LoaderCircle from '../../../../components/loader';
import { Roles } from '@my-ledger/api/role';
import { useHasPermission } from '../../../../lib';

export default function TransferBook(body: { bookName: string; refetchAction: () => void }) {
  const router = useRouter();
  const params = useParams();
  const bookId = params.bookId as string;
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [email, setEmail] = useState('');

  const isOwner = useHasPermission(Roles.AUTHOR);

  const handleTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userId = users.find(u => u.email === email)?.userId.toString() || '';
    if (loading || !userId) return;
    setLoading(true);
    const { err } = await changeOwnership(bookId, userId);
    if (err) {
      toast.error(err);
    } else {
      toast.success(`Book '${body.bookName}' transferred successfully`);
      router.refresh();
      body.refetchAction();
    }
    setLoading(false);
    setAgree(false);
    setEmail('');
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await getEmails();
      const data = result.data as UserDetails[];
      setUsers(data);
      if (result.err) toast.error(result.err);
      setLoading(false);
    })();
  }, []);

  if (!isOwner) return null;

  return (
    <form onSubmit={handleTransfer} className="no-style space-y-4">
      <p className="text-sm text-muted-foreground italic">
        Enter the email of the new book owner. Your role will be demoted to Editor.
      </p>
      <LoaderCircle loading={loading} className={loading ? 'min-h-20' : ''}>
        <div className="space-y-3 sm:max-w-[50%]">
          <Command className="max-h-60 border rounded-md">
            <CommandInput
              placeholder="Type an email..."
              value={email}
              onValueChange={setEmail}
            />
            {!users.length && (
              <CommandEmpty>No users found. Try adding them as a member first.</CommandEmpty>
            )}
            <CommandGroup className="overflow-auto">
              {users.map(({ name, email: userEmail }) => (
                <CommandItem
                  value={userEmail}
                  key={userEmail}
                  onSelect={() => setEmail(userEmail)}
                  className="p-2 m-2 rounded-md border bg-card shadow-sm hover:shadow-md transition"
                >
                  <div className="flex flex-col">
                    <span className="capitalize text-sm">{name}</span>
                    <span className="font-semibold">{userEmail}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
          <Label className="flex items-center gap-2">
            <Checkbox
              checked={agree}
              onCheckedChange={checked => setAgree(checked as boolean)}
            />
            I understand and accept the consequences
          </Label>
        </div>
      </LoaderCircle>
      <div className="flex items-center gap-4">
        <Button
          type="submit"
          disabled={!agree || email !== (users.find(u => u.email === email)?.email || null)}
        >
          {loading ? 'Transferring...' : 'Transfer Ownership'}
        </Button>
        <Label className="text-xs text-muted-foreground flex gap-1 items-center">
          <InfoIcon className="h-4 w-4" /> Not finding the user? Add them as a member first.
        </Label>
      </div>
    </form>
  );
}
