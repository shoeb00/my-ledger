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
import LoaderCircle from '../../../../components/loader';

export default function TransferBook(body: { bookName: string; refetchAction: () => void }) {
  const router = useRouter();
  const params = useParams();
  const bookId = params.bookId as string;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [email, setEmail] = useState('');

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
          <span className="hidden lg:block">Transfer Ownership</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <LoaderCircle loading={loading}>
          <form onSubmit={handleTransfer} className="no-style">
            <DialogTitle>Transfer Book Ownership</DialogTitle>
            <DialogDescription className="mt-4">
              Your role will be demoted to a Editor and the book will be transferred to the new
              owner.
            </DialogDescription>

            <div className="grid gap-3 mt-4">
              <p className="text-sm text-muted-foreground italic">
                Enter the email of the new book owner
              </p>
              <Command className="max-h-60 border rounded-md">
                <CommandInput
                  placeholder="Type an email..."
                  value={email}
                  onValueChange={setEmail}
                ></CommandInput>
                {!users.length && (
                  <CommandEmpty>No users found, try adding them as a member first</CommandEmpty>
                )}
                <CommandGroup className="overflow-auto">
                  {users.map(({ name, email: userEmail }) => (
                    <CommandItem
                      value={userEmail}
                      key={userEmail}
                      onSelect={() => {
                        setEmail(userEmail);
                      }}
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
              <Label className="flex items-center gap-2 mt-2">
                <Checkbox
                  checked={agree}
                  onCheckedChange={checked => setAgree(checked as boolean)}
                />{' '}
                I understand and accept the consequences
              </Label>
            </div>
            <DialogFooter className="pt-5 pb-2">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!agree || email !== (users.find(u => u.email === email)?.email || null)}
              >
                {loading ? 'Transferring...' : 'Transfer'}
              </Button>
            </DialogFooter>

            <Label className="text-xs text-muted-foreground flex gap-1 items-center">
              <InfoIcon className="h-4 w-4" /> Not finding the user you are looking for? Try adding
              them as a member
            </Label>
          </form>
        </LoaderCircle>
      </DialogContent>
    </Dialog>
  );
}
