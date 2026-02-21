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
      setPaymentMethods(data.sort((a, b) => a.name.localeCompare(b.name)));
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

  const isDuplicate = paymentMethods.some(pm => pm.name === newName);

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

      <div className="flex">
        <LoaderCircle loading={loading} className={loading ? 'min-h-30' : ''}>
          <div className="flex flex-row flex-wrap gap-2 sm:max-w-[50%]">
            {paymentMethods.map(paymentMethod => (
              <Badge
                key={paymentMethod.id}
                variant={'outline'}
                hashString={paymentMethod.name}
                className="px-3 py-1 text-sm font-normal gap-2 pr-1"
              >
                {paymentMethod.name}
                <div
                  hidden={paymentMethods.length === 1}
                  role="button"
                  className="rounded-full hover:bg-destructive/10 p-0.5 transition-colors cursor-pointer text-destructive"
                  onClick={() => handleDelete(paymentMethod.id)}
                >
                  <X className="h-3 w-3" />
                </div>
              </Badge>
            ))}
          </div>
        </LoaderCircle>
      </div>
    </div>
  );
}
