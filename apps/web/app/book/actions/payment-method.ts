import { callApi } from '../../lib/api';
import {
  PaymentMethod,
  CreatePaymentMethodRequest,
  GetPaymentMethodsRequest,
  DeletePaymentMethodRequest,
} from '../../types/payment-method';

export const getPaymentMethods = async (
  body: GetPaymentMethodsRequest,
): Promise<{ err: string | null; data: PaymentMethod[] }> => {
  return callApi('/v1/paymentMethod/get', 'GET', { bookId: body.bookId });
};

export const createPaymentMethod = async (
  body: CreatePaymentMethodRequest,
): Promise<{ err: string | null; data: PaymentMethod }> => {
  return callApi('/v1/paymentMethod/create', 'POST', undefined, body);
};

export const deletePaymentMethod = async (
  body: DeletePaymentMethodRequest,
): Promise<{ err: string | null; data: null }> => {
  return callApi('/v1/paymentMethod/delete', 'DELETE', { id: body.id });
};
