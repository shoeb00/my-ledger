import { callApi } from "../../lib/api";
import {
  PaymentMethod,
  CreatePaymentMethodRequest,
  GetPaymentMethodsRequest,
  DeletePaymentMethodRequest,
} from "../../types/payment-method";

export const getPaymentMethods = async (
  body: GetPaymentMethodsRequest,
): Promise<{ err: string | null; data: PaymentMethod[] }> => {
  const res = await callApi("/v1/paymentMethod/get", "GET", {
    bookId: body.bookId,
  });
  return { err: res.err, data: res.data as PaymentMethod[] };
};

export const createPaymentMethod = async (
  body: CreatePaymentMethodRequest,
): Promise<{ err: string | null; data: PaymentMethod }> => {
  const res = await callApi(
    "/v1/paymentMethod/create",
    "POST",
    undefined,
    body,
  );
  return { err: res.err, data: res.data as PaymentMethod };
};

export const deletePaymentMethod = async (
  body: DeletePaymentMethodRequest,
): Promise<{ err: string | null; data: null }> => {
  const res = await callApi("/v1/paymentMethod/delete", "DELETE", {
    id: body.id,
  });
  return { err: res.err, data: res.data as null };
};
