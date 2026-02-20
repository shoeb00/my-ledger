'use client';
import { useState, useEffect } from 'react';
import { Category } from '../../../../types/category';
import { getCategories, createCategory, deleteCategory } from '../../../actions/category';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import LoaderCircle from '../../../../components/loader';

interface CategoryManagerProps {
  bookId: number;
}

export default function CategoryManager({ bookId }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    const { err, data } = await getCategories({ bookId });
    if (err) {
      toast.error(err);
    } else {
      setCategories(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, [bookId]);

  const handleAdd = async (name: string) => {
    if (!name.trim()) return;
    setAdding(true);
    setLoading(true);
    const { err } = await createCategory({ bookId, name });
    if (err) {
      toast.error(err);
    } else {
      toast.success('Category added');
      setNewName('');
      fetchCategories();
      window.dispatchEvent(new Event('categories-updated'));
    }
    setLoading(false);
    setAdding(false);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    const { err } = await deleteCategory({ id });
    if (err) {
      toast.error(err);
    } else {
      toast.success('Category deleted');
      setCategories(categories.filter(c => c.id !== id));
      window.dispatchEvent(new Event('categories-updated'));
    }
    setLoading(false);
  };

  const isDuplicate = categories.some(c => c.name === newName);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 sm:max-w-[50%]">
        <Input
          placeholder="New Category Name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !isDuplicate && handleAdd(newName)}
        />
        <Button onClick={() => handleAdd(newName)} disabled={adding || !newName || isDuplicate}>
          {adding ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus className="h-4 w-4" />}
          <span className="ml-2 hidden sm:inline">Add</span>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <LoaderCircle loading={loading}>
          {categories.map(category => (
            <Badge
              key={category.id}
              variant={categories.length === 1 ? 'secondary' : 'outline'}
              className="px-3 py-1 text-sm font-normal gap-2 pr-1"
            >
              {category.name}
              <div
                hidden={categories.length === 1}
                role="button"
                className="rounded-full hover:bg-destructive/10 p-0.5 transition-colors cursor-pointer text-destructive"
                onClick={() => handleDelete(category.id)}
              >
                <X className="h-3 w-3" />
              </div>
            </Badge>
          ))}
        </LoaderCircle>
      </div>
    </div>
  );
}
