import { callApi } from "../../lib/api";
import {
  PaymentMethod,
  CreatePaymentMethodRequest,
  GetPaymentMethodsRequest,
  DeletePaymentMethodRequest,
} from "../../types/payment-method";

// TODO: Create a central cache service
const PAYMENT_METHOD_CACHE_TTL = 30_000;
const paymentMethodCache = new Map<
  number,
  { data: PaymentMethod[]; expiresAt: number }
>();

export const getPaymentMethods = async (
  body: GetPaymentMethodsRequest,
): Promise<{ err: string | null; data: PaymentMethod[] }> => {
  const cached = paymentMethodCache.get(body.bookId);
  if (cached && cached.expiresAt > Date.now()) {
    return { err: null, data: cached.data };
  }

  const result = await callApi("/v1/paymentMethod/get", "GET", {
    bookId: body.bookId,
  });
  if (!result.err && result.data) {
    paymentMethodCache.set(body.bookId, {
      data: result.data as PaymentMethod[],
      expiresAt: Date.now() + PAYMENT_METHOD_CACHE_TTL,
    });
  }
  return result;
};

export const createPaymentMethod = async (
  body: CreatePaymentMethodRequest,
): Promise<{ err: string | null; data: PaymentMethod }> => {
  const result = await callApi("/v1/paymentMethod/create", "POST", undefined, body);
  if (!result.err) paymentMethodCache.delete(body.bookId);
  return result;
};

export const deletePaymentMethod = async (
  body: DeletePaymentMethodRequest,
): Promise<{ err: string | null; data: null }> => {
  const result = await callApi("/v1/paymentMethod/delete", "DELETE", {
    bookId: body.bookId,
    id: body.id,
  });
  if (!result.err) paymentMethodCache.delete(body.bookId);
  return result;
};
