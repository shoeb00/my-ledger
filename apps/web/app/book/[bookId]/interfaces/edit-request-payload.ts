import { PaymentMethodEnum } from '../../../enums/payment-methods';

export interface EditRequestPayload {
  bookId: string;
  transactionId: string;
  description: string;
  paymentType: PaymentMethodEnum;
  refetchAction: () => void;
}
