'use client';

import { getCategories } from '../book/actions/category';
import { DEFAULT_CATEGORIES } from '../lib/constants';
import ClassificationSelect from './classification-select';

export default function CategorySelect({
  categoryId,
  setCategoryId,
  bookId,
  categoryName,
  setCategoryName,
  allowNone,
  onlyExisting
}: {
  categoryId: number | null;
  setCategoryId: (v: number | null) => void;
  bookId: number;
  categoryName?: string | null;
  setCategoryName?: (v: string | null) => void;
  allowNone?: boolean;
  onlyExisting?: boolean;
}) {
  return (
    <ClassificationSelect
      bookId={bookId}
      fetchData={getCategories}
      defaultValues={DEFAULT_CATEGORIES}
      id={categoryId}
      setId={setCategoryId}
      name={categoryName}
      setName={setCategoryName}
      updateEvent="categories-updated"
      placeholder="Category"
      ariaLabel="Category"
      allowNone={allowNone}
      onlyExisting={onlyExisting}
    />
  );
}
