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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createBook } from './actions/create-book';
import { toast } from 'sonner';

export default function CreateBook({ refetchAction }: { refetchAction: () => void }) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const fd = new FormData(formRef.current!);
      const book = await createBook(fd);
      console.log('book created', book);
      formRef.current?.reset();
      refetchAction();
      setOpen(false);
      toast.success('Book created successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create book';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-2">Add Book</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form ref={formRef} onSubmit={handleSubmit} className="no-style">
          <DialogHeader>
            <DialogTitle>Create Book</DialogTitle>
            <DialogDescription>Create a new book.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Trip to Goa" required maxLength={50} />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Vacation to Goa"
                maxLength={120}
              />
            </div>
          </div>

          {error && <div className="text-sm text-destructive mt-2">{error}</div>}

          <DialogFooter className="pt-5">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
