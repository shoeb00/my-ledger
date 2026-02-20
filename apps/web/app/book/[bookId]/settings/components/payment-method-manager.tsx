'use client';
import { useState, useEffect } from 'react';
import { PaymentMethod } from '../../../../types/payment-method';
import {
  getPaymentMethods,
  createPaymentMethod,
  deletePaymentMethod,
} from '../../../actions/payment-method';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import { DEFAULT_PAYMENT_METHODS } from '../../../../lib/constants';
import LoaderCircle from '../../../../components/loader';

interface PaymentMethodManagerProps {
  bookId: number;
}

export default function PaymentMethodManager({ bookId }: PaymentMethodManagerProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchPaymentMethods = async () => {
    setLoading(true);
    const { err, data } = await getPaymentMethods({ bookId });
    if (err) {
      toast.error(err);
    } else {
      setPaymentMethods(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, [bookId]);

  const handleAdd = async (name: string) => {
    if (!name.trim()) return;
    setLoading(true);
    setAdding(true);
    const { err, data } = await createPaymentMethod({ bookId, name });
    if (err) {
      toast.error(err);
    } else {
      toast.success('Payment method added');
      setNewName('');
      fetchPaymentMethods();
      window.dispatchEvent(new Event('payment-methods-updated'));
    }
    setLoading(false);
    setAdding(false);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    const { err } = await deletePaymentMethod({ id });
    if (err) {
      toast.error(err);
    } else {
      toast.success('Payment method deleted');
      setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
      window.dispatchEvent(new Event('payment-methods-updated'));
    }
    setLoading(false);
  };

  const customPaymentMethods = paymentMethods.filter(
    pm => !DEFAULT_PAYMENT_METHODS.includes(pm.name),
  );
  const isDuplicate =
    DEFAULT_PAYMENT_METHODS.includes(newName) || paymentMethods.some(pm => pm.name === newName);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 sm:max-w-[50%]">
        <Input
          placeholder="New Payment Method Name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !isDuplicate && handleAdd(newName)}
        />
        <Button onClick={() => handleAdd(newName)} disabled={adding || !newName || isDuplicate}>
          {adding ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus className="h-4 w-4" />}
          <span className="ml-2 hidden sm:inline">Add</span>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <LoaderCircle loading={loading}>
          {paymentMethods.map(pm => (
            <Badge
              key={pm.id}
              variant={paymentMethods.length === 1 ? 'secondary' : 'outline'}
              className="px-3 py-1 text-sm font-normal gap-2 pr-1"
            >
              {pm.name}
              <div
                hidden={paymentMethods.length === 1}
                role="button"
                className="rounded-full hover:bg-destructive/10 p-0.5 transition-colors cursor-pointer text-destructive"
                onClick={() => handleDelete(pm.id)}
              >
                <X className="h-3 w-3" />
              </div>
            </Badge>
          ))}
        </LoaderCircle>
      </div>
    </div>
  );
}
