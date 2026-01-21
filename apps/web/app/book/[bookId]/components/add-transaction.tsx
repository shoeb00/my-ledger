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
import { toast } from 'sonner';
import { fmtCurrency, useHasPermission } from '../../../lib';
import { Roles } from '@my-ledger/api/role';

export default function AddTransactionDialog({
  bookId,
  refetchAction,
}: {
  bookId: string;
  refetchAction: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
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
  }

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  async function handleAdd() {
    const amount = Number(amountStr.replaceAll(/,/g, '').replace(/₹/g, ''));
    const finalAmount = isPositive ? amount : -amount;
    const payload = {
      description,
      paymentType: paymentMethod,
      amount: finalAmount?.toFixed(2).toString() || '0',
      bookId: Number(bookId),
    };
    setLoading(true);
    const { err } = await addTransaction(payload, bookId);
    if (err) {
      toast.error(err);
    } else {
      refetchAction();
      toast.success('Transaction added successfully');
    }
    setOpen(false);
    setLoading(false);
  }

  const handleAmountInput = (val: string) => {
    const amtStr = fmtCurrency(val);
    setAmountStr(amtStr);
    return amtStr;
  }

  const canEdit = !useHasPermission(Roles.EDITOR);

  return (
    <Dialog open={open} onOpenChange={o => setOpen(o)}>
      <DialogTrigger asChild>
        <Button disabled={loading} hidden={canEdit}>
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
          onChange={(e) => handleAmountInput(e.target.value)}
          maxLength={14}
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
          <Button onClick={handleAdd} disabled={loading || !amountStr}>{loading ? 'Adding...' : 'Add'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
