import { toast } from 'sonner';
import ConfirmationDialog from '../../components/confirmation-dialog';
import { removeBookMembers } from '../actions/members';
import { useParams } from 'next/navigation';
import { Roles } from '@my-ledger/api/role';
import { useBookRole } from '../../../../context';

type Props = {
  userId: string;
  refetchAction: () => void;
  role: Roles;
};

export default function RemoveMember({ userId, refetchAction, role }: Props) {
  const param = useParams();
  const bookId = param.bookId as string;

  const owner = useBookRole(bookId).role === Roles.AUTHOR;

  const removeMember = async (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setLoading(true);
    const { err } = await removeBookMembers(bookId, userId);
    if (err) {
      toast.error(err);
    } else {
      toast.success('Member removed successfully');
      refetchAction();
    }
    setLoading(false);
    setOpen(false);
  };
  return <ConfirmationDialog handleDelete={removeMember} disabled={Roles.AUTHOR === role} hidden={!owner} />;
}
