import { PaymentMethodEnum } from '../../../enums/payment-methods';

export interface EditRequestPayload {
  bookId: string;
  transactionId: string;
  description: string;
  paymentMethodId: number | null;
  categoryId: number | null;
  refetchAction: () => void;
}
