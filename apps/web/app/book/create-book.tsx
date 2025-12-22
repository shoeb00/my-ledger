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
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(formRef.current!);
    const { err } = await createBook(formData);
    if (err) {
      toast.error(err);
    } else {
      formRef.current?.reset();
      refetchAction();
      toast.success('Book created successfully');
    }
    setOpen(false);
    setLoading(false);
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
