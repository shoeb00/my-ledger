import { PaymentMethodEnum } from '../../../enums/payment-methods';

export interface AddRequestPayload {
  bookId: number;
  description: string;
  paymentType: PaymentMethodEnum;
  amount: string;
}
