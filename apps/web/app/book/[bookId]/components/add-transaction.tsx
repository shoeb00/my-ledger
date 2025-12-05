import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { PaymentMethod } from '../../../components/payment-method';
import { addTransaction } from '../actions/add-transaction';
import { PaymentMethodEnum } from '../../../enums/payment-methods';
import { Plus, Minus } from 'lucide-react';
import { fmtCurrency } from '../../../components/book';

export default function AddTransactionDialog({
  bookId,
  refetchAction,
}: {
  bookId: string;
  refetchAction: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethodEnum.CASH);
  const [amountStr, setAmountStr] = useState('');
  const [isPositive, setIsPositive] = useState(true);

  function resetForm() {
    setDescription('');
    setPaymentMethod(PaymentMethodEnum.CASH);
    setAmountStr('');
    setIsPositive(true);
    setLoading(false);
    setError(null);
  }

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  async function handleAdd() {
    setError(null);
    setLoading(true);
    try {
      const amount = Number(amountStr.trim());
      const finalAmount = isPositive ? amount : -amount;
      await addTransaction({
        description,
        paymentType: paymentMethod,
        amount: finalAmount?.toFixed(2).toString() || '0',
        bookId: Number(bookId),
      });
      refetchAction();
      setOpen(false);
    } catch (err) {
      console.error('add error', err);
      setError(err instanceof Error ? err.message : 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={o => setOpen(o)}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" /> Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogTitle className="font-bold text-2xl">Add Transaction</DialogTitle>
        <div className="flex gap-4 justify-between">
          <Button
            className="flex-1"
            variant={isPositive ? 'default' : 'outline'}
            onClick={() => setIsPositive(true)}
          >
            <Plus className="h-4 w-4" />
            Cash-In
          </Button>
          <Button
            className="flex-1"
            variant={isPositive ? 'outline' : 'default'}
            onClick={() => setIsPositive(false)}
          >
            <Minus className="h-4 w-4" />
            Cash-Out
          </Button>
        </div>
        <Input
          placeholder={fmtCurrency('12.99')}
          value={amountStr}
          onChange={e => setAmountStr(e.target.value)}
          type="number"
          min='0.1'
        />
        <Input
          placeholder="Transaction description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <PaymentMethod paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>{loading ? 'Adding...' : 'Add'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
