import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { EditIcon } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import PaymentMethodSelect from '../../../components/payment-method';
import CategorySelect from '../../../components/category';
import { updateTransaction } from '../actions/update-transaction';
import { EditRequestPayload } from '../interfaces/edit-request-payload';
import { toast } from 'sonner';
import { useHasPermission } from '../../../lib';
import { Roles } from '@my-ledger/api/role';
import LoaderCircle from '../../../components/loader';

export default function EditTransactionDialog(query: EditRequestPayload) {
  const canEdit = !useHasPermission(Roles.EDITOR);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState(query.description);
  const [paymentMethodId, setPaymentMethodId] = useState<number | null>(query.paymentMethodId);
  const [categoryId, setCategoryId] = useState<number | null>(query.categoryId);
  
  async function handleUpdate() {
    if (loading) return;
    setLoading(true);
    const { refetchAction, ...rest } = query;
    const { err } = await updateTransaction({ 
      ...rest, 
      description, 
      paymentMethodId, 
      categoryId 
    });
    if (err) {
      toast.error(err);
    } else {
      toast.success('Transaction updated successfully');
      refetchAction();
    }
    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" hidden={canEdit}>
          <EditIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <LoaderCircle loading={loading}>
          <DialogTitle className="font-bold text-2xl">Update Transaction</DialogTitle>
          <Input
            placeholder="Transaction description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <div className="flex gap-2">
            <PaymentMethodSelect 
              paymentMethodId={paymentMethodId} 
              setPaymentMethodId={setPaymentMethodId} 
              bookId={Number(query.bookId)} 
            />
            <CategorySelect 
              categoryId={categoryId} 
              setCategoryId={setCategoryId} 
              bookId={Number(query.bookId)} 
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={loading}>{loading ? 'Updating...' : 'Update'}</Button>
          </DialogFooter>
        </LoaderCircle>
      </DialogContent>
    </Dialog>
  );
}
