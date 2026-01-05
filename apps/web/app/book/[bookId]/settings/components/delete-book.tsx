import { useState } from 'react';
import { deleteBook, type UpdateBookRequest } from '../actions/book';
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
import { Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { DialogDescription } from '@radix-ui/react-dialog';

export default function DeleteBook(body: Omit<UpdateBookRequest, 'description'>) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(body.name);

  const handleDelete = async () => {
    if (loading) return;
    setLoading(true);
    const { err } = await deleteBook(body.bookId);
    if (err) {
      toast.error(err);
    } else {
      toast.success(`Book '${body.name}' deleted successfully`);
      router.push('/home');
    }
    setOpen(false);
    setLoading(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={loading}>
          <Trash2Icon />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Delete Book</DialogTitle>
        <DialogDescription>
          All transactions in this book will be deleted. The data will be permanently deleted. Do
          you want to continue?
        </DialogDescription>

        <p className="text-sm text-muted-foreground italic">
          Enter the name of the book to confirm deletion
        </p>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          onChange={e => setName(e.target.value)}
          value={name}
          placeholder={body.name}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button disabled={name !== body.name || loading} onClick={handleDelete}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
