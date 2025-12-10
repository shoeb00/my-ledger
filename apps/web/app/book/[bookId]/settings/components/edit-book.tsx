'use client';

import { useEffect, useState } from 'react';
import { updateBook, type UpdateBookRequest } from '../actions/book';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Edit2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props extends UpdateBookRequest {
  refetchBookAction: () => void;
}

export default function EditBook(body: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    if (open) {
      setName(body.name ?? '');
      setDesc(body.description ?? '');
    }
  }, [open, body.name, body.description]);

  const handleUpdate = async () => {
    setLoading(true);
    const { refetchBookAction, ...payload } = body;
    payload.name = name;
    payload.description = desc;
    const { err } = await updateBook(payload);
    if (err) {
      toast.error(err);
    } else {
      toast.success('Book updated successfully');
      refetchBookAction();
    }
    setOpen(false);
    setLoading(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Edit2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Update Book Details</DialogTitle>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              onChange={e => setName(e.target.value)}
              value={name}
              placeholder="Book Name"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Book Description"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
