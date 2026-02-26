'use client';

import { getCategories, createCategory, deleteCategory } from '../../../actions/category';
import ClassificationManager from './classification-manager';

export default function CategoryManager({ bookId }: { bookId: number }) {
  return (
    <ClassificationManager
      bookId={bookId}
      fetchData={getCategories}
      createData={createCategory}
      deleteData={deleteCategory}
      updateEvent="categories-updated"
      labels={{
        placeholder: "New Category Name",
        addSuccess: "Category added",
        deleteSuccess: "Category deleted",
        addLabel: "Add"
      }}
    />
  );
}
