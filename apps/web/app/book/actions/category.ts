import { callApi } from '../../lib/api';
import {
  Category,
  CreateCategoryRequest,
  GetCategoriesRequest,
  DeleteCategoryRequest,
} from '../../types/category';

export const getCategories = async (
  body: GetCategoriesRequest,
): Promise<{ err: string | null; data: Category[] }> => {
  return callApi('/v1/categories/get', 'GET', { bookId: body.bookId });
};

export const createCategory = async (
  body: CreateCategoryRequest,
): Promise<{ err: string | null; data: Category }> => {
  return callApi('/v1/categories/create', 'POST', undefined, body);
};

export const deleteCategory = async (
  body: DeleteCategoryRequest,
): Promise<{ err: string | null; data: null }> => {
  return callApi('/v1/categories/delete', 'DELETE', { id: body.id });
};
