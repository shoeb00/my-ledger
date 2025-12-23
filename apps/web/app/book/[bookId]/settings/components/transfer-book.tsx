import { useEffect, useState } from 'react';
import { changeOwnership } from '../actions/book';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeftRight, InfoIcon } from 'lucide-react';
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

export default function TransferBook(body: { bookName: string; refetchAction: () => void }) {
  const router = useRouter();
  const params = useParams();
  const bookId = params.bookId as string;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [email, setEmail] = useState('');

  const handleTransfer = async (userId: string) => {
    setLoading(true);
    const { err } = await changeOwnership(bookId, userId);
    if (err) {
      toast.error(err);
    } else {
      toast.success(`Book '${body.bookName}' transferred successfully`);
      // FIXME: Debug why refresh isn't working
      router.refresh();
      body.refetchAction();
    }
    setOpen(false);
    setLoading(false);
    setAgree(false);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await getEmails();
      const data = result.data as UserDetails[];
      setUsers(data);
      if (result.err) {
        toast.error(result.err);
      }
      setLoading(false);
    })();
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        setEmail('');
        setAgree(false);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <ArrowLeftRight />
          Transfer Ownership
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Transfer Book Ownership</DialogTitle>
        <DialogDescription>
          Your role will be demoted to a Editor and the book will be transferred to the new owner.
        </DialogDescription>

        <p className="text-sm text-muted-foreground italic">
          Enter the email of the new book owner
        </p>
        <Command className="max-h-60">
          <CommandInput
            placeholder="Type an email..."
            value={email}
            onValueChange={setEmail}
          ></CommandInput>
          {!users.length && (
            <CommandEmpty>No users found, try adding them as a member first</CommandEmpty>
          )}
          <CommandGroup className="overflow-auto">
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
        <Label>
          <Checkbox checked={agree} onClick={() => setAgree(!agree)} /> I understand and accept the
          consequences
        </Label>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={!agree || email !== (users.find(u => u.email === email)?.email || null)}
            onClick={() =>
              handleTransfer(users.find(u => u.email === email)?.userId.toString() || '')
            }
          >
            {loading ? 'Transferring...' : 'Transfer'}
          </Button>
        </DialogFooter>

        <Label className="text-xs text-muted-foreground">
          <InfoIcon className="h-4 w-4" /> Not finding the user you are looking for? Try adding them
          as a member
        </Label>
      </DialogContent>
    </Dialog>
  );
}
