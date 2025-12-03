import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { EditIcon } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { PaymentMethod } from '../../../components/payment-method';
import { updateTransaction } from '../actions/update-transaction';
import { EditRequestPayload } from '../interfaces/edit-request-payload';

export default function EditTransactionDialog(query: EditRequestPayload) {
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState(query.description);
  const [paymentMethod, setPaymentMethod] = useState(query.paymentType);

  async function handleUpdate() {
    setError(null);
    setLoading(true);
    try {
      console.log('query', query);
      await updateTransaction({ ...query, description, paymentType: paymentMethod });
      query.refetchAction();
    } catch (err) {
      console.error('update error', err);
      setError(err instanceof Error ? err.message : 'Failed to update transaction');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <EditIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogTitle className="font-bold text-2xl">Update Transaction</DialogTitle>
        <Input
          placeholder="Transaction description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <PaymentMethod paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <DialogClose asChild>
            <Button onClick={handleUpdate}>{loading ? 'Updating...' : 'Update'}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
