'use client';

import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { getCategories } from '../book/actions/category';
import { Category } from '../types/category';
import { Loader } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '../lib/constants';

export default function CategorySelect({
  categoryId,
  setCategoryId,
  bookId,
  categoryName,
  setCategoryName,
}: {
  categoryId: number | null;
  setCategoryId: (v: number | null) => void;
  bookId: number;
  categoryName?: string | null;
  setCategoryName?: (v: string | null) => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const { data } = await getCategories({ bookId });
      if (data) {
        setCategories(data);
      }
      setLoading(false);
    };
    fetchCategories();

    window.addEventListener('categories-updated', fetchCategories);
    return () => {
      window.removeEventListener('categories-updated', fetchCategories);
    };
  }, [bookId]);

  const selectedCategory = categoryId
    ? categories.find(cat => cat.id === categoryId)?.name
    : categoryName
      ? categoryName
      : 'Category';

  const customCategories = categories.filter(c => !DEFAULT_CATEGORIES.includes(c.name));

  return (
    <Select
      onValueChange={value => {
        if (value.startsWith('default-')) {
          setCategoryId(null);
          if (setCategoryName) setCategoryName(value.replace('default-', ''));
        } else {
          if (setCategoryName) setCategoryName(null);
          setCategoryId(Number(value));
        }
      }}
      value={categoryId ? categoryId.toString() : categoryName ? `default-${categoryName}` : ''}
    >
      <SelectTrigger aria-label="Category" className="w-40">
        <div className="flex items-center gap-2">
          {loading ? <Loader className="h-4 w-4 animate-spin" /> : null}
          <span className="text-sm">{selectedCategory}</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {DEFAULT_CATEGORIES.map(cat => (
          <SelectItem key={cat} value={`default-${cat}`}>
            {cat}
          </SelectItem>
        ))}
        {customCategories.map(cat => (
          <SelectItem key={cat.id} value={cat.id.toString()}>
            {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
