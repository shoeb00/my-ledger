import { callApi } from "../../lib/api";
import {
  Category,
  CreateCategoryRequest,
  GetCategoriesRequest,
  DeleteCategoryRequest,
} from "../../types/category";

const CATEGORY_CACHE_TTL = 30_000;
const categoryCache = new Map<
  number,
  { data: Category[]; expiresAt: number }
>();

export const getCategories = async (
  body: GetCategoriesRequest,
): Promise<{ err: string | null; data: Category[] }> => {
  const cached = categoryCache.get(body.bookId);
  if (cached && cached.expiresAt > Date.now()) {
    return { err: null, data: cached.data };
  }

  const result = await callApi("/v1/categories/get", "GET", {
    bookId: body.bookId,
  });
  if (!result.err && result.data) {
    categoryCache.set(body.bookId, {
      data: result.data as Category[],
      expiresAt: Date.now() + CATEGORY_CACHE_TTL,
    });
  }
  return result;
};

export const createCategory = async (
  body: CreateCategoryRequest,
): Promise<{ err: string | null; data: Category }> => {
  const result = await callApi(
    "/v1/categories/create",
    "POST",
    undefined,
    body,
  );
  if (!result.err) categoryCache.delete(body.bookId);
  return result;
};

export const deleteCategory = async (
  body: DeleteCategoryRequest,
): Promise<{ err: string | null; data: null }> => {
  const result = await callApi("/v1/categories/delete", "DELETE", {
    id: body.id,
    bookId: body.bookId,
  });
  if (!result.err) categoryCache.delete(body.bookId);
  return result;
};
