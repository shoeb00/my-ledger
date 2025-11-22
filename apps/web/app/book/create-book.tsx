'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createBook } from './actions/create-book';

export default function CreateBook() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const fd = new FormData(formRef.current!);
      const book = await createBook(fd);
      console.log('book created', book);
      formRef.current?.reset();
    } catch (err: any) {
      console.error('createBook error', err);
      setError(err.message ?? 'Failed to create book');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-2">Add Book</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-gray-200">
        <form ref={formRef} onSubmit={handleSubmit} className="no-style">
          <DialogHeader>
            <DialogTitle>Create Book</DialogTitle>
            <DialogDescription>Create a new book.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Trip to Goa" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" placeholder="Vacation to Goa" />
            </div>
          </div>

          {error && <div className="text-sm text-destructive mt-2">{error}</div>}

          <DialogFooter className="pt-5">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>

            {/* Keep this as a normal submit button (do not wrap with DialogClose) */}
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
