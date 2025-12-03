import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { deleteTransaction } from '../actions/delete-transaction';

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
  const [_error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setError(null);
    setLoading(true);
    try {
      await deleteTransaction({ transactionId, bookId });
      refetchAction();
    } catch (err) {
      console.error('delete error', err);
      setError(err instanceof Error ? err.message : 'Failed to delete transaction');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle className="font-bold text-2xl">Are you sure? </DialogTitle>
        The action cannot be undone
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose>
            <Button onClick={handleDelete}>{loading ? 'Deleting...' : 'Delete'}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
