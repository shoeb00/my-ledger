export interface AddRequestPayload {
  bookId: number;
  description: string;
  paymentMethodId: number | null;
  paymentMethodName?: string | null;
  categoryId: number | null;
  categoryName?: string | null;
  amount: string;
}
