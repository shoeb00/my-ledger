export interface Category {
  id: number;
  bookId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  bookId: number;
  name: string;
}

export interface GetCategoriesRequest {
  bookId: number;
}

export interface DeleteCategoryRequest {
  id: number;
}
