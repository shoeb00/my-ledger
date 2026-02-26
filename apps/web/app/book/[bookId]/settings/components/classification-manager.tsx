'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import LoaderCircle from '../../../../components/loader';

interface Item {
  id: number;
  name: string;
}

interface ClassificationManagerProps {
  bookId: number;
  fetchData: (params: { bookId: number }) => Promise<{ data: any[]; err?: string | null }>;
  createData: (params: { bookId: number; name: string }) => Promise<{ data?: any; err?: string | null }>;
  deleteData: (params: { id: number }) => Promise<{ err?: string | null }>;
  updateEvent: string;
  labels: {
    placeholder: string;
    addSuccess: string;
    deleteSuccess: string;
    addLabel: string;
  };
}

export default function ClassificationManager({
  bookId,
  fetchData,
  createData,
  deleteData,
  updateEvent,
  labels,
}: ClassificationManagerProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const { err, data } = await fetchData({ bookId });
    if (err) {
      toast.error(err);
    } else if (data) {
      setItems(data.sort((a, b) => a.name.localeCompare(b.name)));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [bookId]);

  const handleAdd = async (name: string) => {
    if (!name.trim()) return;
    setLoading(true);
    setAdding(true);
    const { err } = await createData({ bookId, name });
    if (err) {
      toast.error(err);
    } else {
      toast.success(labels.addSuccess);
      setNewName('');
      fetchItems();
      window.dispatchEvent(new Event(updateEvent));
    }
    setLoading(false);
    setAdding(false);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    const { err } = await deleteData({ id });
    if (err) {
      toast.error(err);
    } else {
      toast.success(labels.deleteSuccess);
      setItems(items.filter(item => item.id !== id));
      window.dispatchEvent(new Event(updateEvent));
    }
    setLoading(false);
  };

  const isDuplicate = items.some(item => item.name.toLowerCase() === newName.toLowerCase());

  return (
    <div className="space-y-4">
      <div className="flex gap-2 sm:max-w-[50%]">
        <Input
          placeholder={labels.placeholder}
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !isDuplicate && handleAdd(newName)}
        />
        <Button onClick={() => handleAdd(newName)} disabled={adding || !newName || isDuplicate}>
          {adding ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus className="h-4 w-4" />}
          <span className="ml-2 hidden sm:inline">{labels.addLabel}</span>
        </Button>
      </div>

      <div className="flex">
        <LoaderCircle loading={loading} className={loading ? 'min-h-30' : ''}>
          <div className="flex flex-row flex-wrap gap-2 sm:max-w-[50%]">
            {items.map(item => (
              <Badge
                key={item.id}
                variant={'outline'}
                hashString={item.name}
                className="px-3 py-1 text-sm font-normal gap-2 pr-1"
              >
                {item.name}
                <div
                  hidden={items.length === 1}
                  role="button"
                  className="rounded-full hover:bg-destructive/10 p-0.5 transition-colors cursor-pointer text-destructive"
                  onClick={() => handleDelete(item.id)}
                >
                  <X className="h-3 w-3" />
                </div>
              </Badge>
            ))}
          </div>
        </LoaderCircle>
      </div>
    </div>
  );
}
