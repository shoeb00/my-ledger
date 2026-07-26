import { callApi } from "../../lib/api";
import {
  Category,
  CreateCategoryRequest,
  GetCategoriesRequest,
  DeleteCategoryRequest,
} from "../../types/category";

export const getCategories = async (
  body: GetCategoriesRequest,
): Promise<{ err: string | null; data: Category[] }> => {
  const res = await callApi("/v1/categories/get", "GET", {
    bookId: body.bookId,
  });
  return { err: res.err, data: res.data as Category[] };
};

export const createCategory = async (
  body: CreateCategoryRequest,
): Promise<{ err: string | null; data: Category }> => {
  const res = await callApi("/v1/categories/create", "POST", undefined, body);
  return { err: res.err, data: res.data as Category };
};

export const deleteCategory = async (
  body: DeleteCategoryRequest,
): Promise<{ err: string | null; data: null }> => {
  const res = await callApi("/v1/categories/delete", "DELETE", { id: body.id });
  return { err: res.err, data: res.data as null };
};
