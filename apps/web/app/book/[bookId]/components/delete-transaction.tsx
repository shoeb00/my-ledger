import { deleteTransaction } from '../actions/delete-transaction';
import { toast } from 'sonner';
import ConfirmationDialog from './confirmation-dialog';

export default function DeleteTransactionDialog({
  transactionId,
  bookId,
  refetchAction,
}: {
  transactionId: string;
  bookId: string;
  refetchAction: () => void;
}) {
  async function handleDelete(
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    loading: boolean,
  ) {
    if (loading) return;
    setLoading(true);
    const { err } = await deleteTransaction({ transactionId, bookId });
    if (err) {
      toast.error(err);
    } else {
      toast.success('Transaction deleted successfully');
      refetchAction();
    }
    setLoading(false);
    setOpen(false);
  }

  return <ConfirmationDialog handleDelete={handleDelete} />;
}
