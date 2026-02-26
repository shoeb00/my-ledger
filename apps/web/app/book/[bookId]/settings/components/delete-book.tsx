'use client';

import { useState } from 'react';
import { deleteBook, type UpdateBookRequest } from '../actions/book';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Roles } from '@my-ledger/api/role';
import { useHasPermission } from '../../../../lib';

export default function DeleteBook(body: Omit<UpdateBookRequest, 'description'>) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [nameInput, setNameInput] = useState('');

  const isOwner = useHasPermission(Roles.AUTHOR);

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const { err } = await deleteBook(body.bookId);
    if (err) {
      toast.error(err);
      setLoading(false);
    } else {
      toast.success(`Book '${body.name}' deleted successfully`);
      router.push('/home');
    }
  };

  if (!isOwner) return null;

  return (
    <form onSubmit={handleDelete} className="no-style space-y-4">
      <p className="text-sm text-muted-foreground">
        All transactions in this book will be permanently deleted. This action cannot be undone.
      </p>
      <div className="grid gap-3 sm:max-w-[50%]">
        <Label htmlFor="delete-confirm">
          Type <span className="font-semibold text-foreground">{body.name}</span> to confirm
        </Label>
        <Input
          id="delete-confirm"
          onChange={e => setNameInput(e.target.value)}
          value={nameInput}
          placeholder={body.name}
          required
        />
      </div>
      <Button variant="destructive" type="submit" disabled={nameInput !== body.name || loading}>
        {loading ? 'Deleting...' : 'Delete Book'}
      </Button>
    </form>
  );
}
