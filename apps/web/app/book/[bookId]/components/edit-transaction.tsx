import { Button } from '@/components/ui/button';
import {
  Dialog,
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
import { toast } from 'sonner';

export default function EditTransactionDialog(query: EditRequestPayload) {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState(query.description);
  const [paymentMethod, setPaymentMethod] = useState(query.paymentType);

  async function handleUpdate() {
    setLoading(true);
    const { refetchAction, ...rest } = query;
    const { err } = await updateTransaction({ ...rest, description, paymentType: paymentMethod });
    if (err) {
      toast.error(err);
    } else {
      toast.success('Transaction updated successfully');
      refetchAction();
    }
    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleUpdate}>{loading ? 'Updating...' : 'Update'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
