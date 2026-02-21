'use client';

import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { getPaymentMethods } from '../book/actions/payment-method';
import { PaymentMethod } from '../types/payment-method';
import { Loader } from 'lucide-react';
import { DEFAULT_PAYMENT_METHODS } from '../lib/constants';

export default function PaymentMethodSelect({
  paymentMethodId,
  setPaymentMethodId,
  bookId,
  paymentMethodName,
  setPaymentMethodName,
}: {
  paymentMethodId: number | null;
  setPaymentMethodId: (v: number | null) => void;
  bookId: number;
  paymentMethodName?: string | null;
  setPaymentMethodName?: (v: string | null) => void;
}) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      setLoading(true);
      const { data } = await getPaymentMethods({ bookId });
      if (data) {
        setPaymentMethods(data.sort((a, b) => a.name.localeCompare(b.name)));
      }
      setLoading(false);
    };
    fetchPaymentMethods();

    window.addEventListener('payment-methods-updated', fetchPaymentMethods);
    return () => {
      window.removeEventListener('payment-methods-updated', fetchPaymentMethods);
    };
  }, [bookId]);

  const selectedPaymentMethod = paymentMethodId
    ? paymentMethods.find(pm => pm.id === paymentMethodId)?.name
    : paymentMethodName
      ? paymentMethodName
      : 'Payment Type';

  const customPaymentMethods = paymentMethods.filter(
    pm => !DEFAULT_PAYMENT_METHODS.includes(pm.name),
  );

  return (
    <Select
      onValueChange={value => {
        if (value.startsWith('default-')) {
          setPaymentMethodId(null);
          if (setPaymentMethodName) setPaymentMethodName(value.replace('default-', ''));
        } else {
          if (setPaymentMethodName) setPaymentMethodName(null);
          setPaymentMethodId(Number(value));
        }
      }}
      value={
        paymentMethodId
          ? paymentMethodId.toString()
          : paymentMethodName
            ? `default-${paymentMethodName}`
            : ''
      }
    >
      <SelectTrigger aria-label="Payment Type" className="w-40">
        <div className="flex items-center gap-2">
          {loading ? <Loader className="h-4 w-4 animate-spin" /> : null}
          <span className="text-sm">{selectedPaymentMethod}</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {DEFAULT_PAYMENT_METHODS.map(pm => (
          <SelectItem key={pm} value={`default-${pm}`}>
            {pm}
          </SelectItem>
        ))}
        {customPaymentMethods.map(pm => (
          <SelectItem key={pm.id} value={pm.id.toString()}>
            {pm.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
