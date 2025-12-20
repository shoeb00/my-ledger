import { useState } from 'react';
import { deleteBook, type UpdateBookRequest } from '../actions/book';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ArrowLeftRight, InfoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Checkbox } from '@/components/ui/checkbox';

export default function TransferBook(body: Omit<UpdateBookRequest, 'description'>) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(body.name);
  const [agree, setAgree] = useState(false);

  const handleTransfer = async () => {
    setLoading(true);
    const { err } = await deleteBook(body.bookId);
    if (err) {
      toast.error(err);
    } else {
      toast.success(`Book '${body.name}' deleted successfully`);
      router.refresh();
    }
    setOpen(false);
    setLoading(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          Enter the name or email of the new book owner
        </p>
        <Input
          id="name"
          name="name"
          onChange={e => setName(e.target.value)}
          placeholder="John Doe"
        />
        <Label>
          <Checkbox checked={agree} onClick={() => setAgree(!agree)} /> I understand and accept the
          consequences
        </Label>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button disabled={!agree} onClick={handleTransfer}>
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
