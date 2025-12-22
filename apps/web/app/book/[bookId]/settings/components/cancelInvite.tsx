import ConfirmationDialog from '../../components/confirmation-dialog';
import { cancelInvitation } from '../actions/invitations';
import { toast } from 'sonner';

export default function CancelInvitation({
  inviteId,
  refetchAction,
}: {
  inviteId: string;
  refetchAction: () => void;
}) {
  const handleCancelInvite = async (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
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
  return <ConfirmationDialog handleDelete={handleCancelInvite} />;
}
