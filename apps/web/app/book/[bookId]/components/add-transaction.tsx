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
import { addTransaction } from '../actions/add-transaction';
import { Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { fmtCurrency, useHasPermission } from '../../../lib';
import { Roles } from '@my-ledger/api/role';
import LoaderCircle from '../../../components/loader';
import CategorySelect from '../../../components/category';
import PaymentMethodSelect from '../../../components/payment-method';

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
  const [paymentMethodId, setPaymentMethodId] = useState<number | null>(null);
  const [paymentMethodName, setPaymentMethodName] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [amountStr, setAmountStr] = useState('');
  const [isPositive, setIsPositive] = useState(true);

  function resetForm() {
    setDescription('');
    setPaymentMethodId(null);
    setPaymentMethodName(null);
    setCategoryId(null);
    setCategoryName(null);
    setAmountStr('');
    setIsPositive(true);
    setLoading(false);
  }

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const amount = Number(amountStr.replace(/[^\d.]/g, ''));
    const finalAmount = isPositive ? amount : -amount;
    const payload = {
      description,
      paymentMethodId,
      paymentMethodName,
      categoryId,
      categoryName,
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
  };

  const canEdit = !useHasPermission(Roles.EDITOR);

  return (
    <Dialog open={open} onOpenChange={o => setOpen(o)}>
      <DialogTrigger asChild>
        <Button disabled={loading} hidden={canEdit} className="w-fit">
          <Plus className="h-4 w-4" /> Transaction
        </Button>
      </DialogTrigger>
      <DialogContent>
        <LoaderCircle loading={loading}>
          <form onSubmit={handleAdd} className="no-style">
            <DialogTitle className="font-bold text-2xl">Add Transaction</DialogTitle>
            <div className="flex gap-4 justify-between mt-4">
              <Button
                className="flex-1"
                type="button"
                variant={isPositive ? 'success' : 'outline'}
                onClick={() => setIsPositive(true)}
              >
                <Plus className="h-4 w-4" />
                Cash-In
              </Button>
              <Button
                className="flex-1"
                type="button"
                variant={!isPositive ? 'destructive' : 'outline'}
                onClick={() => setIsPositive(false)}
              >
                <Minus className="h-4 w-4" />
                Cash-Out
              </Button>
            </div>
            <div className="grid gap-4 mt-4">
              <Input
                placeholder={fmtCurrency('12.99')}
                value={amountStr}
                onChange={e => handleAmountInput(e.target.value)}
                maxLength={14}
                required
              />
              <Input
                placeholder="Transaction description"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
              <CategorySelect
                categoryId={categoryId}
                setCategoryId={setCategoryId}
                categoryName={categoryName}
                setCategoryName={setCategoryName}
                bookId={Number(bookId)}
              />
              <PaymentMethodSelect
                paymentMethodId={paymentMethodId}
                setPaymentMethodId={setPaymentMethodId}
                paymentMethodName={paymentMethodName}
                setPaymentMethodName={setPaymentMethodName}
                bookId={Number(bookId)}
              />
            </div>
            <DialogFooter className="pt-5">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || amountStr === fmtCurrency('')}>
                {loading ? 'Adding...' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </LoaderCircle>
      </DialogContent>
    </Dialog>
  );
}
