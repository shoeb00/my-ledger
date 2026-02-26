'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

interface SelectOption {
  id: number | null;
  name: string;
}

interface ClassificationSelectProps {
  bookId: number;
  fetchData: (params: { bookId: number }) => Promise<{ data: any[]; err?: string | null }>;
  defaultValues: string[];
  id: number | null;
  setId: (v: number | null) => void;
  name?: string | null;
  setName?: (v: string | null) => void;
  updateEvent?: string;
  placeholder: string;
  ariaLabel: string;
  triggerClassName?: string;
  allowNone?: boolean;
  onlyExisting?: boolean;
}

export default function ClassificationSelect({
  bookId,
  fetchData,
  defaultValues,
  id,
  setId,
  name,
  setName,
  updateEvent,
  placeholder,
  ariaLabel,
  triggerClassName = 'w-40',
  allowNone = false,
  onlyExisting = false,
}: ClassificationSelectProps) {
  const [items, setItems] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const { data } = await fetchData({ bookId });
      const defaultItems = defaultValues.filter(v => !data.find(d => d.name === v)).map(v => ({ name: v, id: null }));
      const allItems = onlyExisting ? data : [...defaultItems, ...data];
      allItems.sort((a, b) => a.name.localeCompare(b.name));

      setItems(allItems);
      setLoading(false);
    };

    fetchItems();

    if (updateEvent) {
      window.addEventListener(updateEvent, fetchItems);
      return () => {
        window.removeEventListener(updateEvent, fetchItems);
      };
    }
  }, [bookId, fetchData, updateEvent]);

  const handleValueChange = (value: string) => {
    if (value === 'none') {
      setId(0); // 0 is the sentinel for "IS NULL" filter
      if (setName) setName(null);
    } else if (value.startsWith('default-')) {
      setId(null);
      if (setName) setName(value.replace('default-', ''));
    } else {
      if (setName) setName(null);
      setId(Number(value));
    }
  }

  const selectedItemName = id
    ? items.find(item => item.id === id)?.name
    : name || placeholder;
  return (
    <Select
      onValueChange={handleValueChange}
      value={id ? id.toString() : name ? `default-${name}` : ''}
    >
      <SelectTrigger aria-label={ariaLabel} className={triggerClassName}>
        {loading
          ? <Loader className="h-4 w-4 animate-spin shrink-0" />
          : <SelectValue placeholder={placeholder} />
        }
      </SelectTrigger>
      <SelectContent>
        {allowNone && (
          <SelectItem value="none">None</SelectItem>
        )}
        {items.map((item, index) => {
          return (
            <SelectItem key={item.id || index} value={item.id?.toString() || `default-${item.name}`}>
              {item.name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
