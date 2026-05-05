'use client';

import { useEffect, useState } from 'react';
import { updateBook, type UpdateBookRequest } from '../actions/book';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Roles } from '@my-ledger/db/schema';
import { useHasPermission } from '../../../../lib';

interface Props extends UpdateBookRequest {
  refetchAction: () => void;
}

export default function EditBook(body: Props) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(body.name ?? '');
  const [desc, setDesc] = useState(body.description ?? '');

  const isOwner = useHasPermission(Roles.AUTHOR);

  useEffect(() => {
    setName(body.name ?? '');
    setDesc(body.description ?? '');
  }, [body.name, body.description]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const { refetchAction, ...payload } = body;
    payload.name = name;
    payload.description = desc;
    const { err } = await updateBook(payload);
    if (err) {
      toast.error(err);
    } else {
      toast.success('Book updated successfully');
      refetchAction();
    }
    setLoading(false);
  };

  if (!isOwner) return null;

  return (
    <form onSubmit={handleUpdate} className="no-style space-y-4">
      <div className="grid gap-3 sm:max-w-[50%]">
        <Label htmlFor="book-name">Name</Label>
        <Input
          id="book-name"
          name="name"
          onChange={e => setName(e.target.value)}
          value={name}
          placeholder="Book Name"
          required
          minLength={3}
          maxLength={50}
        />
      </div>
      <div className="grid gap-3 sm:max-w-[50%]">
        <Label htmlFor="book-description">Description</Label>
        <Input
          id="book-description"
          name="description"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Book Description"
          maxLength={120}
        />
      </div>
      <Button type="submit" disabled={loading || !name}>
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}
