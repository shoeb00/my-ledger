'use client';

import { getPaymentMethods } from '../book/actions/payment-method';
import { DEFAULT_PAYMENT_METHODS } from '../lib/constants';
import ClassificationSelect from './classification-select';

export default function PaymentMethodSelect({
  paymentMethodId,
  setPaymentMethodId,
  bookId,
  paymentMethodName,
  setPaymentMethodName,
  allowNone,
  onlyExisting
}: {
  paymentMethodId: number | null;
  setPaymentMethodId: (v: number | null) => void;
  bookId: number;
  paymentMethodName?: string | null;
  setPaymentMethodName?: (v: string | null) => void;
  allowNone?: boolean;
  onlyExisting?: boolean;
}) {
  return (
    <ClassificationSelect
      bookId={bookId}
      fetchData={getPaymentMethods}
      defaultValues={DEFAULT_PAYMENT_METHODS}
      id={paymentMethodId}
      setId={setPaymentMethodId}
      name={paymentMethodName}
      setName={setPaymentMethodName}
      updateEvent="payment-methods-updated"
      placeholder="Payment Type"
      ariaLabel="Payment Type"
      triggerClassName="flex-1"
      allowNone={allowNone}
      onlyExisting={onlyExisting}
    />
  );
}
