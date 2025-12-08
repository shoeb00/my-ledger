import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { deleteTransaction } from '../actions/delete-transaction';
import { toast } from 'sonner';

export default function DeleteTransactionDialog({
  transactionId,
  bookId,
  refetchAction,
}: {
  transactionId: string;
  bookId: string;
  refetchAction: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const { err } = await deleteTransaction({ transactionId, bookId });
    console.log('err', err);
    if (err) {
      toast.error(err);
    } else {
      toast.success('Transaction deleted successfully');
      refetchAction();
    }
    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle className="font-bold text-2xl">Are you sure? </DialogTitle>
        The action cannot be undone
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleDelete}>{loading ? 'Deleting...' : 'Delete'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
