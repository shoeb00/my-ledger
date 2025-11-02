'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import createBook from './actions/create-book';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  console.log('pending');
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </Button>
  );
}

export default function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Book</Button>
      </DialogTrigger>
      <form action={createBook}>
        <DialogContent className="sm:max-w-[425px] bg-gray-200">
          <DialogHeader>
            <DialogTitle>Create Book</DialogTitle>
            <DialogDescription>Create a new book.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="Trip to Goa" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" placeholder="Vacation to Goa" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="authorId">AuthorId</Label>
              <Input id="authorId" name="authorId" defaultValue="1" disabled />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
