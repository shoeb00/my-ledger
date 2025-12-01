import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { PaymentMethod } from '../../../components/payment-method';
import { addTransaction } from '../actions/add-transaction';
import { PaymentMethodEnum } from '../../../enums/payment-methods';
import { Plus, Minus } from 'lucide-react';
import { fmtCurrency } from '../../../components/book';

export default function AddTransactionDialog({ bookId }: { bookId: string }) {
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethodEnum.CASH);
  const [amount, setAmount] = useState<number>();
  const [isPositive, setIsPositive] = useState(true);

  async function handleAdd() {
    setError(null);
    setLoading(true);
    try {
      const finalAmount = amount && (isPositive ? amount : -amount);
      await addTransaction({
        description,
        paymentType: paymentMethod,
        amount: finalAmount?.toFixed(2).toString() || '0',
        bookId: Number(bookId),
      });
    } catch (err) {
      console.error('add error', err);
      setError(err instanceof Error ? err.message : 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" /> Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogTitle className="font-bold text-2xl">Add Transaction</DialogTitle>
        <div className="flex gap-4 justify-between">
          <Button className='flex-1' variant={isPositive ? 'default' : 'outline'} onClick={() => setIsPositive(true)}>
            <Plus className="h-4 w-4" />
            Cash-In
          </Button>
          <Button className='flex-1' variant={isPositive ? 'outline' : 'default'} onClick={() => setIsPositive(false)}>
            <Minus className="h-4 w-4" />
            Cash-Out
          </Button>
        </div>
        <Input
          placeholder={fmtCurrency('12.99')}
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
        />
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
            <Button onClick={handleAdd}>{loading ? 'Updating...' : 'Update'}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
