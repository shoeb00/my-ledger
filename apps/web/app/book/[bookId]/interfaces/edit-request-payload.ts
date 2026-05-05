export interface EditRequestPayload {
  bookId: string;
  transactionId: string;
  description: string;
  paymentMethodId: number | null;
  createdAt: Date;
  categoryId: number | null;
  refetchAction: () => void;
}
