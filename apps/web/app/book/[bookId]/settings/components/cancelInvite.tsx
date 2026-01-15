import ConfirmationDialog from '../../components/confirmation-dialog';
import { cancelInvitation } from '../actions/invitations';
import { toast } from 'sonner';
import { useHasPermission } from '../../../../lib';
import { Roles } from '@my-ledger/api/role';

export default function CancelInvitation({
  inviteId,
  refetchAction,
  loading,
}: {
  inviteId: string;
  refetchAction: () => void;
  loading: boolean;
}) {
  const canEdit = !useHasPermission(Roles.EDITOR);
  const handleCancelInvite = async (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (loading) return;
    setLoading(true);
    const { err } = await cancelInvitation(inviteId);
    if (err) {
      toast.error(err);
    } else {
      toast.success('Invitation cancelled successfully');
      refetchAction();
    }
    setLoading(false);
    setOpen(false);
  };
  return <ConfirmationDialog handleDelete={handleCancelInvite} hidden={canEdit} />;
}
