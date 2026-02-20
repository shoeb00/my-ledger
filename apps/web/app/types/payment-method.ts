export interface PaymentMethod {
  id: number;
  bookId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentMethodRequest {
  bookId: number;
  name: string;
}

export interface GetPaymentMethodsRequest {
  bookId: number;
}

export interface DeletePaymentMethodRequest {
  id: number;
}
