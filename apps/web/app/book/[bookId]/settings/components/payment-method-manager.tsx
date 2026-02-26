'use client';

import {
    getPaymentMethods,
    createPaymentMethod,
    deletePaymentMethod,
} from '../../../actions/payment-method';
import ClassificationManager from './classification-manager';

export default function PaymentMethodManager({ bookId }: { bookId: number }) {
  return (
    <ClassificationManager
      bookId={bookId}
      fetchData={getPaymentMethods}
      createData={createPaymentMethod}
      deleteData={deletePaymentMethod}
      updateEvent="payment-methods-updated"
      labels={{
        placeholder: "New Payment Method Name",
        addSuccess: "Payment method added",
        deleteSuccess: "Payment method deleted",
        addLabel: "Add"
      }}
    />
  );
}
