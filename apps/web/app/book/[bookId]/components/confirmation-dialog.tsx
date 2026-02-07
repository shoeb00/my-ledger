import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import LoaderCircle from '../../../components/loader';

type Props = {
  handleDelete: (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    loading: boolean
  ) => void;
  disabled?: boolean;
  hidden?: boolean;
};

export default function ConfirmationDialog({ handleDelete, disabled = false, hidden = false }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} hidden={hidden} size="sm" variant="ghost">
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <LoaderCircle loading={loading}>
          <DialogTitle className="font-bold text-2xl">Are you sure? </DialogTitle>
          The action cannot be undone
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button disabled={loading} variant="destructive" onClick={() => handleDelete(setLoading, setOpen, loading)}>
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </LoaderCircle>
      </DialogContent>

    </Dialog>
  );
}
